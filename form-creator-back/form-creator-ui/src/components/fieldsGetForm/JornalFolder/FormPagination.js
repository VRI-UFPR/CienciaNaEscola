import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
const useStyles = makeStyles(theme => ({
  container: {
    flexDirection: "row",
    backgroundColor: "white",
    marginBottom: "20px"
  },

  text: {
    width: "50px",
    marginRight: "1px",
    marginLeft: "1px"
  },

  button: {
    fontSize: "30px",
    height: "30px"
  },

  buttonDisabled: {
    fontSize: "30px",
    height: "30px",
    color: "grey"
  },

  valid: {
    color: "red"
  }
}));

function FormPagination(props) {
  const classes = useStyles();

  /** Variables declarition */
  const [selectedPage, setSelectedPage] = React.useState(1);
  const [isFirst, setIsFirst] = React.useState(true);
  const [isLast, setIsLast] = React.useState(false);
  const [valid, setValid] = React.useState("");

  /**
   * Function that checks if a value is beetwen 0 and the last page number.
   * @param value - Value to be checked.
   */
  function checksValid(value) {
    if (value <= 0 || value > props.pagesNum) {
      return false;
    }

    return true;
  }

  /**
   * Handler of pagination's text field.
   * @param event - React event.
   */
  const handlePage = event => {
    checkPage(event.target.value);
    setSelectedPage(event.target.value);
    if (/^[0-9\b]+$/.test(event.target.value)) {
      if (checksValid(event.target.value)) {
        setValid("");
        props.changePage(event.target.value);
      } else {
        setSelectedPage(setSelectedPage);
        setValid("Página não encontrada");
      }
    }
  };

  /**
   * Function to handle if user cicked on minus button.
   */
  function handleMinus() {
    checkPage(Number(selectedPage) - 1);
    setSelectedPage(Number(selectedPage) - 1);
    if (Number(selectedPage) - 1 <= props.pagesNum) {
      setValid("");
    }
    if (checksValid(selectedPage - 1)) {
      props.changePage(selectedPage - 1);
    }
  }

  /**
   * Function to handle if user cicked on plus button.
   */
  function handlePlus() {
    checkPage(Number(selectedPage) + 1);
    setSelectedPage(Number(selectedPage) + 1);
    if (Number(selectedPage) + 1 <= props.pagesNum) {
      setValid("");
    }
    if (checksValid(Number(selectedPage) + 1)) {
      props.changePage(Number(selectedPage) + 1);
    }
  }

  /**
   * Function to set the states of isFirs and isLast, uses a value as reference.
   * @param value - Value to be used as reference.
   */
  function checkPage(value) {
    if (value === 1 || value === "") {
      setIsFirst(true);
      setIsLast(false);
    } else {
      setIsFirst(false);
      if (value >= props.pagesNum) {
        setIsLast(true);
      } else {
        setIsLast(false);
      }
    }
  }

  /** Prevents a bug if there's only one page. */
  useEffect(() => {
    if (props.pagesNum === 1) {
      setIsLast(true);
    }
  }, []);

  return (
    <>
      <Grid container className={classes.container}>
        {isFirst ? (
          <Button disabled onClick={handleMinus}>
            <NavigateBeforeIcon
              color="grey"
              className={classes.buttonDisabled}
            />
          </Button>
        ) : (
          <Button onClick={handleMinus}>
            <NavigateBeforeIcon className={classes.button} />
          </Button>
        )}
        <Grid className={classes.text} item>
          <TextField value={selectedPage} onChange={handlePage} />
        </Grid>
        {isLast ? (
          <Button disabled onClick={handlePlus}>
            <NavigateNextIcon className={classes.buttonDisabled} />
          </Button>
        ) : (
          <Button onClick={handlePlus}>
            <NavigateNextIcon className={classes.button} />
          </Button>
        )}
      </Grid>
      <Typography className={classes.valid}>{valid}</Typography>
    </>
  );
}

export default FormPagination;
