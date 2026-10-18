import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// 1. Live count fetch karna
export async function GET() {
  try {
    const supabase = getSupabaseClient();
    const { count, error } = await supabase
      .from("contest_entries")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Fetch entries error:", error.message);
      return NextResponse.json({ totalEntries: 0, error: error.message });
    }

    return NextResponse.json({ totalEntries: count || 0 });
  } catch (err: any) {
    console.error("Fetch entries exception:", err);
    return NextResponse.json({ totalEntries: 0, error: err.message });
  }
}

// 2. Nayi participant entry save karna
export async function POST(req: Request) {
  try {
    const { name, email, phone } = await req.json();
    const ticketId = `TK-${Math.floor(100000 + Math.random() * 900000)}`;

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("contest_entries")
      .insert([
        {
          ticket_id: ticketId,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          status: "confirmed",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Insert entry error:", error.message);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, ticketId, data });
  } catch (err: any) {
    console.error("Insert entry exception:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}