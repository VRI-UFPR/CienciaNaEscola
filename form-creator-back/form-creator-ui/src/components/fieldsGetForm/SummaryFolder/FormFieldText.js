import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ArrowDownwardOutlinedIcon from "@material-ui/icons/ArrowDownwardOutlined";
import Typography from "@material-ui/core/Typography";
import TextFieldsIcon from "@material-ui/icons/TextFields";
import Tooltip from "@material-ui/core/Tooltip";

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
  expPainelD: {
    display: "block"
  },
  answer: {
    color: "black",
    marginBottom: "5px",
    background: "#80d4ff"
  },
  noAnswer: {
    color: "black",
    marginBottom: "5px"
  },
  type: {
    width: "50px"
  }
}));

function FormFieldText(props) {
  const classes = useStyles();

  /** Counter to text answers. */
  let counter = 0;

  /** HTML object to be displayed on component return. */
  const answer = props.answers.map(function(value) {
    counter += 1;
    if (!value) {
      return (
        <>
          <Typography>{counter}:</Typography>
          <Paper className={classes.noAnswer}>
            <Typography
              container
              wrap="wrap"
              style={{ wordWrap: "break-word" }}
              variant="body1"
            >
              Não respondido.
            </Typography>
          </Paper>
        </>
      );
    }
    return (
      <>
        <Typography>{counter}:</Typography>
        <Paper className={classes.answer}>
          <Typography
            container
            wrap="wrap"
            style={{ wordWrap: "break-word" }}
            variant="body1"
          >
            {value}
          </Typography>
        </Paper>
      </>
    );
  });

  /**
   * Function to check if there's an answer to be display.
   * @param ans - Answer array.
   */
  function checkAnswer(ans) {
    if (ans.length) {
      return ans;
    }

    return "Não há respostas.";
  }

  return (
    <ExpansionPanel className={classes.paper}>
      <ExpansionPanelSummary expandIcon={<ArrowDownwardOutlinedIcon />}>
        <Grid container>
          <Grid item xs={12} className={classes.questionsGrid}>
            <Tooltip placement="left" title="Texto" arrow>
              <Grid container className={classes.type}>
                <TextFieldsIcon />
              </Grid>
            </Tooltip>
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
          </Grid>
        </Grid>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.expPainelD}>
        <Grid container wrap="wrap" container className={classes.answersGrid}>
          {checkAnswer(answer)}
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

export default FormFieldText;
