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
    minheight: theme.spacing(18),
    margin: theme.spacing(2),
    ["@media (max-width:827px)"]: {
      width: theme.spacing(70),
    },
    ["@media (max-width:590px)"]: {
      width: theme.spacing(40),
    },
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

  /** Temporary array to be used as a type. */
  function vetorTmp() {
    let tmp = [];
    props.options.map((x) => {
      tmp.push(false);
    });
    return tmp;
  }

  /** Variable that displays the validation message. */
  const [valid, setValid] = React.useState();

  /** Input number that was just selected. */
  const [selectedValue, setselectedValue] = React.useState();

  /**
   * Function to validate an input based on input validation.
   * @param answer - Input to be validated.
   */
  function validate(answer) {
    let isValid = true;

    setValid("");
    props.validation.map((val) => {
      switch (val.type) {
        case 2:
          if (
            !answer.some((value) => {
              return value === true;
            })
          ) {
            setValid("Campo obrigatório.");
            isValid = false;
          }
          break;
        default:
          isValid = true;
      }
    });

    return isValid;
  }

  /**
   * Function to set the selectedValue as the event.
   * @param event - React event to get what is selected.
   */
  const handleChange = (event) => {
    validate([]);
    setselectedValue(event.target.value);
  };

  /** Array of boolean to specify what is selected as true */
  const [checkedArray, setcheckedArray] = React.useState(vetorTmp());

  /**
   * Function to send answer to the father component.
   * @param index - Number of the selected value.
   */
  function handleArray(index) {
    for (let i = 0; i < checkedArray.length; ++i) {
      checkedArray[i] = false;
    }

    checkedArray[index] = !checkedArray[index];
    if (validate(checkedArray)) {
      props.createAnswer(props.id, checkedArray, false);
    } else {
      props.createAnswer(props.id, checkedArray, true);
    }
  }

  /** HTML object to be displayed on component return. */
  const options = props.options.map(function (x) {
    return <MenuItem value={x.placement}>{x.value}</MenuItem>;
  });

  /** Everytime selectedValue is changed it's sent to the father component. */
  useEffect(() => {
    handleArray(selectedValue);
  }, [selectedValue]);

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
            onChange={handleChange}
          >
            {options}
          </Select>
          <Typography
            style={{ wordWrap: "break-word" }}
            className={classes.validation}
          >
            {valid}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default FormFieldSelect;
