import { NextRequest, NextResponse } from "next/server";
import CloudConvert from "cloudconvert";

const cloudConvert = new CloudConvert(process.env.CLOUDCONVERT_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!process.env.CLOUDCONVERT_API_KEY) {
      return NextResponse.json(
        { error: "CloudConvert API key missing." },
        { status: 500 }
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Create a CloudConvert Job
    const job = await cloudConvert.jobs.create({
      tasks: {
        "upload-my-file": {
          operation: "import/upload",
        },
        "convert-my-file": {
          operation: "convert",
          input: "upload-my-file",
          output_format: "pdf",
          engine: "office", // Uses native MS Office engine
        },
        "export-my-file": {
          operation: "export/url",
          input: "convert-my-file",
        },
      },
    });

    // Upload the file
    const uploadTask = job.tasks.find((task) => task.name === "upload-my-file");
    if (!uploadTask || !uploadTask.result?.form) {
      throw new Error("Failed to initialize CloudConvert upload.");
    }

    await cloudConvert.tasks.upload(
      uploadTask,
      fileBuffer,
      file.name
    );

    // Wait for conversion completion
    const completedJob = await cloudConvert.jobs.wait(job.id);
    const exportTask = completedJob.tasks.find(
      (task) => task.name === "export-my-file"
    );

    const pdfUrl = exportTask?.result?.files?.[0]?.url;

    if (!pdfUrl) {
      throw new Error("Failed to fetch converted PDF URL.");
    }

    // Download converted PDF buffer
    const pdfResponse = await fetch(pdfUrl);
    const pdfArrayBuffer = await pdfResponse.arrayBuffer();

    return new NextResponse(Buffer.from(pdfArrayBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${file.name.replace(/\.[^/.]+$/, "")}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("CloudConvert Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to convert Excel to PDF." },
      { status: 500 }
    );
  }
}