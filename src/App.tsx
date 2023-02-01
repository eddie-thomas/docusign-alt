import { useState } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
// import "react-pdf/dist/esm/Page/TextLayer.css";

import "./App.css";
import EditPdf from "./EditPdf";
import { addClickEventToCanvas } from "./utils";

function App() {
  const [page, setPage] = useState<number>(1);
  return (
    <div className="App">
      <div style={{ border: "1px solid" }}>
        <Document file="/pdf/waiver.pdf">
          <Page
            onClick={(e) => addClickEventToCanvas(e, page)}
            pageNumber={page}
          />
        </Document>
      </div>
      <div>
        <button onClick={() => setPage((prev) => prev + 1)}>up</button>
        <button onClick={() => setPage((prev) => (prev > 1 ? prev - 1 : prev))}>
          down
        </button>
      </div>
      <div>
        <EditPdf />
      </div>
    </div>
  );
}

/**
 * https://nodemailer.com/smtp/well-known/
 * For emailing via node-mailer
 */

export default App;
