import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, phone } = await req.json();

    const orderId = `TOOLKRAFT_${Date.now()}`;
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);

    const payload = {
      order_id: orderId,
      order_amount: 49.00,
      order_currency: "INR",
      customer_details: {
        customer_id: `cust_${cleanPhone || Date.now()}`,
        customer_name: name.trim(),
        customer_email: email.trim(),
        customer_phone: cleanPhone || "9999999999",
      },
      order_meta: {
        return_url: `https://www.mytoolkraft.in/contest/success?order_id=${orderId}`,
      },
    };

    const appId = process.env.CASHFREE_APP_ID || "TEST1126656888e42316ca29791af4d186566211";
    const secretKey = process.env.CASHFREE_SECRET_KEY || "cfsk_ma_test_ee3a460285be8022057eb5b86dcb831a_e51lacba";

    const response = await fetch("https://sandbox.cashfree.com/pg/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id": appId.trim(),
        "x-client-secret": secretKey.trim(),
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Cashfree API Failure Response:", data);
      return NextResponse.json(
        { success: false, error: data.message || "Cashfree authentication ya order creation fail hua" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      payment_session_id: data.payment_session_id,
      order_id: orderId,
    });
  } catch (error: any) {
    console.error("Cashfree Catch Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}