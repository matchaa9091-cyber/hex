export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { parseMobileMoneySms } from "@/lib/httpsms/parser";
import { executeD1Query } from "@/lib/d1";
import { activateApplication } from "@/lib/httpsms/activate";

export async function GET() {
  return NextResponse.json({
    status: "active",
    service: "Hex Escorts httpSMS Webhook",
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Extract message fields from httpSMS payload structure
    const data = body?.data || body;
    const content = data?.content;
    const messageId = data?.id || data?.message_id || body?.id || `msg-${Date.now()}`;
    const contact = data?.contact || "";
    const owner = data?.owner || "";

    if (!content) {
      return NextResponse.json({ error: "Missing SMS content" }, { status: 400 });
    }

    console.log(`[httpSMS Webhook] Received SMS: "${content}" from ${contact} to ${owner}`);

    // Parse Mobile Money text
    const parsed = parseMobileMoneySms(content);

    // Only process incoming payments of 20,000 UGX and above
    if (!parsed.isPayment || parsed.amount < 20000) {
      console.log(`[httpSMS Webhook] Ignored SMS: isPayment=${parsed.isPayment}, amount=${parsed.amount} (min required 20,000 UGX)`);
      return NextResponse.json({
        success: true,
        processed: false,
        reason: "Message is not an incoming payment of 20,000 UGX or above",
        parsed: {
          isPayment: parsed.isPayment,
          amount: parsed.amount,
          provider: parsed.provider
        }
      });
    }

    // Generate unique payment ID
    const paymentId = `pay-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const phoneToStore = parsed.normalizedPhone || contact.replace(/\D/g, '').slice(-9) || null;

    // Insert into D1 httpsms_payments table
    try {
      const insertSql = `
        INSERT OR IGNORE INTO httpsms_payments (
          id, message_id, sender_contact, sender_phone, sender_name,
          amount, currency, transaction_id, raw_content, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'unclaimed');
      `;
      await executeD1Query(insertSql, [
        paymentId,
        messageId,
        contact,
        phoneToStore,
        parsed.senderName,
        parsed.amount,
        parsed.currency,
        parsed.transactionId,
        content
      ]);
    } catch (dbErr) {
      console.error("[httpSMS Webhook] D1 insert payment error:", dbErr);
    }

    // Try auto-matching against pending escort applications
    let matchedAppId: string | null = null;
    try {
      const candidates = await executeD1Query(`
        SELECT id, name, phone, payment_phone, transaction_id, plan, status 
        FROM escort_applications 
        WHERE status IN ('pending_payment', 'pending_verification')
        ORDER BY created_at DESC
        LIMIT 20;
      `);

      for (const app of candidates) {
        let isMatch = false;

        // Match by Transaction ID
        if (parsed.transactionId && app.transaction_id) {
          const appTx = app.transaction_id.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
          if (appTx === parsed.transactionId) {
            isMatch = true;
          }
        }

        // Match by Phone number (last 9 digits)
        if (!isMatch && phoneToStore) {
          const appPhone = (app.payment_phone || app.phone || "").replace(/\D/g, '').slice(-9);
          if (appPhone && appPhone === phoneToStore) {
            isMatch = true;
          }
        }

        if (isMatch) {
          matchedAppId = app.id;
          console.log(`[httpSMS Webhook] Match found for application ${app.id} (${app.name})! Activating profile...`);
          await activateApplication(app.id, {
            paymentId,
            amount: parsed.amount,
            transactionId: parsed.transactionId,
            phone: phoneToStore,
            provider: parsed.provider,
          });
          break;
        }
      }
    } catch (matchErr) {
      console.error("[httpSMS Webhook] Error matching application:", matchErr);
    }

    return NextResponse.json({
      success: true,
      processed: true,
      paymentId,
      amount: parsed.amount,
      transactionId: parsed.transactionId,
      senderPhone: phoneToStore,
      matchedApplicationId: matchedAppId,
      message: matchedAppId ? "Payment verified and application activated!" : "Payment recorded as unclaimed and ready to verify.",
    });
  } catch (err: any) {
    console.error("[httpSMS Webhook] Processing error:", err);
    return NextResponse.json({ error: err?.message || "Internal webhook error" }, { status: 500 });
  }
}
