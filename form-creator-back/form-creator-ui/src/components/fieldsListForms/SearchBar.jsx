import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import SearchIcon from "@material-ui/icons/Search";
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";

const useStyles = makeStyles(theme => ({
  container: {
    width: "254px",
    height: "50px",
    marginTop: "15px",
    marginBottom: "15px",
    ["@media (max-width: 446px)"]: {
      marginLeft: "60px",
      marginBottom: "20px"
    },
    ["@media (max-width: 658px)"]: {
      marginRight: "20px"
    }
  },
  Icon: {
    height: "30px",
    fontSize: "20px"
  }
}));

function SearchBar(props) {
  const classes = useStyles();

  const handleChange = event => {
    props.searching(event.target.value);
  };

  return (
    <Grid className={classes.container} container>
      <TextField
        id="outlined-basic"
        label="Busque um formulário"
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="grey" className={classes.Icon} />
            </InputAdornment>
          )
        }}
        onChange={handleChange}
      />
    </Grid>
  );
}

export default SearchBar;