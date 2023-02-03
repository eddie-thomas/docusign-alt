interface Coordinate {
  coordinate: [number, number];
  page: number;
}

export interface UserFieldProperties {
  coordinates: Array<Coordinate>;
  renderFieldInPDF: true;
  inputType: React.HTMLInputTypeAttribute;
  required?: boolean;
  // Default is used if value of the field is undefined.
  default?: Array<string>;
  sequence?: number;
}

export interface GeneratedFieldProperties {
  coordinates: Array<Coordinate>;
  renderFieldInPDF: false;
  default: Array<string>;
}

/**
 * The @see {default} property will initially look for other field identifiers to prefill the value.
 * If not it will assume the literal, or array of literals will be concatenated with the
 * default `join()` method.
 */
export interface Fields {
  [fieldIdentifier: string]: UserFieldProperties | GeneratedFieldProperties;
  // {
  //   // Required properties
  //   coordinates: Array<Coordinate>;
  //   renderFieldInPDF: boolean;

  //   // Non-required properties
  //   inputType?: React.HTMLInputTypeAttribute;
  //   default?: string | Array<string>;
  //   required?: boolean;
  //   sequence?: number;
  // };
}

export const FIELD_DATA: Fields = {
  date: {
    coordinates: [
      { coordinate: [395, 679], page: 1 },
      { coordinate: [469, 155], page: 4 },
      { coordinate: [469, 99], page: 4 },
      { coordinate: [411, 130], page: 5 },
      { coordinate: [380, 529], page: 6 },
      { coordinate: [448, 489], page: 6 },
      { coordinate: [363, 518], page: 8 },
    ],
    default: [new Date().toLocaleDateString()],
    renderFieldInPDF: false,
  },
  owner_signature: {
    coordinates: [{ coordinate: [135, 155], page: 4 }],
    default: ["Rayvon Salomon"],
    renderFieldInPDF: false,
  },
  full_name: {
    coordinates: [
      { coordinate: [168, 638], page: 1 },
      { coordinate: [92, 225], page: 5 },
      { coordinate: [39, 258], page: 7 },
      { coordinate: [221, 614], page: 8 },
    ],
    inputType: "text",
    renderFieldInPDF: true,
    required: true,
  },
  age: {
    coordinates: [{ coordinate: [463, 638], page: 1 }],
    inputType: "number",
    renderFieldInPDF: true,
    required: true,
  },
  location: {
    coordinates: [{ coordinate: [78, 420], page: 2 }],
    default: ["Location unknown"],
    renderFieldInPDF: false,
  },

  signature: {
    coordinates: [
      { coordinate: [135, 99], page: 4 },
      { coordinate: [134, 130], page: 5 },
      { coordinate: [40, 529], page: 6 },
      { coordinate: [38, 489], page: 6 },
      { coordinate: [92, 518], page: 8 },
    ],
    default: ["full_name"],
    renderFieldInPDF: false,
  },
  date_of_birth: {
    coordinates: [
      { coordinate: [349, 225], page: 5 },
      { coordinate: [352, 537], page: 8 },
    ],
    inputType: "date",
    renderFieldInPDF: true,
    required: true,
  },
  phone_number: {
    coordinates: [
      { coordinate: [473, 225], page: 5 },
      { coordinate: [123, 537], page: 8 },
    ],
    inputType: "tel",
    renderFieldInPDF: true,
    required: true,
  },
  address: {
    coordinates: [
      { coordinate: [77, 193], page: 5 },
      { coordinate: [82, 588], page: 8 },
    ],
    inputType: "text",
    renderFieldInPDF: true,
    required: true,
  },
  city: {
    coordinates: [
      { coordinate: [383, 193], page: 5 },
      { coordinate: [61, 563], page: 8 },
    ],
    inputType: "text",
    renderFieldInPDF: true,
    required: true,
  },
  state: {
    coordinates: [
      { coordinate: [62, 162], page: 5 },
      { coordinate: [264, 563], page: 8 },
    ],
    inputType: "text",
    renderFieldInPDF: true,
    required: true,
  },
  zip: {
    coordinates: [
      { coordinate: [202, 162], page: 5 },
      { coordinate: [345, 563], page: 8 },
    ],
    inputType: "number",
    renderFieldInPDF: true,
    required: true,
  },
  email: {
    coordinates: [{ coordinate: [319, 162], page: 5 }],
    inputType: "email",
    renderFieldInPDF: true,
    required: true,
  },
  // concat_all_full_names_of_minors: {
  //   coordinates: [{ coordinate: [264, 489], page: 6 }],
  //   default: [
  //     "first_minor_full_name",
  //     "second_minor_full_name",
  //     "third_minor_full_name",
  //     "fourth_minor_full_name",
  //   ],
  //   renderFieldInPDF: false,
  // },

  // // First minor choice
  // first_minor_full_name: {
  //   coordinates: [{ coordinate: [120, 462], page: 8 }],
  //   renderFieldInPDF: true,
  //   inputType: "text",
  // },
  // first_minor_birthday: {
  //   coordinates: [{ coordinate: [345, 462], page: 8 }],
  //   renderFieldInPDF: true,
  //   inputType: "text",
  // },
  // first_minor_relation_to_user: {
  //   coordinates: [{ coordinate: [468, 462], page: 8 }],
  //   renderFieldInPDF: true,
  //   inputType: "text",
  // },

  // // Second minor choice
  // second_minor_full_name: {
  //   coordinates: [{ coordinate: [120, 428], page: 8 }],
  //   renderFieldInPDF: true,
  //   inputType: "text",
  // },
  // second_minor_birthday: {
  //   coordinates: [{ coordinate: [345, 428], page: 8 }],
  //   renderFieldInPDF: true,
  //   inputType: "text",
  // },
  // second_minor_relation_to_user: {
  //   coordinates: [{ coordinate: [468, 428], page: 8 }],
  //   renderFieldInPDF: true,
  //   inputType: "text",
  // },

  // // Third minor choice
  // third_minor_full_name: {
  //   coordinates: [{ coordinate: [120, 392], page: 8 }],
  //   renderFieldInPDF: true,
  //   inputType: "text",
  // },
  // third_minor_birthday: {
  //   coordinates: [{ coordinate: [345, 392], page: 8 }],
  //   renderFieldInPDF: true,
  //   inputType: "text",
  // },
  // third_minor_relation_to_user: {
  //   coordinates: [{ coordinate: [468, 392], page: 8 }],
  //   renderFieldInPDF: true,
  //   inputType: "text",
  // },

  // // Fourth minor choice
  // fourth_minor_full_name: {
  //   coordinates: [{ coordinate: [120, 356], page: 8 }],
  //   renderFieldInPDF: true,
  //   inputType: "text",
  // },
  // fourth_minor_birthday: {
  //   coordinates: [{ coordinate: [342, 356], page: 8 }],
  //   renderFieldInPDF: true,
  //   inputType: "text",
  // },
  // fourth_minor_relation_to_user: {
  //   coordinates: [{ coordinate: [468, 356], page: 8 }],
  //   renderFieldInPDF: true,
  //   inputType: "text",
  // },
};
