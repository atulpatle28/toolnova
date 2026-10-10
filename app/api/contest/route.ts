import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { count, error } = await supabase
      .from("contest_entries")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    return NextResponse.json({ totalEntries: count || 0 });
  } catch (err: any) {
    return NextResponse.json({ totalEntries: 0, error: err.message });
  }
}

export async function POST(req: Request) {
  try {
    const { name, email, phone } = await req.json();
    const ticketId = `TK-${Math.floor(100000 + Math.random() * 900000)}`;

    const { data, error } = await supabase
      .from("contest_entries")
      .insert([{ ticket_id: ticketId, name, email, phone }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, ticketId });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}