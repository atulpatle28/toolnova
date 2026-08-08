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
    // Excel file read karein with raw formatting & cell formulas evaluate
    const workbook = XLSX.read(arrayBuffer, {
      type: "array",
      cellStyles: true,
      cellFormulas: true,
      cellDates: true,
      cellNF: true,
      sheetStubs: true,
    });

    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // Excel sheet ko raw values aur formatted text ke saath parse karein
    const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: "",
      raw: false, // Force text conversion for all merged/formula cells
    });

    if (!jsonData || jsonData.length === 0) {
      return NextResponse.json(
        { error: "Excel file is empty or unreadable." },
        { status: 400 }
      );
    }

    // PDF Create karein
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });

    // AutoTable layout setup
    autoTable(doc, {
      body: jsonData,
      styles: {
        fontSize: 7,
        cellPadding: 3,
        overflow: "linebreak",
        lineColor: [200, 200, 200],
        lineWidth: 0.5,
      },
      theme: "grid",
      margin: { top: 20, right: 15, bottom: 20, left: 15 },
    });

    const pdfOutput = doc.output("arraybuffer");
    return new NextResponse(Buffer.from(pdfOutput), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${file.name.replace(/\.[^/.]+$/, "")}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("Conversion Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to convert Excel file." },
      { status: 500 }
    );
  }
}