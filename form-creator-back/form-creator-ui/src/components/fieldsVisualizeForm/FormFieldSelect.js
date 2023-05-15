import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
    width: theme.spacing(100),
    height: "15%",
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

function FormFieldSelect(props) {
  const classes = useStyles();

  /** HTML object to be displayed on component return. */
  const options = props.options.map(function (x) {
    return <MenuItem value={x.placement}>{x.value}</MenuItem>;
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
          <Typography
            style={{ wordWrap: "break-word" }}
            variant="h8"
            gutterBottom
          >
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
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            disabled
          >
            {options}
          </Select>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default FormFieldSelect;
