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
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";

import { useState } from "react";

import { openPDFInSeparateTab } from "../utils";

interface Props {
  pdf: Uint8Array;
  onClose: () => void;
}
export default function DialogDisclaimer({ pdf, onClose }: Props) {
  const [hasUserAgreed, setHasUserAgreed] = useState<boolean>(false);
  const [hasUserViewed, setHasUserViewed] = useState<boolean>(false);

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
          <Button disabled={!hasUserAgreed} variant="outlined" fullWidth>
            Submit PDF
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

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
