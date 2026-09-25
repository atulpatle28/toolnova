import { NextRequest, NextResponse } from "next/server";
import ILovePDFApi from "@ilovepdf/ilovepdf-nodejs";
import ILovePDFFile from "@ilovepdf/ilovepdf-nodejs/ILovePDFFile";
import fs from "fs/promises";
import path from "path";
import os from "os";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let tempInputPath = "";

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const publicKey = process.env.PUBLIC_KEY;
    const secretKey = process.env.SECRET_KEY;

    if (!publicKey || !secretKey) {
      return NextResponse.json(
        { error: "PUBLIC_KEY or SECRET_KEY missing in environment variables." },
        { status: 500 }
      );
    }

    // Initialize ILovePDF API instance
    const instance = new ILovePDFApi(publicKey, secretKey);

    // Save uploaded file temporarily in OS temp directory
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const isDoc = file.name.toLowerCase().endsWith(".doc");
    const tempFileName = `upload_${Date.now()}${isDoc ? ".doc" : ".docx"}`;
    tempInputPath = path.join(os.tmpdir(), tempFileName);
    await fs.writeFile(tempInputPath, fileBuffer);

    // Create officepdf task
    const task = instance.newTask("officepdf");
    await task.start();

    // Add file to task
    const iLovePdfFile = new ILovePDFFile(tempInputPath);
    await task.addFile(iLovePdfFile);

    // Process file to PDF
    await task.process();

    // Download converted file
    const downloadBuffer = await task.download();

    // Cleanup temp input file
    await fs.unlink(tempInputPath).catch(() => {});

    // UTF-8 safe filename headers
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    const encodedFileName = encodeURIComponent(baseName) + ".pdf";

    return new NextResponse(Buffer.from(downloadBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="converted.pdf"; filename*=UTF-8''${encodedFileName}`,
      },
    });
  } catch (error: any) {
    // Cleanup temp file on error
    if (tempInputPath) {
      await fs.unlink(tempInputPath).catch(() => {});
    }
    console.error("Word to PDF SDK Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to convert Word to PDF." },
      { status: 500 }
    );
  }
}