export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { parseMobileMoneySms } from "@/lib/httpsms/parser";
import { executeD1Query } from "@/lib/d1";
import { activateApplication, getPendingApplications } from "@/lib/httpsms/activate";

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

    // Generate unique payment ID
    const paymentId = `pay-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const phoneToStore = parsed.normalizedPhone || contact.replace(/\D/g, '').slice(-9) || null;
    const initialStatus = parsed.isPayment ? 'unclaimed' : 'info';

    // Insert into D1 httpsms_payments table regardless of amount so admin sees all messages
    try {
      const insertSql = `
        INSERT OR IGNORE INTO httpsms_payments (
          id, message_id, sender_contact, sender_phone, sender_name,
          amount, currency, transaction_id, raw_content, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;
      await executeD1Query(insertSql, [
        paymentId,
        messageId,
        contact,
        phoneToStore,
        parsed.senderName,
        parsed.amount || 0,
        parsed.currency || 'UGX',
        parsed.transactionId,
        content,
        initialStatus
      ]);
    } catch (dbErr) {
      console.error("[httpSMS Webhook] D1 insert payment error:", dbErr);
    }

    // If not a recognized payment or amount is below 10,000 UGX, keep as recorded
    if (!parsed.isPayment || parsed.amount < 10000) {
      return NextResponse.json({
        success: true,
        processed: true,
        savedToAdmin: true,
        isPayment: parsed.isPayment,
        amount: parsed.amount,
        status: initialStatus,
        message: "SMS recorded in admin panel."
      });
    }

    // Try auto-matching against pending escort applications
    let matchedAppId: string | null = null;
    try {
      const candidates = await getPendingApplications();

      for (const app of candidates) {
        let isMatch = false;

        // Match by Transaction ID
        if (parsed.transactionId && app.transaction_id) {
          const appTx = app.transaction_id.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
          const cleanParsedTx = parsed.transactionId.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
          if (appTx === cleanParsedTx) {
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
