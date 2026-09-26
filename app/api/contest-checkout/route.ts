import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(req: Request) {
  try {
    const { amount } = await req.json(); // ₹199 aayega

    const options = {
      amount: amount * 100, // Paise me convert (199 * 100 = 19900)
      currency: "INR",
      receipt: "receipt_" + Math.random().toString(36.substring(7)),
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error("Razorpay Order Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}