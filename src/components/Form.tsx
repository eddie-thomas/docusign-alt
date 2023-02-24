import {
  type ChangeEvent,
  useEffect,
  useState,
  memo,
  type HTMLInputTypeAttribute,
} from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useSnackbar } from "notistack";

import { FORM_DATA } from "../fields";
import {
  formatPhoneNumber,
  generateUniqueId,
  isUserFieldObject,
  loadPdf,
  saveByteArray,
  toPascalCase,
  writeDataToPdf,
} from "../utils";

export interface FieldState {
  [fieldIdentifier: string]: Array<string>;
}

interface FieldsProps {
  onFormStateChange: (params: FieldStateChangeProps) => void;
}

interface FieldProps extends FieldsProps {
  fieldIdentifier: string;
  index: number;
  inputType: HTMLInputTypeAttribute;
  required: boolean;
  onDelete?: () => void;
}

interface FieldStateChangeProps {
  fieldIdentifier: string;
  index: number;
  value?: string;
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

/**
 * Form
 *
 * @returns JSX.Element
 */
export default function Form() {
  const [formState, setFormState] = useState<FieldState>();
  const [loading, setLoading] = useState<LoadingStatus>(
    LoadingStatus.Unfulfilled
  );

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  /**
   * Handle main form state change
   *
   * @param props -
   * @param props.fieldIdentifier - Field identifier, a key string represented from the JSON payload
   * @param props.index - The field state is an array, because we can have 0 to many things, so we need to know the index of the specific field value being changed
   * @param props.value - The updated value, name is misleading
   */
  const handleFormStateChange = ({
    fieldIdentifier,
    index,
    value,
  }: FieldStateChangeProps) => {
    setFormState((prev) => {
      const specificFieldState = Array.from(prev?.[fieldIdentifier] || []);

      // Splice and remove/update value
      value
        ? specificFieldState.splice(index, 1, value)
        : specificFieldState.splice(index, 1);

      const updated: FieldState = {
        ...prev,
        [fieldIdentifier]: specificFieldState,
      };

      return updated;
    });
  };

  /**
   * Handle submission of data
   *
   * @async
   */
  const handleSubmit = async () => {
    if (formState === undefined) return;

    console.log(formState);

    const verifiedFields = Object.entries(formState).every(
      ([key, userEnteredValue]) => {
        const identifiedFieldData = FORM_DATA.fields[key];
        if (!isUserFieldObject(identifiedFieldData)) {
          throw Error(
            "Cannot have auto-generated field properties for a field displayed to a user!"
          );
        }

        return (
          (identifiedFieldData.minCount || 0) <= userEnteredValue.length &&
          (identifiedFieldData.maxCount ||
            identifiedFieldData.coordinates.length) >= userEnteredValue.length
        );
      }
    );

    if (!verifiedFields) {
      const id = enqueueSnackbar("Please fill out every field!", {
        variant: "error",
        onClick: () => closeSnackbar(id),
      });
      return;
    }

    const id = enqueueSnackbar("Generating PDF...", {
      variant: "info",
      onClick: () => closeSnackbar(id),
    });

    const pdfDoc = await loadPdf();
    const writtenPdf = await writeDataToPdf({
      pdf: pdfDoc,
      fields: FORM_DATA.fields,
      formState,
    });
    const pdfBytes = await writtenPdf.save();
    const success = enqueueSnackbar("Successfully created PDF!", {
      variant: "success",
      onClick: () => closeSnackbar(success),
    });
    if (pdfBytes) saveByteArray(`Mr_Wet_Jet_Waiver.pdf`, pdfBytes);
  };

  useEffect(() => {
    /**
     * Fetch initial form data
     *
     * @async
     */
    const fetchInitialFormData = async () => {
      setLoading(LoadingStatus.Pending);
      try {
        // Potentially fetch field data from server
        const formStateObj: FieldState = Object.assign(
          {},
          ...Object.entries(FORM_DATA.fields)
            .filter(([, props]) => props.renderFieldInPDF)
            .map(([key, props]) => {
              // Make sure we have user generated props
              if (!isUserFieldObject(props)) {
                throw Error(
                  "Cannot have auto-generated field properties for a field displayed to a user!"
                );
              }

              return {
                [key]: Array.from({ length: props.minCount || 0 }, () => ""),
              };
            })
        );

        setFormState(formStateObj);
        const id = enqueueSnackbar("Successfully loaded field data.", {
          variant: "success",
          onClick: () => closeSnackbar(id),
        });
      } catch (e) {
        console.warn(e);
        const id = enqueueSnackbar("Failed to load field data.", {
          variant: "error",
          onClick: () => closeSnackbar(id),
        });
      } finally {
        setLoading(LoadingStatus.Fulfilled);
      }
    };

    if (formState === undefined) {
      fetchInitialFormData();
    }
  }, [formState]);

  return (
    <StyledPaper>
      <Typography textAlign="center" variant="h4">
        {FORM_DATA.title}
      </Typography>
      <Divider sx={{ m: 3 }} />

      {loading === LoadingStatus.Fulfilled ? (
        <PureFields onFormStateChange={handleFormStateChange} />
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
 * Pure `Fields` component
 *
 * @see {Fields}
 */
const PureFields = memo(Fields);

/**
 * Pure, individual `Field` component
 *
 * @see {Field}
 */
const PureField = memo(Field);

/**
 * Collection of `Field` components
 *
 * @param props -
 * @param props.onFormStateChange - Handler for changing the parent's state
 * @returns JSX.Element
 */
function Fields({ onFormStateChange }: FieldsProps) {
  return (
    <>
      {Object.entries(FORM_DATA.fields)
        .filter(([fieldIdentifier, props]) => {
          // Collections should not be rendered here
          const isCollection = FORM_DATA.collections.some((collection) =>
            collection.fieldIdentifiers.includes(fieldIdentifier)
          );
          return props.renderFieldInPDF && !isCollection;
        })
        .map(([key, props]) => {
          // Make sure we have user generated props
          if (!isUserFieldObject(props)) {
            throw Error(
              "Cannot have auto-generated field properties for a field displayed to a user!"
            );
          }

          const {
            inputType,
            minCount = 0,
            maxCount = props.coordinates.length,
          } = props;

          const [values, setValues] = useState<string[]>(() =>
            Array.from({ length: minCount || 0 }, generateUniqueId)
          );

          const handleAddField = () => {
            setValues((prevValues) => {
              const updatedValues = Array.from(prevValues);
              updatedValues.push(generateUniqueId());
              return updatedValues;
            });
          };

          return (
            <Box key={key} sx={{ margin: (theme) => theme.spacing(1) }}>
              <Typography>
                {toPascalCase(key)}
                {minCount ? <b>*</b> : null}
                {values.length < maxCount ? (
                  <IconButton onClick={handleAddField}>
                    <AddIcon />
                  </IconButton>
                ) : null}
              </Typography>
              {values.map((uniqueID, index) => {
                return (
                  <PureField
                    key={uniqueID}
                    fieldIdentifier={key}
                    index={index}
                    inputType={inputType}
                    required={!(index + 1 > minCount)}
                    onDelete={() => {
                      setValues((prevValues) => {
                        const updatedValues = Array.from(prevValues);
                        updatedValues.splice(index, 1);
                        onFormStateChange({ fieldIdentifier: key, index });
                        return updatedValues;
                      });
                    }}
                    onFormStateChange={onFormStateChange}
                  />
                );
              })}
            </Box>
          );
        })}
      {FORM_DATA.collections.map((collection) => {
        const { fieldIdentifiers, minCount = 0, maxCount } = collection;

        const [values, setValues] = useState<string[]>(() =>
          Array.from({ length: minCount }, generateUniqueId)
        );

        const handleAddField = () => {
          setValues((prevValues) => {
            const updatedValues = Array.from(prevValues);
            updatedValues.push(generateUniqueId());
            return updatedValues;
          });
        };

        return (
          <Box
            key={fieldIdentifiers.join()}
            sx={{ margin: (theme) => theme.spacing(1) }}
          >
            <Typography>
              {collection.title}
              {minCount ? <b>*</b> : null}
              {values.length < maxCount ? (
                <IconButton onClick={handleAddField}>
                  <AddIcon />
                </IconButton>
              ) : null}
            </Typography>
            <Box
              key={fieldIdentifiers.join()}
              sx={{
                display: "flex",
                margin: (theme) => theme.spacing(1),
              }}
            >
              {values.map((uniqueID, index) => (
                <Grid
                  key={uniqueID + fieldIdentifiers.join()}
                  container
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    margin: (theme) => theme.spacing(1),
                  }}
                >
                  <Grid item>
                    {fieldIdentifiers.map((key) => {
                      const props = FORM_DATA.fields[key];
                      // Make sure we have user generated props
                      if (!isUserFieldObject(props)) {
                        throw Error(
                          "Cannot have auto-generated field properties for a field displayed to a user!"
                        );
                      }

                      return (
                        <Box key={uniqueID + key}>
                          <Typography>{toPascalCase(key)}</Typography>
                          <PureField
                            fieldIdentifier={key}
                            index={index}
                            inputType={props.inputType}
                            required={!(index + 1 > minCount)}
                            onFormStateChange={onFormStateChange}
                          />
                        </Box>
                      );
                    })}
                  </Grid>
                  <Grid item>
                    <IconButton
                      onClick={() => {
                        setValues((prevValues) => {
                          const updatedValues = Array.from(prevValues);
                          updatedValues.splice(index, 1);
                          fieldIdentifiers.map((key) =>
                            onFormStateChange({
                              fieldIdentifier: key,
                              index,
                            })
                          );
                          return updatedValues;
                        });
                      }}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
            </Box>
          </Box>
        );
      })}
    </>
  );
}

/**
 * Individual field component
 *
 * @param props -
 * @param props.fieldIdentifier - The field's unique identifier
 * @param props.index - The index of the field, for updating state management
 * @param props.inputType - The input type of the field
 * @param props.required - Whether the field is required, if so the field cannot be deleted
 * @param props.onDelete - Delete function, also used to see if the field can be deleted (if function is undefined, no delete button will be rendered)
 * @param props.onFormStateChange - Change handler for updating the top-level
 * @returns JSX.Element
 */
function Field({
  fieldIdentifier,
  index,
  inputType,
  required,
  onDelete,
  onFormStateChange,
}: FieldProps) {
  const [value, setValue] = useState<string>("");
  const errored = required && value === undefined;

  /**
   * Change handler
   *
   * Note: From the first change, we will always have a string represent
   * the value, even if it's just an empty string
   *
   * @param event - Change event
   */
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    /**
     * Changed value
     *
     * - We can do some interpreting based on the `inputType` to figure out whether
     * we can format the data. Note, this would probably turn into a decently long
     * turnery if we get a lot of formatting in.
     */
    const val =
      inputType === "tel"
        ? formatPhoneNumber(event.target.value)
        : event.target.value;

    // Set the state of this memoized field component
    setValue(val);
  };

  useEffect(() => {
    onFormStateChange({ fieldIdentifier, index, value });
  }, [fieldIdentifier, index, value]);

  return (
    <TextField
      autoComplete="off"
      error={errored}
      fullWidth
      onChange={handleChange}
      type={inputType}
      value={value}
      InputProps={{
        endAdornment:
          !required && onDelete ? (
            <InputAdornment position="end">
              <IconButton onClick={onDelete}>
                <DeleteOutlineIcon />
              </IconButton>
            </InputAdornment>
          ) : null,
      }}
    />
  );
}
