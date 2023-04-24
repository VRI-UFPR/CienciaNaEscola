import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
    width: theme.spacing(100),
    height: "40%",
    color: "#000000",
    ["@media (max-width:827px)"]: {
      width: "85%",
    },
    marginBottom: "12px",
    marginTop: "16px",
  },
  questionsGrid: {
    marginBottom: "20px",
    color: "#000000",
    ["@media (max-width:827px)"]: {
      width: theme.spacing(70),
    },
  },
  title: {
    fontSize: "45px",
    color: "#000000",
    ["@media (max-width:827px)"]: {
      fontSize: "35px",
    },
    ["@media (max-width:590px)"]: {
      fontSize: "25px",
    },
  },
  description: {
    fontSize: "30px",
    color: "#000000",
    ["@media (max-width:827px)"]: {
      fontSize: "25px",
    },
    ["@media (max-width:590px)"]: {
      fontSize: "15px",
    },
  },
}));

function FormFieldText(props) {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Typography
        style={{ wordWrap: "break-word" }}
        className={classes.title}
        variant="h3"
        gutterBottom
      >
        {props.title}
      </Typography>
      <Grid item xs={9} className={classes.questionsGrid}>
        <Typography
          style={{ wordWrap: "break-word" }}
          className={classes.description}
          variant="h4"
          gutterBottom
        >
          {props.description}
        </Typography>
      </Grid>
    </Paper>
  );
}

export default FormFieldText;
