import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(3),
    width: theme.spacing(100),
    marginBottom: "2%",
    ["@media (max-width: 896px)"]: {
      width: "300px"
    }
  },
  answersGrid: {
    flexDirection: "column",
    color: "black"
  },
  description: {
    marginBottom: "10px"
  },
  questionsGrid: {
    marginBottom: "10px"
  },
  answer: {
    color: "black",
    marginBottom: "5px"
  }
}));

function FormFieldText(props) {
  const classes = useStyles();

  /**
   * Function to display an answer or an messange if there's no answer.
   */
  function answer() {
    if (props.answer) {
      return props.answer[0].value;
    }

    return "Nenhuma resposta";
  }

  return (
    <Paper className={classes.paper}>
      <Grid container>
        <Grid item xs={12} className={classes.questionsGrid}>
          <Typography>id: {Number(props.place)}</Typography>
          <Typography
            style={{ wordWrap: "break-word" }}
            className={classes.text}
            variant="h6"
            gutterBottom
          >
            {"Pergunta: " + props.question}
          </Typography>
          <Grid className={classes.description} container>
            <Typography
              style={{ wordWrap: "break-word" }}
              container
              item
              variant="h8"
            >
              {"Descrição: " + props.description}
            </Typography>
          </Grid>
          <Typography
            style={{ wordWrap: "break-word" }}
            gutterBottom
            variant="h6"
          >
            Resposta:
          </Typography>
        </Grid>
        <Grid container wrap="wrap" container className={classes.answersGrid}>
          <Typography
            style={{ wordWrap: "break-word" }}
            className={classes.answer}
            container
            wrap="wrap"
            variant="body1"
          >
            {answer()}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default FormFieldText;
