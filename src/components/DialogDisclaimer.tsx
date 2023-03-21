/**
 * @copyright Copyright © 2018 - 2023 by Edward K Thomas Jr
 * @license GNU GENERAL PUBLIC LICENSE https://www.gnu.org/licenses/gpl-3.0.en.html
 */

import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  IconButton,
  LinearProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import { useSnackbar } from "notistack";
import { useState } from "react";

import { openPDFInSeparateTab, sendMail } from "../utils";

interface Props {
  pdf: Uint8Array;
  onClose: () => void;
}

/**
 * Dialog Disclaimer
 *
 * @param props -
 * @param props.pdf - Byte array of PDF's
 * @param props.onClose - Close dialog
 * @returns JSX.Element
 */
export default function DialogDisclaimer({ pdf, onClose }: Props) {
  const [hasUserAgreed, setHasUserAgreed] = useState<boolean>(false);
  const [hasUserViewed, setHasUserViewed] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  /**
   * Handler for submitting the email with the PDF as an attachment
   *
   * Note: You can also set the emails message, recipients, and subject
   */
  const handleSendEmail = async () => {
    setSending(true);
    try {
      await sendMail({
        attachment: pdf,
        message: "",
        recipients: [],
        subject: "",
      });
      const success = enqueueSnackbar("Successfully submitted document!", {
        variant: "success",
        onClick: () => closeSnackbar(success),
      });
      alert("You can now safely close browser!");
    } catch (error) {
      const failure = enqueueSnackbar(
        "Failed to submit document, please contact your representative.",
        {
          variant: "error",
          persist: true,
          onClick: () => closeSnackbar(failure),
        }
      );
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle sx={{ textAlign: "center" }}>
        Submit Signed Document
      </DialogTitle>
      <DialogContent sx={{ overflowX: "hidden" }}>
        <DialogActions sx={{ m: 5 }}>
          <Button
            onClick={() => {
              openPDFInSeparateTab(pdf);
              setHasUserViewed(true);
            }}
            variant="outlined"
            fullWidth
          >
            Preview PDF
          </Button>

          <IconButton color={hasUserViewed ? "success" : "info"}>
            {hasUserViewed ? (
              <CheckCircleIcon />
            ) : (
              <PendingIcon className="wiggle" />
            )}
          </IconButton>
        </DialogActions>

        <AgreementCheckbox
          disabled={!hasUserViewed}
          onUserAgree={(agreed: boolean) => setHasUserAgreed(agreed)}
        />
        <DialogActions>
          <Button
            disabled={!hasUserAgreed}
            variant="outlined"
            fullWidth
            onClick={handleSendEmail}
          >
            {sending ? (
              <div style={{ width: "100%" }}>
                Submitting PDF...
                <LinearProgress />
              </div>
            ) : (
              <>Submit PDF</>
            )}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Agreement checkbox
 *
 * Note: Not all documents being filled in will required some acknowledgement
 * when submitting. This can be removed at the owners discretion.
 *
 * @param props -
 * @param props.disabled - Whether the agreement checkbox is disabled or not
 * @param props.onUserAgree - Function invoked when user agrees
 * @returns JSX.Element
 */
function AgreementCheckbox({
  disabled,
  onUserAgree,
}: {
  disabled: boolean;
  onUserAgree: (agreed: boolean) => void;
}) {
  return (
    <FormGroup>
      <FormControlLabel
        control={<Checkbox />}
        disabled={disabled}
        label="I Acknowledge That I Have Read And Understand The Terms Of This Agreement As Detailed Above."
        onChange={(_, checked) => onUserAgree(checked)}
      />
      <FormHelperText>
        By accepting this agreement, you are agreeing to all terms and
        conditions set by said owner.
      </FormHelperText>
    </FormGroup>
  );
}
