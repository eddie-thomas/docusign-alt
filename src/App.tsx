import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

import "./App.css";
import EditPdf from "./EditPdf";

function App() {
  return (
    <div className="App">
      <div style={{ border: "1px solid" }}>
        <Document file="/pdf/waiver.pdf">
          <Page pageNumber={1} />
        </Document>
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
