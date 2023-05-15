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

function FormFieldSelect(props) {
  const classes = useStyles();

  /**
   * Function to handle the selected answer.
   */
  function handleProps() {
    if (props.answer) {
      return props.answer.filter((each) => {
        return each.value === "true";
      })[0].placement;
    } else {
      return "";
    }
  }

  /**
   * Function to prevent page from broking if there's no answer.
   */
  function answer() {
    if (handleProps() === "") {
      return "";
    }
    return props.options[handleProps()].value;
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
          <Select disabled value={""} displayEmpty>
            <MenuItem value="">{answer()}</MenuItem>
          </Select>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default FormFieldSelect;
