import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const publicKey = process.env.PUBLIC_KEY;

    if (!publicKey) {
      return NextResponse.json(
        { error: "PUBLIC_KEY environment variable is missing on server." },
        { status: 500 }
      );
    }

    // Step 1: Authenticate with ILovePDF
    const authRes = await fetch("https://api.ilovepdf.com/v1/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ public_key: publicKey }),
    });

    const authData = await authRes.json();
    if (!authRes.ok || !authData.token) {
      throw new Error(authData.error?.message || "ILovePDF Authentication failed.");
    }

    const token = authData.token;

    // Step 2: Start OfficePDF Task
    const startTaskRes = await fetch("https://api.ilovepdf.com/v1/start/officepdf", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const startTaskData = await startTaskRes.json();
    if (!startTaskRes.ok || !startTaskData.task || !startTaskData.server) {
      throw new Error("Failed to start conversion task.");
    }

    const taskId = startTaskData.task;
    const server = startTaskData.server;

    // Step 3: Upload File
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const uploadFormData = new FormData();
    uploadFormData.append("task", taskId);
    const blob = new Blob([fileBuffer]);
    uploadFormData.append("file", blob, file.name);

    const uploadRes = await fetch(`https://${server}/v1/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: uploadFormData,
    });

    const uploadData = await uploadRes.json();
    if (!uploadRes.ok || !uploadData.server_filename) {
      throw new Error("Failed to upload file to ILovePDF server.");
    }

    // Step 4: Process Conversion (ADDED server_filename & files parameter)
    const processFormData = new FormData();
    processFormData.append("task", taskId);
    processFormData.append("tool", "officepdf");
    processFormData.append("files[0][server_filename]", uploadData.server_filename);
    processFormData.append("files[0][filename]", file.name);

    const processRes = await fetch(`https://${server}/v1/process`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: processFormData,
    });

    const processData = await processRes.json();
    if (!processRes.ok || processData.status !== "TaskSuccess") {
      throw new Error(processData.error?.message || "ILovePDF processing failed.");
    }

    // Step 5: Download PDF
    const downloadRes = await fetch(`https://${server}/v1/download/${taskId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!downloadRes.ok) {
      throw new Error("Failed to download converted PDF.");
    }

    const pdfArrayBuffer = await downloadRes.arrayBuffer();

    return new NextResponse(Buffer.from(pdfArrayBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${file.name.replace(/\.[^/.]+$/, "")}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("ILovePDF Server Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to convert Excel to PDF." },
      { status: 500 }
    );
  }
}