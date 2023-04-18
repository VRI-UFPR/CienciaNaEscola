import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import useForm from "../../contexts/useForm";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Tooltip from "@material-ui/core/Tooltip";
import Switch from "@material-ui/core/Switch";

/** CSS styles used on page components. */
const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
    width: theme.spacing(100),
    ["@media (max-width:1050px)"]: {
      width: theme.spacing(63),
      ["@media (max-width:849px)"]: {
        width: "85%",
      },
    },
    marginBottom: "2%",
    ["@media (min-width:600px)"]: {
      marginLeft: "4%",
    },
  },
  questionsGrid: {
    marginBottom: "20px",
  },
  title: {
    fontSize: "x-large",
    lineHeight: "normal",
  },
  description: {
    fontSize: "large",
    marginBottom: "2%",
    ["@media (max-width:370px)"]: {
      marginBottom: "4%",
    },
  },
  errorGrid: {
    marginTop: "1%",
    color: "#ff4646",
    width: "40%",
    fontSize: "13px",
  },
}));
/** Main function that returns the 'title' field. */
function FormFieldText(props) {
  /** Style class. */
  const classes = useStyles();
  /** Importing functions to change the question and the description values. */
  const {
    setQuestionField,
    setDescriptionField,
    setMultipleAnswer,
  } = useForm();
  return (
    <Paper className={classes.paper}>
      <TextField
        multiline
        value={props.question}
        label="Título do formulário"
        fullWidth
        onChange={(e) => setQuestionField(e.target.value, props.idq)}
        InputProps={{
          classes: {
            input: classes.title,
          },
        }}
        InputLabelProps={classes.test}
      />
      {props.error ? (
        <Grid className={classes.errorGrid}>
          {props.error.errorMsg.question}
        </Grid>
      ) : null}

      <Grid item xs={9} className={classes.questionsGrid}>
        <TextField
          multiline
          value={props.description}
          label="Descrição do formulário"
          onChange={(e) => setDescriptionField(e.target.value, props.idq)}
          InputProps={{
            classes: {
              input: classes.description,
            },
          }}
        />
        {props.error ? (
          <Grid className={classes.errorGrid}>
            {props.error.errorMsg.description}
          </Grid>
        ) : null}
      </Grid>
      <Grid
        item
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
        xs={12}
      >
        <Tooltip
          title="Marcar como obrigatório"
          aria-label="Marcar como obrigatório"
        >
          <FormControlLabel
            control={
              <Switch
                onChange={(e) => setMultipleAnswer()}
                value="required"
                color="primary"
                checked={props.multAnswer}
              />
            }
            style={{ size: "0px" }}
            label="Habilitar resposta múltipla por usuário"
          />
        </Tooltip>
      </Grid>
    </Paper>
  );
}

export default FormFieldText;
