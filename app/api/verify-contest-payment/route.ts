import { NextResponse } from "next/server";
import crypto from "crypto";
import { saveContestant } from "@/lib/contestStore";

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, name, email, phone, amount } = await req.json();

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ success: false, error: "Payment verification failed!" }, { status: 400 });
    }

    // Yahan JSON file me data save ho jayega
    saveContestant({
      name,
      email,
      phone,
      paymentId: razorpay_payment_id,
      amount,
      date: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Contest entry successful!",
      entryId: razorpay_payment_id,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}