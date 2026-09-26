import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Instamojo API Credentials (Directly added from your dashboard)
    const apiKey = "023da21225370eb986d09099804a8087";
    const authToken = "da1c76f4d53fea62e4d068ff56723a4d";
    const endpoint = "https://www.instamojo.com/api/1.1/payment-requests/";

    const { name, email, phone, amount } = await req.json();

    // Instamojo Payment Request Payload
    const payload = {
      purpose: "iPhone & Android Lucky Draw Contest Entry",
      amount: (amount || 199).toString(), // ₹199 or default amount
      buyer_name: name || "Contest Participant",
      email: email || "participant@toolkraft.in",
      phone: phone || "9999999999",
      redirect_url: "https://mytoolkraft.in/contest/success", // Payment ke baad user yahan redirect hoga
      send_email: true,
      send_sms: true,
      allow_repeated_payments: false,
    };

    // Calling Instamojo API
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
        "X-Auth-Token": authToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.success && data.payment_request) {
      return NextResponse.json({
        success: true,
        paymentUrl: data.payment_request.longurl, // Yeh user ko Instamojo secure payment page par bhejega
        paymentRequestId: data.payment_request.id,
      });
    } else {
      console.error("Instamojo Error Response:", data);
      return NextResponse.json(
        { success: false, error: data.message || "Failed to create Instamojo payment request" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Instamojo Checkout Server Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Unknown server error" },
      { status: 500 }
    );
  }
}