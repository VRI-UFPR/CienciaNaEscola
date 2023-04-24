import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

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

function FormFieldRadio(props) {
  const classes = useStyles();

  /** Temporary array to be used as a type. */
  function vetorTmp() {
    let tmp = [];
    props.options.map((x) => {
      tmp.push(false);
    });
    return tmp;
  }

  /** Input number that was just selected. */
  const [selectedValue, setSelectedValue] = React.useState();

  /** Variable that displays the validation message. */
  const [valid, setValid] = React.useState();

  /** Array of boolean to specify what is selected as true */
  const [checkedArray, setCheckedArray] = React.useState(vetorTmp());

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

  /**
   * Function to set the selectedValue as the event.
   * @param event - React event to get what is selected.
   */
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  /** HTML object to be displayed on component return. */
  const options = props.options.map(function (x, index) {
    return (
      <span>
        <Typography
          style={{ wordWrap: "break-word" }}
          className={classes.text}
          variant="h7"
        >
          {x.value}
        </Typography>
        <Radio
          onClick={handleChange}
          checked={selectedValue === x.value}
          onChange={() => handleArray(index)}
          value={x.value}
        />
      </span>
    );
  });

  /** First validates an empty array. */
  useEffect(() => {
    validate([]);
  }, []);

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
        <Grid
          item
          container
          direction="column"
          justify="flex-start"
          alignItems="flex-start"
          xs={5}
          className={classes.questionsGrid}
        >
          <RadioGroup>
            {options}
            <Typography
              style={{ wordWrap: "break-word" }}
              className={classes.validation}
            >
              {valid}
            </Typography>
          </RadioGroup>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default FormFieldRadio;
