import React, { useState, useEffect } from "react";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import FormPagination from "./FormPagination";

import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles(theme => ({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    marginBottom: "20px"
  },

  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },

  gridMenu: {
    display: "flex",
    alignItems: "center"
  }
}));

function JornalTab(props) {
  const classes = useStyles();

  return (
    <Grid container className={classes.container}>
      <Grid item className={classes.gridMenu}>
        <FormControl className={classes.formControl}>
          <FormPagination
            changePage={props.changePage}
            pagesNum={props.pagesNum}
          />
        </FormControl>
      </Grid>
    </Grid>
  );
}

export default JornalTab;
