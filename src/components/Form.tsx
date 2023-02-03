import { type ChangeEvent, useEffect, useState, memo } from "react";
import {
  Box,
  Button,
  Paper,
  styled,
  TextField,
  Typography,
} from "@mui/material";

import {
  formatPhoneNumber,
  loadPdf,
  saveByteArray,
  toPascalCase,
  writeDataToPdf,
} from "../utils";
import { FIELD_DATA, type UserFieldProperties } from "../fields";

export interface FieldState {
  [fieldIdentifier: string]: string;
}

interface FieldsProps {
  onFieldStateChange: (updatedField: FieldState) => void;
}

enum LoadingStatus {
  Unfulfilled,
  Pending,
  Fulfilled,
}

// ------------------------------------------------
// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  margin: theme.spacing(1),
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
}));

// ------------------------------------------------
// Form
/**
 *
 * @returns JSX.Element
 */
export default function Form() {
  const [fieldState, setFieldState] = useState<FieldState>();
  const [loading, setLoading] = useState<LoadingStatus>(
    LoadingStatus.Unfulfilled
  );

  /**
   *
   * @param updatedField - The single, updated field
   */
  const handleFieldStateChange = (updatedField: FieldState) => {
    setFieldState((prev) => {
      const updated: FieldState = {
        ...prev,
        ...updatedField,
      };

      return updated;
    });
  };

  /**
   *
   */
  const handleSubmit = async () => {
    if (fieldState === undefined) return;

    const verifiedFields = Object.entries(fieldState).every(
      ([key, userEnteredValue]) => {
        const identifiedFieldData = FIELD_DATA[key];
        if ("required" in identifiedFieldData) {
          if (
            identifiedFieldData.required &&
            (userEnteredValue === "" || userEnteredValue === undefined)
          )
            return false;
          return true;
        }
        throw Error(
          "A field should displayed to the user should not have its data auto generated."
        );
      }
    );

    if (!verifiedFields) return;
    console.log(verifiedFields);

    const pdfDoc = await loadPdf();
    const writtenPdf = await writeDataToPdf({
      pdf: pdfDoc,
      fields: FIELD_DATA,
      fieldState: fieldState,
    });
    const pdfBytes = await writtenPdf.save();
    if (pdfBytes) saveByteArray(`Mr_Wet_Jet_Waiver.pdf`, pdfBytes);
  };

  useEffect(() => {
    const fetchInitialFieldData = async () => {
      setLoading(LoadingStatus.Pending);
      try {
        // Potentially fetch field data from server
        const fieldStateObj: FieldState = Object.assign(
          {},
          ...Object.entries(FIELD_DATA)
            .filter(([, data]) => data.renderFieldInPDF)
            .map(([key]) => ({ [key]: undefined }))
        );

        setFieldState(fieldStateObj);
      } catch (e) {
        console.warn(e);
      } finally {
        setLoading(LoadingStatus.Fulfilled);
      }
    };

    if (fieldState === undefined) {
      fetchInitialFieldData();
    }
  }, [fieldState]);

  return (
    <StyledPaper>
      <Typography textAlign="center" variant="h4">
        Waiver Form
      </Typography>

      {loading === LoadingStatus.Fulfilled ? (
        <PureFields onFieldStateChange={handleFieldStateChange} />
      ) : null}

      <Button
        sx={{ padding: (theme) => theme.spacing(3) }}
        onClick={handleSubmit}
        variant="outlined"
        fullWidth
      >
        Submit Document
      </Button>
    </StyledPaper>
  );
}

// ------------------------------------------------
// Helper functions

/**
 * Pure Fields component
 */
const PureFields = memo(Fields);

/**
 *
 * @param props -
 * @param props.onFieldStateChange - Handler for changing the parent's state
 * @returns JSX.Element
 */
function Fields({ onFieldStateChange }: FieldsProps) {
  const [errored, setErrored] = useState<string[]>([]);
  return (
    <>
      {Object.entries(FIELD_DATA)
        .filter(([, data]) => {
          return data.renderFieldInPDF;
        })
        .map(([key, data]) => {
          const [value, setValue] = useState<string>();
          const properties = data as UserFieldProperties;

          /**
           *
           * Note: From the first change, we will always have a string represent
           * the value, even if it's just an empty string
           *
           * @param event - Change event
           */
          const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
            const val =
              properties.inputType === "tel"
                ? formatPhoneNumber(event.target.value)
                : event.target.value;

            onFieldStateChange({ [key]: val });
            setValue(val);
            if (properties.required && val === "") {
              setErrored((prev) => [...prev, key]);
            } else if (properties.required) {
              if (!errored.includes(key)) return;
              setErrored((prev) =>
                prev.filter((otherKey: string) => otherKey !== key)
              );
            }
          };

          return (
            <Box key={key} sx={{ margin: (theme) => theme.spacing(1) }}>
              <Typography>
                {toPascalCase(key)}
                {properties.required ? <b>*</b> : null}
              </Typography>
              <TextField
                autoComplete="off"
                error={errored.includes(key)}
                fullWidth
                onChange={handleChange}
                type={properties.inputType}
                value={value}
              />
            </Box>
          );
        })}
    </>
  );
}
