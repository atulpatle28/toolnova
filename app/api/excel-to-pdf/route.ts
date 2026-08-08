import { NextRequest, NextResponse } from "next/server";

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
        { error: "CloudConvert API key is missing." },
        { status: 500 }
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Create job with forced full-sheet rendering parameters
    const createJobRes = await fetch("https://api.cloudconvert.com/v2/jobs", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tasks: {
          "import-file": {
            operation: "import/upload",
          },
          "convert-file": {
            operation: "convert",
            input: "import-file",
            output_format: "pdf",
            engine: "libreoffice", // Exact engine used by top online tools
            sheet_export_print_area_only: false, // Don't restrict to defined print area
            sheet_export_fit_to_page: true,      // Fit wide tables/forms to page
            sheet_export_gridlines: false,       // Render layout as original document
          },
          "export-file": {
            operation: "export/url",
            input: "convert-file",
          },
        },
      }),
    });

    const jobData = await createJobRes.json();
    if (!createJobRes.ok || !jobData.data) {
      console.error("Job Creation Failed:", jobData);
      throw new Error(jobData.message || "Failed to create conversion job.");
    }

    const uploadTask = jobData.data.tasks.find((t: any) => t.name === "import-file");
    const uploadUrl = uploadTask.result.form.url;
    const uploadParameters = uploadTask.result.form.parameters;

    // Build form data for CloudConvert S3 upload
    const uploadFormData = new FormData();
    for (const [key, value] of Object.entries(uploadParameters)) {
      uploadFormData.append(key, value as string);
    }
    const blob = new Blob([fileBuffer]);
    uploadFormData.append("file", blob, file.name);

    const uploadRes = await fetch(uploadUrl, {
      method: "POST",
      body: uploadFormData,
    });

    if (!uploadRes.ok) {
      throw new Error("Failed to upload file to conversion server.");
    }

    // Poll until conversion is complete
    let exportUrl = "";
    const jobId = jobData.data.id;

    for (let i = 0; i < 20; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Wait 1.5 seconds
      const checkJob = await fetch(`https://api.cloudconvert.com/v2/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      const checkData = await checkJob.json();

      if (checkData.data.status === "finished") {
        const exportTask = checkData.data.tasks.find((t: any) => t.name === "export-file");
        exportUrl = exportTask.result.files[0].url;
        break;
      } else if (checkData.data.status === "error") {
        throw new Error("Conversion engine failed to process the document.");
      }
    }

    if (!exportUrl) {
      throw new Error("Conversion process timed out.");
    }

    // Fetch binary PDF output
    const pdfRes = await fetch(exportUrl);
    const pdfBuffer = await pdfRes.arrayBuffer();

    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${file.name.replace(/\.[^/.]+$/, "")}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("Excel Conversion Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to convert Excel to PDF." },
      { status: 500 }
    );
  }
}