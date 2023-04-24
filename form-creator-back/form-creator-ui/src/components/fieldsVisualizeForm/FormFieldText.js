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

function FormFieldText(props) {
  const classes = useStyles();

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
            disabled
          />
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
