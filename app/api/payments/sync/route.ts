export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { executeD1Query } from "@/lib/d1";
import { parseMobileMoneySms } from "@/lib/httpsms/parser";

const HTTPSMS_API_KEY = process.env.HTTPSMS_API_KEY || "uk_ZQL-ts3m-G47lIxW3s7hpdu6H3Xt-rmm28o-9_TqFo0dbxOrAW6MHmLASMifE8S6";
const HTTPSMS_PHONE_NUMBER = process.env.HTTPSMS_PHONE_NUMBER || "+256765040502";

export async function POST() {
  try {
    if (!HTTPSMS_API_KEY) {
      return NextResponse.json({ error: "Missing HTTPSMS_API_KEY" }, { status: 500 });
    }

    const ownerParam = encodeURIComponent(HTTPSMS_PHONE_NUMBER);
    const contacts = ["MTNMobMoney", "AirtelMoney"];
    let insertedCount = 0;
    let totalFound = 0;

    for (const contact of contacts) {
      try {
        const url = `https://api.httpsms.com/v1/messages?owner=${ownerParam}&contact=${encodeURIComponent(contact)}&limit=50`;
        const res = await fetch(url, {
          headers: {
            'x-api-key': HTTPSMS_API_KEY,
            'Accept': 'application/json'
          },
          cache: 'no-store'
        });

        if (res.ok) {
          const result = await res.json();
          const messages = Array.isArray(result?.data) ? result.data : [];
          totalFound += messages.length;

          for (const msg of messages) {
            const content = msg.content || "";
            if (!content) continue;

            const parsed = parseMobileMoneySms(content);
            const initialStatus = parsed.isPayment ? 'unclaimed' : 'info';
            const phoneToStore = parsed.normalizedPhone || null;
            const paymentId = `pay-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

            // Check if already in D1 by message_id
            const existing = await executeD1Query(
              "SELECT id FROM httpsms_payments WHERE message_id = ? LIMIT 1;",
              [msg.id]
            );

            if (!existing || existing.length === 0) {
              const insertSql = `
                INSERT INTO httpsms_payments (
                  id, message_id, sender_contact, sender_phone, sender_name,
                  amount, currency, transaction_id, raw_content, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
              `;
              await executeD1Query(insertSql, [
                paymentId,
                msg.id,
                contact,
                phoneToStore,
                parsed.senderName,
                parsed.amount || 0,
                parsed.currency || 'UGX',
                parsed.transactionId,
                content,
                initialStatus
              ]);
              insertedCount++;
            }
          }
        }
      } catch (contactErr) {
        console.error(`Error syncing contact ${contact}:`, contactErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Sync complete! Synced ${insertedCount} new SMS messages (${totalFound} total checked).`,
      newCount: insertedCount,
      totalChecked: totalFound,
    });
  } catch (err: any) {
    console.error("httpSMS sync error:", err);
    return NextResponse.json({ error: err?.message || "Sync failed" }, { status: 500 });
  }
}
