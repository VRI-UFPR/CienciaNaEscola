import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
    width: theme.spacing(100),
    minHeight: "15%",
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

function FormFieldCheckbox(props) {
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

  /** Array of boolean to specify what is selected as true */
  const [checkedArray, setcheckedArray] = React.useState(vetorTmp());

  /** Function to send answer to the father component. */
  function sendArray() {
    if (validate(checkedArray)) {
      props.createAnswer(props.id, checkedArray, false);
    } else {
      props.createAnswer(props.id, checkedArray, true);
    }
  }

  /**
   * Function that changes the array based on selected index.
   * @param index - Selected value from input.
   */
  function handleArray(index) {
    checkedArray[index] = !checkedArray[index];
    sendArray();
  }

  /**
   * Function to validate an input based on input validation.
   * @param answer - Input to be validated.
   */
  function validate(answer) {
    let isValid = true;

    setValid("");
    props.validation.map((val) => {
      switch (val.type) {
        case 6:
          if (
            !answer.some((value) => {
              return value === true;
            })
          ) {
            setValid("Preencha pelo menos uma caixa.");
            isValid = false;
          }
          break;
        default:
          isValid = true;
      }
    });

    return isValid;
  }

  /** HTML to be displayed. */
  const options = props.options.map((x, index) => {
    return (
      <span>
        <Typography
          gutterBottom
          style={{ wordWrap: "break-word" }}
          className={classes.text}
          variant="h7"
        >
          {x.value}
        </Typography>
        <Checkbox onChange={() => handleArray(index)} />
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
          {options}
          <div>
            <Typography
              style={{ wordWrap: "break-word" }}
              className={classes.validation}
            >
              {valid}
            </Typography>
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default FormFieldCheckbox;
