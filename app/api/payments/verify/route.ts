export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { executeD1Query } from "@/lib/d1";
import { parseMobileMoneySms, normalizeUgandanPhone } from "@/lib/httpsms/parser";
import { activateApplication } from "@/lib/httpsms/activate";

const HTTPSMS_API_KEY = process.env.HTTPSMS_API_KEY;
const HTTPSMS_PHONE_NUMBER = process.env.HTTPSMS_PHONE_NUMBER || "+256765040502";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { applicationId, phone, transactionId } = body;

    if (!applicationId) {
      return NextResponse.json({ error: "Application ID is required" }, { status: 400 });
    }

    const normPhone = normalizeUgandanPhone(phone);
    const normTx = transactionId ? transactionId.replace(/[^A-Za-z0-9]/g, '').toUpperCase() : null;

    if (!normPhone && !normTx) {
      return NextResponse.json({
        error: "Please provide either the phone number used to send payment or the Transaction ID."
      }, { status: 400 });
    }

    // ── STEP 1: Search in D1 httpsms_payments for an unclaimed payment >= 20,000 UGX
    let matchedPayment: any = null;

    // Check by Transaction ID first (most accurate)
    if (normTx) {
      const txRows = await executeD1Query(`
        SELECT * FROM httpsms_payments 
        WHERE status = 'unclaimed' 
          AND amount >= 20000 
          AND UPPER(REPLACE(REPLACE(transaction_id, '-', ''), ' ', '')) = ?
        ORDER BY created_at DESC 
        LIMIT 1;
      `, [normTx]);
      if (txRows && txRows.length > 0) {
        matchedPayment = txRows[0];
      }
    }

    // Check by Phone Number if not matched by txId
    if (!matchedPayment && normPhone) {
      const phoneRows = await executeD1Query(`
        SELECT * FROM httpsms_payments 
        WHERE status = 'unclaimed' 
          AND amount >= 20000 
          AND sender_phone = ?
        ORDER BY created_at DESC 
        LIMIT 1;
      `, [normPhone]);
      if (phoneRows && phoneRows.length > 0) {
        matchedPayment = phoneRows[0];
      }
    }

    // ── STEP 2: If not in local D1, query httpSMS API directly for recent SMS messages
    if (!matchedPayment && HTTPSMS_API_KEY && HTTPSMS_PHONE_NUMBER) {
      try {
        const ownerParam = encodeURIComponent(HTTPSMS_PHONE_NUMBER);
        // Look up messages for the sender contact if phone was given
        const contactsToTry: string[] = [];
        if (normPhone) {
          contactsToTry.push(`+256${normPhone}`);
          contactsToTry.push(`0${normPhone}`);
          contactsToTry.push(normPhone);
        }

        // Also query telecom shortcodes (MTNMOBILEMONEY, AirtelMoney) where the SMS came from
        contactsToTry.push("MTNMOBILEMONEY");
        contactsToTry.push("AirtelMoney");
        contactsToTry.push("MTNMoMo");
        contactsToTry.push("165");
        contactsToTry.push("185");

        for (const contact of contactsToTry) {
          if (matchedPayment) break;
          const url = `https://api.httpsms.com/v1/messages?owner=${ownerParam}&contact=${encodeURIComponent(contact)}`;
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

            for (const msg of messages) {
              const content = msg.content || "";
              const parsed = parseMobileMoneySms(content);

              if (parsed.isPayment && parsed.amount >= 20000) {
                // Check if matches this user's phone or transaction ID
                let matchThis = false;
                if (normTx && parsed.transactionId === normTx) {
                  matchThis = true;
                }
                if (!matchThis && normPhone && parsed.normalizedPhone === normPhone) {
                  matchThis = true;
                }

                if (matchThis) {
                  // Check if this message was already claimed previously in D1
                  const existing = await executeD1Query(
                    "SELECT id, status FROM httpsms_payments WHERE message_id = ?",
                    [msg.id]
                  );
                  if (existing.length === 0 || existing[0].status === "unclaimed") {
                    matchedPayment = {
                      id: existing[0]?.id || `pay-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                      amount: parsed.amount,
                      transaction_id: parsed.transactionId,
                      sender_phone: parsed.normalizedPhone || normPhone,
                      provider: parsed.provider,
                      raw_content: content,
                    };

                    // Insert or update in D1
                    if (existing.length === 0) {
                      await executeD1Query(`
                        INSERT INTO httpsms_payments (
                          id, message_id, sender_contact, sender_phone, sender_name,
                          amount, currency, transaction_id, raw_content, status
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'unclaimed');
                      `, [
                        matchedPayment.id,
                        msg.id,
                        contact,
                        matchedPayment.sender_phone,
                        parsed.senderName,
                        parsed.amount,
                        parsed.currency,
                        parsed.transactionId,
                        content
                      ]);
                    }
                    break;
                  }
                }
              }
            }
          }
        }
      } catch (apiErr) {
        console.error("[Verify API] Error polling httpSMS API:", apiErr);
      }
    }

    // ── STEP 3: Handle Verification Result
    if (matchedPayment) {
      console.log(`[Verify API] Verified payment of UGX ${matchedPayment.amount} for app ${applicationId}! Activating profile...`);
      try {
        await activateApplication(applicationId, {
          paymentId: matchedPayment.id,
          amount: matchedPayment.amount,
          transactionId: matchedPayment.transaction_id,
          phone: matchedPayment.sender_phone || normPhone,
          provider: matchedPayment.provider,
        });
      } catch (actErr: any) {
        if (actErr?.message?.includes("not found")) {
          return NextResponse.json({
            error: `Application "${applicationId}" was not found. Please verify the application ID.`
          }, { status: 404 });
        }
        throw actErr;
      }

      return NextResponse.json({
        success: true,
        verified: true,
        amount: matchedPayment.amount,
        transactionId: matchedPayment.transaction_id,
        message: `Payment of UGX ${Number(matchedPayment.amount).toLocaleString()} successfully verified! Your profile is now live.`,
      });
    }

    // Not found
    return NextResponse.json({
      success: false,
      verified: false,
      message: "We have not received an SMS for UGX 20,000 or above from this phone number or transaction ID yet. If you just sent the payment, please wait 30–60 seconds for network SMS delivery and tap 'Verify' again, or double-check the phone number.",
    });
  } catch (err: any) {
    console.error("[Verify API] Error:", err);
    return NextResponse.json({ error: err?.message || "Verification failed" }, { status: 500 });
  }
}
