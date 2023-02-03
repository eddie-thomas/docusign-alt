import { PDFDocument, StandardFonts } from "pdf-lib";
import { FieldState } from "./components/Form";
import { Fields } from "./fields";

interface WriteDataToPdfProps {
  pdf: PDFDocument;
  fields: Fields;
  fieldState: FieldState;
}

/**
 *
 * @param e - MouseEvent
 * @param page - Page number
 */
function addClickEventToCanvas(e: React.MouseEvent, page: number) {
  const mouseX = e.pageX;
  const mouseY = 792 - e.pageY;
  console.log(`Position: (${mouseX}, ${mouseY}) for page: ${page}`);
}

/**
 *
 * @param phoneNumberString -
 * @returns
 */
function formatPhoneNumber(phoneNumberString: string) {
  const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    const intlCode = match[1] ? "+1 " : "";
    return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("");
  }
  return phoneNumberString;
}

/**
 *
 * @returns Promise<PDFDocument>
 */
async function loadPdf(): Promise<PDFDocument> {
  const arrayBuffer = await fetch("/pdf/waiver.pdf").then((res) =>
    res.arrayBuffer()
  );
  const doc = await PDFDocument.load(arrayBuffer);
  return doc;
}

/**
 *
 * @param fileName Name of the file
 * @param byte - The bytes for the PDF
 */
function saveByteArray(fileName: string, byte: Uint8Array) {
  const blob = new Blob([byte], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}

/**
 * To pascal case
 *
 * @param value - String that is meant to be `snake cased` and will be properly formatted into Pascal case with `_` being interpreted as spaces
 * @returns string
 */
function toPascalCase(value: string): string {
  return value
    .split("_")
    .map((word: string) => `${word[0].toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

async function writeDataToPdf({
  pdf,
  fields,
  fieldState,
}: WriteDataToPdfProps): Promise<PDFDocument> {
  const signatureFont = await pdf.embedFont(StandardFonts.TimesRomanItalic);
  Object.entries(fields).forEach(
    ([fieldIdentifier, { coordinates, default: defaultValue }]) => {
      const calculatedDefaultValue = defaultValue
        ?.map((idOrValue: string) => {
          // First look for identifier's and their user entered data
          const identifiersValue = fieldState[idOrValue];
          // If we have a value for it, then return it
          if (identifiersValue) return identifiersValue;
          // Otherwise just return the string
          return idOrValue;
        })
        .join();

      const fieldValue = fieldState[fieldIdentifier] || calculatedDefaultValue;

      if (fieldValue === undefined)
        throw Error("Cannot calculate value for field!");

      coordinates.forEach(({ coordinate: [x, y], page: pageNum }) => {
        const page = pdf.getPage(pageNum - 1);
        page.moveTo(x, y);
        page.drawText(fieldValue, {
          size: 14,
          ...(fieldIdentifier.includes("signature") && {
            font: signatureFont,
          }),
        });
      });
    }
  );

  return pdf;
}

export {
  addClickEventToCanvas,
  formatPhoneNumber,
  loadPdf,
  saveByteArray,
  toPascalCase,
  writeDataToPdf,
};
