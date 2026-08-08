import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const secret = process.env.CONVERTAPI_SECRET;

    if (!secret) {
      return NextResponse.json(
        { error: "ConvertAPI secret key is missing." },
        { status: 500 }
      );
    }

    // Convert file to Base64
    const fileBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(fileBuffer).toString("base64");

    const fileExt = file.name.split(".").pop()?.toLowerCase() || "xlsx";
    const endpointFormat = fileExt === "xls" ? "xls" : "xlsx";

    // Call ConvertAPI with Page Fitting Parameters
    const response = await fetch(
      `https://v2.convertapi.com/convert/${endpointFormat}/to/pdf?Secret=${secret}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Parameters: [
            {
              Name: "File",
              FileValue: {
                Name: file.name,
                Data: base64Data,
              },
            },
            {
              Name: "ScaleImage",
              Value: "true"
            },
            {
              Name: "ScaleGridLines",
              Value: "true"
            },
            {
              Name: "PageOrientation",
              Value: "landscape"
            }
          ],
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("ConvertAPI Error Details:", result);
      return NextResponse.json(
        { error: result.Message || "Failed to convert file via ConvertAPI." },
        { status: 500 }
      );
    }

    if (!result.Files?.[0]?.FileData) {
      return NextResponse.json(
        { error: "Invalid response from conversion engine." },
        { status: 500 }
      );
    }

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