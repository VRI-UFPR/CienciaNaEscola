import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormHelperText from "@material-ui/core/FormHelperText";
import SearchBar from "./SearchBar.jsx";
import { useHistory } from "react-router-dom";

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
    minWidth: 120,
    ["@media (max-width: 446px)"]: {
      marginLeft: "100px",
      marginBottom: "20px"
    }
  },

  selectEmpty: {
    marginTop: theme.spacing(2)
  },

  button: {
    fontSize: 16,
    height: "54px",
    width: "251px",
    backgroundColor: "#6ec46c",
    color: "white",
    ["@media (max-width: 710px)"]: {
      marginBottom: "20px",
      marginLeft: "170px",
      marginBottom: "20px"
    },
    ["@media (max-width: 446px)"]: {
      marginLeft: "60px",
      marginBottom: "20px"
    }
  },

  gridButton: {
    display: "flex",
    alignItems: "center",
    marginRight: "20px",
    color: "white"
  },

  gridMenu: {
    width: "254px",
    display: "flex",
    alignItems: "center",
    marginLeft: "20px"
  },

  searchBar: {
    display: "flex",
    justifyContent: "center"
  }
}));

function Tab(props) {
  const classes = useStyles();
  const history = useHistory();
  const [seletectedValue, setseletectedValue] = React.useState("");

  /** Function to handle event */
  const handleChange = event => {
    props.sort(event.target.value);
    setseletectedValue(event.target.value);
  };

  const handleClick = () => {
    let path = `/create`;
    history.push(path);
  };

  return (
    <Grid container className={classes.container}>
      <Grid item className={classes.gridMenu}>
        <FormControl className={classes.formControl}>
          <Select
            value={seletectedValue}
            onChange={handleChange}
            displayEmpty
            className={classes.selectEmpty}
            inputProps={{ "aria-label": "Without label" }}
          >
            <MenuItem value="">
              Original
            </MenuItem>
            <MenuItem value={1}>Alfabética</MenuItem>
            <MenuItem value={2}>Mais recente</MenuItem>
            <MenuItem value={3}>Relevância</MenuItem>
            <MenuItem value={4}>Data de modificação</MenuItem>
          </Select>
          <FormHelperText>Ordenar</FormHelperText>
        </FormControl>
      </Grid>
      <Grid justify="center" className={classes.searchBar}>
        <SearchBar searching={props.searching} />
      </Grid>
      <Grid item className={classes.gridButton}>
        <Button
          className={classes.button}
          onClick={handleClick}
          variant="contained"
        >
          CRIAR NOVO FORMULÁRIO
        </Button>
      </Grid>
    </Grid>
  );
}

export default Tab;
