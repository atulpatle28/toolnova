import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, phone } = await req.json();

    const orderId = `TOOLKRAFT_${Date.now()}`;
    
    const payload = {
      order_id: orderId,
      order_amount: 49.00,
      order_currency: "INR",
      customer_details: {
        customer_id: `cust_${phone.replace(/\D/g, "")}`,
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
      },
      order_meta: {
        return_url: `https://mytoolkraft.in/contest/success?order_id=${orderId}`,
      },
    };

    const response = await fetch(`${process.env.CASHFREE_API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": process.env.CASHFREE_APP_ID || "",
        "x-client-secret": process.env.CASHFREE_SECRET_KEY || "",
        "x-api-version": "2023-08-01",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create Cashfree order");
    }

    return NextResponse.json({
      success: true,
      payment_session_id: data.payment_session_id,
      order_id: orderId,
    });

  } catch (error: any) {
    console.error("Cashfree API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}