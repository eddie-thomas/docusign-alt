import { PDFDocument, StandardFonts } from "pdf-lib";

interface Coordinate {
  coordinate: [number, number];
  page: number;
}

interface FieldCoordinates {
  [fieldIdentifier: string]: Array<Coordinate>;
}

const TEMP_DUMMY: { [key: string]: string } = {
  age: "25",
  location: "Named Location",
  owner_signature: "Rayvon Solomon",
  email: "k.edwardthom@gmail.com",
  concat_all_full_names_of_minors: "",
  date: new Date().toLocaleDateString(),
  full_name: "Edward K Thomas Jr",
  signature: "Edward K Thomas Jr",
  date_of_birth: new Date("07/01/1998").toLocaleDateString(),
  phone_number: "970-000-0000",
  address: "123 N College Ave.",
  city: "Fort Collins",
  state: "Colorado",
  zip: "80655",
  minor_full_name: "",
  minor_birthday: "",
  minor_relation_to_user: "",
};

function addClickEventToCanvas(e: React.MouseEvent, page: number) {
  const mouseX = e.pageX;
  const mouseY = 792 - e.pageY;
  console.log(`Position: (${mouseX}, ${mouseY}) for page: ${page}`);
}

const FIELD_COORDINATES: FieldCoordinates = {
  date: [
    { coordinate: [395, 679], page: 1 },
    { coordinate: [469, 155], page: 4 },
    { coordinate: [469, 99], page: 4 },
    { coordinate: [411, 130], page: 5 },
    { coordinate: [380, 529], page: 6 },
    { coordinate: [448, 489], page: 6 },
    { coordinate: [363, 515], page: 8 },
  ],
  full_name: [
    { coordinate: [168, 638], page: 1 },
    { coordinate: [92, 225], page: 5 },
    { coordinate: [39, 258], page: 7 },
    { coordinate: [221, 614], page: 8 },
  ],
  age: [{ coordinate: [463, 638], page: 1 }],
  location: [{ coordinate: [78, 420], page: 2 }],
  owner_signature: [{ coordinate: [135, 155], page: 4 }],
  signature: [
    { coordinate: [135, 99], page: 4 },
    { coordinate: [134, 130], page: 5 },
    { coordinate: [40, 529], page: 6 },
    { coordinate: [38, 489], page: 6 },
    { coordinate: [92, 515], page: 8 },
  ],

  date_of_birth: [
    { coordinate: [349, 225], page: 5 },
    { coordinate: [352, 537], page: 8 },
  ],
  phone_number: [
    { coordinate: [473, 225], page: 5 },
    { coordinate: [123, 537], page: 8 },
  ],
  address: [
    { coordinate: [77, 193], page: 5 },
    { coordinate: [82, 588], page: 8 },
  ],
  city: [
    { coordinate: [383, 193], page: 5 },
    { coordinate: [61, 563], page: 8 },
  ],
  state: [
    { coordinate: [62, 162], page: 5 },
    { coordinate: [264, 563], page: 8 },
  ],
  zip: [
    { coordinate: [202, 162], page: 5 },
    { coordinate: [345, 563], page: 8 },
  ],
  email: [{ coordinate: [319, 162], page: 5 }],
  concat_all_full_names_of_minors: [{ coordinate: [264, 489], page: 6 }],
  minor_full_name: [
    { coordinate: [120, 462], page: 8 },
    { coordinate: [120, 428], page: 8 },
    { coordinate: [120, 392], page: 8 },
    { coordinate: [120, 356], page: 8 },
  ],
  minor_birthday: [
    { coordinate: [345, 462], page: 8 },
    { coordinate: [345, 428], page: 8 },
    { coordinate: [345, 392], page: 8 },
    { coordinate: [342, 356], page: 8 },
  ],
  minor_relation_to_user: [
    { coordinate: [468, 462], page: 8 },
    { coordinate: [468, 428], page: 8 },
    { coordinate: [468, 392], page: 8 },
    { coordinate: [468, 356], page: 8 },
  ],
};

async function writeDummyData(
  pdf: PDFDocument,
  dummy = TEMP_DUMMY
): Promise<PDFDocument> {
  const signatureFont = await pdf.embedFont(StandardFonts.TimesRomanItalic);
  Object.entries(FIELD_COORDINATES).forEach(
    ([fieldIdentifier, coordinates]) => {
      const defaultValue = dummy[fieldIdentifier];
      coordinates.forEach(({ coordinate: [x, y], page: pageNum }) => {
        const page = pdf.getPage(pageNum - 1);
        page.moveTo(x, y);
        page.drawText(defaultValue, {
          size: 14,
          ...(["signature", "owner_signature"].includes(fieldIdentifier) && {
            font: signatureFont,
          }),
        });
      });
    }
  );

  return pdf;
}

export { addClickEventToCanvas, FIELD_COORDINATES, writeDummyData };
