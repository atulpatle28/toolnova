import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Replace with your actual ConvertAPI Secret Key or set CONVERTAPI_SECRET in .env.local
    const secret = process.env.CONVERTAPI_SECRET || "YOUR_CONVERTAPI_SECRET";

    if (!secret || secret === "YOUR_CONVERTAPI_SECRET") {
      return NextResponse.json(
        { error: "ConvertAPI secret key is missing." },
        { status: 500 }
      );
    }

    const apiFormData = new FormData();
    apiFormData.append("File", file);

    // High-precision LibreOffice Server Conversion
    const response = await fetch(
      `https://v2.convertapi.com/convert/excel/to/pdf?Secret=${secret}`,
      {
        method: "POST",
        body: apiFormData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("ConvertAPI Error Details:", errorData);
      return NextResponse.json(
        { error: errorData.Message || "Failed to convert file via ConvertAPI." },
        { status: 500 }
      );
    }

    const result = await response.json();

    if (!result.Files || !result.Files[0] || !result.Files[0].FileData) {
      return NextResponse.json(
        { error: "Invalid response from conversion engine." },
        { status: 500 }
      );
    }

    // Decode Base64 string to PDF binary buffer
    const pdfBase64 = result.Files[0].FileData;
    const pdfBuffer = Buffer.from(pdfBase64, "base64");

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${file.name.replace(/\.[^/.]+$/, "")}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("Server Conversion Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process Excel file." },
      { status: 500 }
    );
  }
}