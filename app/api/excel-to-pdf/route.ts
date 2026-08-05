import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: "array" });

    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      return NextResponse.json({ error: "Empty spreadsheet file." }, { status: 400 });
    }

    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: any[][] = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: "" });

    // Create Vector PDF Document
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Page Dimensions (Landscape A4)
    const pageWidth = 841.89;
    const pageHeight = 595.28;
    const margin = 30;

    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let y = pageHeight - margin - 15;

    // Header Title
    page.drawText(`Document: ${file.name}`, {
      x: margin,
      y: y,
      size: 12,
      font: fontBold,
      color: rgb(0.1, 0.1, 0.1),
    });
    y -= 25;

    const rowHeight = 18;
    const maxCols = Math.max(...rows.map((r) => r.length), 1);
    const colWidth = Math.min((pageWidth - margin * 2) / maxCols, 120);

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      if (y < margin + 20) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin - 20;
      }

      const row = rows[rowIndex];
      const isHeader = rowIndex === 0;

      for (let colIndex = 0; colIndex < row.length; colIndex++) {
        const cellText = String(row[colIndex] ?? "").trim();
        const x = margin + colIndex * colWidth;

        page.drawRectangle({
          x,
          y: y - 4,
          width: colWidth,
          height: rowHeight,
          borderColor: rgb(0.8, 0.8, 0.8),
          borderWidth: 0.5,
          color: isHeader ? rgb(0.92, 0.95, 0.98) : rgb(1, 1, 1),
        });

        if (cellText) {
          const truncatedText =
            cellText.length > 18 ? cellText.substring(0, 15) + "..." : cellText;
          page.drawText(truncatedText, {
            x: x + 4,
            y: y,
            size: 8,
            font: isHeader ? fontBold : font,
            color: rgb(0.1, 0.1, 0.1),
          });
        }
      }
      y -= rowHeight;
    }

    const pdfBytes = await pdfDoc.save();

    // Convert Uint8Array to Buffer for Next.js BodyInit compatibility
    const pdfBuffer = Buffer.from(pdfBytes);

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${file.name.replace(/\.[^/.]+$/, "")}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("Excel Server Error:", error);
    return NextResponse.json({ error: "Failed to convert file." }, { status: 500 });
  }
}