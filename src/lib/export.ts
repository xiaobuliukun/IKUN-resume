export const oklchToRgb = (l: number, c: number, h: number) => {
    l /= 100;
    c /= 100;

    const a = c * Math.cos(h * Math.PI / 180);
    const b = c * Math.sin(h * Math.PI / 180);

    const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = l - 0.0894841775 * a - 1.291485548 * b;

    const L = l_ * l_ * l_;
    const M = m_ * m_ * m_;
    const S = s_ * s_ * s_;

    let r = 4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S;
    let g = -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S;
    let bl = -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S;

    r = Math.max(0, Math.min(1, r));
    g = Math.max(0, Math.min(1, g));
    bl = Math.max(0, Math.min(1, bl));

    return [r * 255, g * 255, bl * 255];
  }

const stripMarkdown = (text: string) => {
    return text
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/_(.*?)_/g, '$1')
      .replace(/`{1,3}(.*?)`{1,3}/g, '$1')
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/^\s*[-*+]\s+/gm, '- ')
      .replace(/^\s*\d+\.\s+/gm, '')
      .replace(/^>\s?/gm, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
}

const sanitizeFileName = (fileName: string) => {
    return fileName
      .replace(/[\\/:*?"<>|]/g, '-')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase();
}

interface ExportPdfOptions {
    title: string;
    content: string;
    fileName: string;
    metadata?: Array<{ label: string; value: string }>;
}

export const exportTextContentToPdf = async ({
    title,
    content,
    fileName,
    metadata = [],
}: ExportPdfOptions) => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 48;
    const usableWidth = pageWidth - margin * 2;
    const bottomLimit = pageHeight - margin;
    let cursorY = margin;

    const ensureSpace = (neededHeight: number) => {
      if (cursorY + neededHeight <= bottomLimit) return;
      doc.addPage();
      cursorY = margin;
    };

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(title, margin, cursorY);
    cursorY += 28;

    if (metadata.length > 0) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);

      metadata.forEach((item) => {
        if (!item.value.trim()) return;
        const lines = doc.splitTextToSize(`${item.label}: ${item.value}`, usableWidth);
        ensureSpace(lines.length * 14);
        doc.text(lines, margin, cursorY);
        cursorY += lines.length * 14;
      });

      cursorY += 10;
    }

    const plainContent = stripMarkdown(content);
    const paragraphs = plainContent.split(/\n{2,}/).filter(Boolean);

    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);

    paragraphs.forEach((paragraph) => {
      const lines = doc.splitTextToSize(paragraph.trim(), usableWidth);
      ensureSpace(lines.length * 18 + 8);
      doc.text(lines, margin, cursorY);
      cursorY += lines.length * 18 + 8;
    });

    doc.save(`${sanitizeFileName(fileName) || 'cover-letter'}.pdf`);
}
