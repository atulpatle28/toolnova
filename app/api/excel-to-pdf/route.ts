import { NextRequest, NextResponse } from "next/server";
import CloudConvert from "cloudconvert";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const apiKey = process.env.CLOUDCONVERT_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "CloudConvert API key is missing on server." },
        { status: 500 }
      );
    }

    const cloudConvert = new CloudConvert(apiKey);
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Create a conversion job with print settings enabled
    const job = await cloudConvert.jobs.create({
      tasks: {
        "upload-file": {
          operation: "import/upload",
        },
        "convert-file": {
          operation: "convert",
          input: "upload-file",
          output_format: "pdf",
          engine: "office",
        },
        "export-file": {
          operation: "export/url",
          input: "convert-file",
        },
      },
    });

    const uploadTask = job.tasks.find((task) => task.name === "upload-file");
    if (!uploadTask || !uploadTask.result?.form) {
      throw new Error("Failed to initialize upload task.");
    }

    // Upload file buffer
    await cloudConvert.tasks.upload(
      uploadTask,
      fileBuffer,
      file.name
    );

    // Wait for conversion completion
    const completedJob = await cloudConvert.jobs.wait(job.id);
    const exportTask = completedJob.tasks.find(
      (task) => task.name === "export-file"
    );

    const pdfUrl = exportTask?.result?.files?.[0]?.url;

    if (!pdfUrl) {
      throw new Error("Failed to retrieve converted PDF URL.");
    }

    // Fetch binary PDF
    const pdfResponse = await fetch(pdfUrl);
    const pdfArrayBuffer = await pdfResponse.arrayBuffer();

    return new NextResponse(Buffer.from(pdfArrayBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${file.name.replace(/\.[^/.]+$/, "")}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("Conversion Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to convert Excel to PDF." },
      { status: 500 }
    );
  }
}