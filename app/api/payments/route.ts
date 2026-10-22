export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { executeD1Query } from "@/lib/d1";
import { activateApplication } from "@/lib/httpsms/activate";

export async function GET() {
  try {
    const rows = await executeD1Query(`
      SELECT * FROM httpsms_payments 
      ORDER BY created_at DESC 
      LIMIT 50;
    `);
    return NextResponse.json(rows);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to load payments" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { paymentId, applicationId } = body;

    if (!paymentId || !applicationId) {
      return NextResponse.json({ error: "paymentId and applicationId are required" }, { status: 400 });
    }

    const rows = await executeD1Query(`
      SELECT * FROM httpsms_payments WHERE id = ?
    `, [paymentId]);

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    const payment = rows[0];
    await activateApplication(applicationId, {
      paymentId: payment.id,
      amount: payment.amount,
      transactionId: payment.transaction_id,
      phone: payment.sender_phone,
    });

    return NextResponse.json({ success: true, message: "Payment manually matched and application activated!" });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to match payment" }, { status: 500 });
  }
}
