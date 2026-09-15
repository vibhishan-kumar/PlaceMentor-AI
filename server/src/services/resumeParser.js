import fs from 'fs';
import pdfParse from 'pdf-parse';
import Tesseract from 'tesseract.js';
import path from 'path';

/**
 * Extract text from uploaded resume file (PDF or Image)
 * @param {string} filePath - Absolute path to file on disk
 * @param {string} mimeType - File mime type
 * @returns {Promise<string>}
 */
export async function parseResumeFile(filePath, mimeType) {
  if (!fs.existsSync(filePath)) {
    throw new Error('Resume file not found on disk.');
  }

  const ext = path.extname(filePath).toLowerCase();

  // 1. PDF extraction
  if (mimeType === 'application/pdf' || ext === '.pdf') {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const parsed = await pdfParse(dataBuffer);
      const cleanText = (parsed.text || '').trim();
      if (cleanText.length > 50) {
        return cleanText;
      }
      // If PDF text is unusually short (e.g. scanned image inside PDF), we note it
      return cleanText || 'Scanned PDF document with minimal embedded text.';
    } catch (pdfError) {
      console.error('PDF parsing error:', pdfError);
      throw new Error('Failed to read PDF document text.');
    }
  }

  // 2. Image OCR extraction (JPG, JPEG, PNG)
  if (
    ['image/jpeg', 'image/jpg', 'image/png'].includes(mimeType) ||
    ['.jpg', '.jpeg', '.png'].includes(ext)
  ) {
    try {
      console.log(`Starting OCR text extraction on image: ${filePath}`);
      const { data } = await Tesseract.recognize(filePath, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text' && Math.round(m.progress * 100) % 25 === 0) {
            console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
        }
      });
      const ocrText = (data.text || '').trim();
      if (!ocrText || ocrText.length < 20) {
        throw new Error('Unable to extract clear text from the uploaded image. Please ensure the image is sharp and legible.');
      }
      return ocrText;
    } catch (ocrError) {
      console.error('Image OCR error:', ocrError);
      throw new Error(`OCR processing failed: ${ocrError.message}`);
    }
  }

  throw new Error('Unsupported file format. Please upload a PDF, JPG, JPEG or PNG resume.');
}
