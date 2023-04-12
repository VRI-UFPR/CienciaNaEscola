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
    minheight: theme.spacing(18),
    ["@media (max-width:827px)"]: {
      width: "85%",
    },
    marginBottom: "12px",
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

function FormFieldRadio(props) {
  const classes = useStyles();

  /** HTML object to be displayed on component return. */
  const options = props.options.map(function (x, index) {
    return (
      <span>
        <Typography
          style={{ wordWrap: "break-word" }}
          className={classes.text}
          variant="h7"
        >
          {x.value}
        </Typography>
        <Radio disabled value={x.value} />
      </span>
    );
  });

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
        <Grid
          item
          container
          direction="column"
          justify="flex-start"
          alignItems="flex-start"
          xs={12}
          className={classes.questionsGrid}
        >
          <RadioGroup>{options}</RadioGroup>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default FormFieldRadio;
