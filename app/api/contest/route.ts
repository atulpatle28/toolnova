import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    const { count, error } = await supabase
      .from("contest_entries")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    return NextResponse.json({ totalEntries: count || 0 });
  } catch (err: any) {
    console.error("Fetch entries error:", err);
    return NextResponse.json({ totalEntries: 0 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, email, phone } = await req.json();
    const ticketId = `TK-${Math.floor(100000 + Math.random() * 900000)}`;

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("contest_entries")
      .insert([{ ticket_id: ticketId, name, email, phone }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, ticketId });
  } catch (err: any) {
    console.error("Insert entry error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}