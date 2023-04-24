import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
    width: theme.spacing(100),
    height: theme.spacing(22),
    margin: theme.spacing(2),
    color: "#000000",
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
    <Grid>
      <Paper className={classes.paper}>
        <Grid container>
          <Grid item xs={12} className={classes.questionsGrid}>
            <Typography
              style={{ wordWrap: "break-word" }}
              className={classes.title}
              variant="h3"
              gutterBottom
            >
              {props.title}
            </Typography>
          </Grid>
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
    </Grid>
  );
}

export default FormFieldText;
