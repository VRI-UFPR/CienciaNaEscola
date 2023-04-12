import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import useForm from "../../contexts/useForm";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  buttonOk: {
    minWidth: "92px",
    backgroundColor: "#6ec46c",
    "&:hover": {
      backgroundColor: "rgb(25, 109, 23)",
    },
    width: "20%",
    ["@media (max-width:600px)"]: {
      marginTop: "52px",
    },
  },
  button: {
    minWidth: "92px",
    ["@media (max-width:600px)"]: {
      marginTop: "52px",
    },
  },
}));
/** Main function that returns the button to submit the form, it may vary between a form creation and edition.
 * @param formId - if an id is passed, then it's the edition operation that's being done.
 */
export default function SubmitButton({ validToSend, formId }) {
  /** Importing the submit function. */
  const { submit } = useForm();
  /** Style class. */
  const classes = useStyles();
  /** Handling the variables between the creation and the edition screens */
  let submitMsg,
    unabledMsg =
      "Verifique se você criou pelo menos uma pergunta e se as perguntas estão propriamente construídas",
    buttonLabel;
  if (formId) {
    submitMsg = "Submeter edição";
    buttonLabel = "Confirmar";
  } else {
    submitMsg = "Criar seu formulário";
    buttonLabel = "Criar";
  }

  return (
    <Tooltip
      title={validToSend ? submitMsg : unabledMsg}
      aria-label={validToSend ? submitMsg : unabledMsg}
    >
      <Button
        className={validToSend ? classes.buttonOk : classes.button}
        variant="contained"
        type="submit"
        onClick={() => submit(validToSend)}
      >
        {buttonLabel}
      </Button>
    </Tooltip>
  );
}
