import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
    width: theme.spacing(100),
    marginBottom: "2%",
    ["@media (max-width: 896px)"]: {
      width: "300px",
    },
  },
  questionsGrid: {
    marginBottom: "20px",
  },
  text: {
    color: "black",
  },
}));

function FormFieldRadio(props) {
  const classes = useStyles();

  /**
   * Function to check if an index has a true value.
   * @param index - Index of a given value.
   */
  function handleProps(index) {
    if (props.answer) {
      if (props.answer[index].value === "false") {
        return false;
      }
      return true;
    }
    return false;
  }

  /** HTML object to be displayed on component return. */
  const options = props.options.map(function (x, index) {
    return (
      <span>
        <Typography className={classes.text} variant="h7">
          {x.value}
        </Typography>
        <Radio disabled checked={handleProps(index)} value={x.value} />
      </span>
    );
  });

  return (
    <Paper className={classes.paper}>
      <Grid container>
        <Grid item xs={12} className={classes.questionsGrid}>
          <Typography>id: {Number(props.place)}</Typography>
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
        <Grid
          item
          container
          direction="column"
          justify="flex-start"
          alignItems="flex-start"
          xs={5}
          className={classes.questionsGrid}
        >
          <RadioGroup>{options}</RadioGroup>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default FormFieldRadio;
