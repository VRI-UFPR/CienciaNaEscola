import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import useForm from "../../contexts/useForm";
const useStyles = makeStyles((theme) => ({
  questionsGrid: {
    marginBottom: "20px",
  },
  errorGrid: {
    marginTop: "1%",
    color: "#ff4646",
    width: "40%",
    fontSize: "13px",
  },
  textFieldStyle: {
    width: "80%",
  },
}));
/** Function that returns the question and description components. */
export default function DefaultField(props) {
  /** Style class. */
  const classes = useStyles();
  /** Importing functions to set question and description fields values. */
  const { setQuestionField, setDescriptionField } = useForm();
  return (
    <>
      <Grid item xs={12} sm={6} className={classes.questionsGrid}>
        <TextField
          multiline
          value={props.question}
          label="Pergunta"
          className={classes.textFieldStyle}
          onChange={(e) => setQuestionField(e.target.value, props.idq)}
        />
        {props.error.errorMsg.question && (
          <Grid className={classes.errorGrid}>
            {props.error.errorMsg.question}
          </Grid>
        )}
      </Grid>
      <Grid item xs={12} sm={6} className={classes.questionsGrid}>
        <TextField
          multiline
          value={props.description}
          label="Descrição"
          className={classes.textFieldStyle}
          onChange={(e) => setDescriptionField(e.target.value, props.idq)}
        />
        <Grid className={classes.errorGrid}>
          {props.error.errorMsg.description}
        </Grid>
      </Grid>
    </>
  );
}
