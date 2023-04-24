import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
    width: theme.spacing(100),
    height: "15%",
    margin: theme.spacing(2),
    ["@media (max-width:827px)"]: {
      width: theme.spacing(70),
    },
    ["@media (max-width:590px)"]: {
      width: theme.spacing(40),
    },
  },
  questionsGrid: {
    marginBottom: "20px",
  },
  text: {
    color: "black",
  },
  validation: {
    fontSize: "14px",
    color: "red",
  },
}));

function FormFieldText(props) {
  const classes = useStyles();

  /** Variable that displays the validation message. */
  const [valid, setValid] = React.useState();

  /**
   * Function to validate an input based on input validation.
   * @param answer - Input to be validated.
   */
  function validate(answer) {
    let isValid = true;

    setValid("");
    props.validation.map((val) => {
      switch (val.type) {
        case 2:
          if (answer === "") {
            setValid("Campo obrigatório.");
            isValid = false;
          }
          break;
        case 3:
          if (answer.length > Number(val.arguments[0])) {
            setValid(
              "Este campo requer o máximo de " + val.arguments[0] + " digitos."
            );
            isValid = false;
          }
          break;
        case 4:
          if (answer.length < Number(val.arguments[0])) {
            setValid(
              "Este campo requer o mínimo de " + val.arguments[0] + " digitos."
            );
            isValid = false;
          }
          break;
        default:
          isValid = true;
      }
    });

    return isValid;
  }

  /**
   * Function to send answer to the father component.
   * @param event - React event to get what is typed in.
   */
  const handleChange = (event) => {
    if (validate(event.target.value)) {
      props.createAnswer(props.id, event.target.value, false);
    } else {
      props.createAnswer(props.id, event.target.value, true);
    }
  };

  /** First validates an empty string. */
  useEffect(() => {
    validate("");
  }, []);

  return (
    <Paper className={classes.paper}>
      <Grid container>
        <Grid item xs={12} className={classes.questionsGrid}>
          <Typography
            style={{ wordWrap: "break-word" }}
            className={classes.text}
            variant="h6"
          >
            {props.question}
          </Typography>
          <Typography style={{ wordWrap: "break-word" }} variant="h8">
            {props.description}
          </Typography>
        </Grid>
        <Grid item xs={9} className={classes.questionsGrid}>
          <TextField
            multiline
            id="outlined-disabled"
            label=""
            placeholder="Resposta"
            onChange={handleChange}
          />
          <Typography
            style={{ wordWrap: "break-word" }}
            className={classes.validation}
          >
            {valid}
          </Typography>
        </Grid>
        <Grid
          item
          container
          direction="row"
          justify="flex-end"
          alignItems="flex-end"
          xs={3}
        ></Grid>
      </Grid>
    </Paper>
  );
}

export default FormFieldText;
