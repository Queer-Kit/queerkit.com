/**
 * CMYK PDF Generator
 *
 * Builds a minimal PDF file with images in DeviceCMYK color space.
 * Converts canvas RGBA pixel data to CMYK and embeds it as FlateDecode-compressed streams.
 */

// --- RGB to CMYK conversion ---

function rgbaToCmykBytes(
  imageData: ImageData,
): Uint8Array {
  const { data, width, height } = imageData;
  const pixelCount = width * height;
  const cmyk = new Uint8Array(pixelCount * 4);

  for (let i = 0; i < pixelCount; i++) {
    const ri = i * 4;
    const r = data[ri]! / 255;
    const g = data[ri + 1]! / 255;
    const b = data[ri + 2]! / 255;
    // Alpha is ignored — canvas is composited onto white by default

    const k = 1 - Math.max(r, g, b);
    const ci = i * 4;

    if (k >= 1) {
      cmyk[ci] = 0;
      cmyk[ci + 1] = 0;
      cmyk[ci + 2] = 0;
      cmyk[ci + 3] = 255;
    } else {
      const inv = 1 / (1 - k);
      cmyk[ci] = Math.round((1 - r - k) * inv * 255);
      cmyk[ci + 1] = Math.round((1 - g - k) * inv * 255);
      cmyk[ci + 2] = Math.round((1 - b - k) * inv * 255);
      cmyk[ci + 3] = Math.round(k * 255);
    }
  }

  return cmyk;
}

// --- Deflate compression via browser CompressionStream API ---

async function deflateBytes(data: Uint8Array): Promise<Uint8Array> {
  const cs = new CompressionStream("deflate");
  const writer = cs.writable.getWriter();
  void writer.write(data as unknown as BufferSource);
  void writer.close();

  const chunks: Uint8Array[] = [];
  const reader = cs.readable.getReader();

  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    if (value) chunks.push(new Uint8Array(value));
  }

  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}

// --- Minimal PDF builder ---

interface PdfImagePage {
  compressedData: Uint8Array;
  pixelWidth: number;
  pixelHeight: number;
}

/**
 * Constructs a valid multi-page PDF with CMYK images.
 * Each page contains a single full-bleed image in DeviceCMYK color space.
 */
function constructCmykPdf(
  pages: PdfImagePage[],
  pageWidthPt: number,
  pageHeightPt: number,
): Uint8Array {
  // We build the PDF as a series of chunks (text + binary interleaved)
  const chunks: (string | Uint8Array)[] = [];
  const objectOffsets: number[] = [];
  let byteOffset = 0;

  function writeStr(s: string): void {
    const bytes = new TextEncoder().encode(s);
    chunks.push(bytes);
    byteOffset += bytes.length;
  }

  function writeBytes(b: Uint8Array): void {
    chunks.push(b);
    byteOffset += b.length;
  }

  function markObject(objNum: number): void {
    objectOffsets[objNum] = byteOffset;
  }

  // Header
  writeStr("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n");

  // Object numbering plan:
  // 1 = Catalog
  // 2 = Pages
  // For each page i (0-indexed):
  //   3 + i*3     = Page object
  //   3 + i*3 + 1 = Content stream
  //   3 + i*3 + 2 = Image XObject
  const pageCount = pages.length;
  const totalObjects = 2 + pageCount * 3;

  // Build page object references
  const pageRefs = pages.map((_, i) => `${3 + i * 3} 0 R`).join(" ");

  // Object 1: Catalog
  markObject(1);
  writeStr("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");

  // Object 2: Pages
  markObject(2);
  writeStr(
    `2 0 obj\n<< /Type /Pages /Kids [${pageRefs}] /Count ${pageCount} >>\nendobj\n`,
  );

  // Each page
  for (let i = 0; i < pageCount; i++) {
    const page = pages[i]!;
    const pageObjNum = 3 + i * 3;
    const contentObjNum = pageObjNum + 1;
    const imageObjNum = pageObjNum + 2;

    // Content stream: draw the image full-bleed
    const drawCmd = `q ${pageWidthPt.toFixed(4)} 0 0 ${pageHeightPt.toFixed(4)} 0 0 cm /Im1 Do Q\n`;
    const drawCmdBytes = new TextEncoder().encode(drawCmd);

    // Page object
    markObject(pageObjNum);
    writeStr(
      `${pageObjNum} 0 obj\n` +
        `<< /Type /Page /Parent 2 0 R ` +
        `/MediaBox [0 0 ${pageWidthPt.toFixed(4)} ${pageHeightPt.toFixed(4)}] ` +
        `/Contents ${contentObjNum} 0 R ` +
        `/Resources << /XObject << /Im1 ${imageObjNum} 0 R >> >> ` +
        `>>\nendobj\n`,
    );

    // Content stream object
    markObject(contentObjNum);
    writeStr(
      `${contentObjNum} 0 obj\n<< /Length ${drawCmdBytes.length} >>\nstream\n`,
    );
    writeBytes(drawCmdBytes);
    writeStr("\nendstream\nendobj\n");

    // Image XObject (DeviceCMYK, FlateDecode)
    markObject(imageObjNum);
    writeStr(
      `${imageObjNum} 0 obj\n` +
        `<< /Type /XObject /Subtype /Image ` +
        `/Width ${page.pixelWidth} /Height ${page.pixelHeight} ` +
        `/ColorSpace /DeviceCMYK ` +
        `/BitsPerComponent 8 ` +
        `/Filter /FlateDecode ` +
        `/Length ${page.compressedData.length} ` +
        `>>\nstream\n`,
    );
    writeBytes(page.compressedData);
    writeStr("\nendstream\nendobj\n");
  }

  // Cross-reference table
  const xrefOffset = byteOffset;
  writeStr("xref\n");
  writeStr(`0 ${totalObjects + 1}\n`);
  writeStr("0000000000 65535 f \n");

  for (let obj = 1; obj <= totalObjects; obj++) {
    const off = objectOffsets[obj] ?? 0;
    writeStr(`${String(off).padStart(10, "0")} 00000 n \n`);
  }

  // Trailer
  writeStr("trailer\n");
  writeStr(`<< /Size ${totalObjects + 1} /Root 1 0 R >>\n`);
  writeStr("startxref\n");
  writeStr(`${xrefOffset}\n`);
  writeStr("%%EOF\n");

  // Concatenate all chunks
  const totalLength = chunks.reduce(
    (acc, c) => acc + (typeof c === "string" ? new TextEncoder().encode(c).length : c.length),
    0,
  );
  const result = new Uint8Array(totalLength);
  let pos = 0;
  for (const chunk of chunks) {
    const bytes = typeof chunk === "string" ? new TextEncoder().encode(chunk) : chunk;
    result.set(bytes, pos);
    pos += bytes.length;
  }

  return result;
}

// --- Public API ---

export interface CmykPdfInput {
  canvas: HTMLCanvasElement;
}

/**
 * Creates a print-ready PDF in CMYK color space from canvas pages.
 *
 * @param pages Array of canvases (one per page)
 * @param pageWidthMm Page width in millimeters
 * @param pageHeightMm Page height in millimeters
 * @returns PDF file as Uint8Array
 */
export async function createCmykPdf(
  canvases: HTMLCanvasElement[],
  pageWidthMm: number,
  pageHeightMm: number,
): Promise<Uint8Array> {
  const ptPerMm = 72 / 25.4;
  const pageWidthPt = pageWidthMm * ptPerMm;
  const pageHeightPt = pageHeightMm * ptPerMm;

  const pdfPages: PdfImagePage[] = [];

  for (const canvas of canvases) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get 2d context from canvas");

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const cmykBytes = rgbaToCmykBytes(imageData);
    const compressed = await deflateBytes(cmykBytes);

    pdfPages.push({
      compressedData: compressed,
      pixelWidth: canvas.width,
      pixelHeight: canvas.height,
    });
  }

  return constructCmykPdf(pdfPages, pageWidthPt, pageHeightPt);
}

/**
 * Downloads a Uint8Array as a file.
 */
export function downloadBlob(data: Uint8Array, filename: string): void {
  const blob = new Blob([data.buffer as ArrayBuffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
