import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();

    // Read workbook bypassing macro/formula lock issues
    const workbook = XLSX.read(arrayBuffer, {
      type: "array",
      cellStyles: false,
      cellDates: true,
      cellNF: false,
      sheetStubs: true,
    });

    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // Extract formatted cell strings directly
    const jsonData = XLSX.utils.sheet_to_json<string[]>(worksheet, {
      header: 1,
      defval: "",
      raw: false,
    });

    if (!jsonData || jsonData.length === 0) {
      return NextResponse.json(
        { error: "Excel file is empty or unreadable." },
        { status: 400 }
      );
    }

    // Filter out completely empty rows
    const cleanRows = jsonData.filter((row) =>
      row.some((cell) => cell !== undefined && cell !== null && cell.toString().trim() !== "")
    );

    // Create Landscape A4 Document for Government Forms
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });

    // Add Document Header
    doc.setFontSize(11);
    doc.text(`Document: ${file.name}`, 20, 25);

    // Generate AutoTable
    autoTable(doc, {
      body: cleanRows,
      startY: 35,
      styles: {
        fontSize: 7,
        cellPadding: 3,
        overflow: "linebreak",
        lineColor: [220, 220, 220],
        lineWidth: 0.5,
      },
      headStyles: {
        fillColor: [16, 185, 129],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      theme: "grid",
      margin: { top: 20, right: 20, bottom: 20, left: 20 },
    });

    const pdfOutput = doc.output("arraybuffer");

    return new NextResponse(Buffer.from(pdfOutput), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${file.name.replace(/\.[^/.]+$/, "")}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("Excel to PDF conversion error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process Excel file." },
      { status: 500 }
    );
  }
}