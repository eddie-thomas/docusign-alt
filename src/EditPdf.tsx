import { useEffect, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { writeDummyData } from "./utils";

/**
 *
 * @returns JSX.Element
 */
function EditPdf() {
  const [doc, setDoc] = useState<PDFDocument>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSave = async () => {
    const pdfBytes = await doc?.save();
    if (pdfBytes) saveByteArray("test_file.pdf", pdfBytes);
  };

  useEffect(() => {
    const getLoad = async () => {
      setLoading(true);
      try {
        const docu = await load();
        setDoc(docu);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    if (doc === undefined && loading === false) {
      getLoad();
    }
  }, [doc, loading]);

  return (
    <div>
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

/**
 *
 * @returns Promise<PDFDocument>
 */
async function load(): Promise<PDFDocument> {
  const arrayBuffer = await fetch("/pdf/waiver.pdf").then((res) =>
    res.arrayBuffer()
  );
  const doc = await PDFDocument.load(arrayBuffer);
  const writtenInDoc = await writeDummyData(doc);
  return writtenInDoc;
}

function saveByteArray(reportName: string, byte: Uint8Array) {
  const blob = new Blob([byte], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  const fileName = reportName;
  link.download = fileName;
  link.click();
}

export default EditPdf;
