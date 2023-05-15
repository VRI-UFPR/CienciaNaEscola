import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import FormFieldText from "./FormFieldText";
import FormFieldSelect from "./FormFieldSelect";
import FormFieldRadio from "./FormFieldRadio";
import FormFieldCheckbox from "./FormFieldCheckbox";
import FormFieldSubform from "./FormFieldSubform";

const useStyles = makeStyles(theme => ({
  menu: {
    width: theme.spacing(6),
    minheight: theme.spacing(15),
    position: "fixed",
    top: theme.spacing(10),
    left: "90%",
    padding: theme.spacing(1)
  },

  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    ["@media (max-width: 446px)"]: {
      marginRight: "100px",
      marginBottom: "20px"
    }
  },
  container: {
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "white",
    marginBottom: "20px",
    marginTop: "25px",
    marginLeft: "2%",
    justifyContent: "center"
  },
  gridMenu: {
    display: "flex",
    alignItems: "center",
    marginLeft: "20px"
  },
  formTitle: {
    marginTop: "10px"
  },

  msg: {
    textAlign: "center"
  }
}));
function Summary(props) {
  const classes = useStyles();

  /**
   * Finds all the answers from a question.
   * @param questionId - Qustion's ID to have answers associated with.
   * @returns - All the question's answer in an array
   */
  function findAnswer(questionId) {
    let tmp = [];
    props.answers.filter(value => {
      if (value[questionId]) {
        tmp.push(value[questionId][0].value);
      } else {
        tmp.push("");
      }
    });
    return tmp;
  }

  /**
   * Function to count how many answers a checkbox/radio/select has
   * @param questionId - Question's ID.
   */
  function result(questionId) {
    let result = [];
    props.formArray.map(form => {
      if (form.inputAnswers[questionId]) {
        form.inputAnswers[questionId].map((answer, index) => {
          if (answer.value === "true") {
            if (result[index]) {
              result[index] += 1;
            } else {
              result[index] = 1;
            }
          }
        });
      }
    });
    return result;
  }

  return (
    <>
      <Grid
        container
        direction="column"
        className={classes.container}
        alignItems="center"
        justify="center"
      >
        <div>
          {props.multAnswer ? (
            <Grid className={classes.msg}>
              <Typography style={{ wordWrap: "break-word" }} gutterBottom>
                Esse formulário permite multiplas respostas de um mesmo usuário
              </Typography>
            </Grid>
          ) : (
              <Grid />
            )}
          {props.formArray[0].form.inputs.map((input, index) => {
            if (input.type === 0)
              return (
                <FormFieldText
                  question={input.question}
                  description={input.description}
                  id={input.id}
                  answers={findAnswer(input.id)}
                />
              );
            else if (input.type === 3)
              return (
                <FormFieldSelect
                  question={input.question}
                  id={input.id}
                  description={input.description}
                  options={input.sugestions}
                  answer={result(input.id)}
                  place={input.placement}
                />
              );
            else if (input.type === 2)
              return (
                <FormFieldRadio
                  question={input.question}
                  description={input.description}
                  id={input.id}
                  options={input.sugestions}
                  answer={result(input.id)}
                  place={input.placement}
                />
              );
            else if (input.type === 1)
              return (
                <FormFieldCheckbox
                  question={input.question}
                  description={input.description}
                  options={input.sugestions}
                  id={input.id}
                  answer={result(input.id)}
                  place={input.placement}
                />
              );
            else if (input.type === 4)
              return (
                <FormFieldSubform
                  question={input.question}
                  description={input.description}
                  options={input.sugestions}
                  id={input.subForm.contentFormId}
                  result={result}
                  findAnswer={findAnswer}
                />
              );
          })}
        </div>
      </Grid>
    </>
  );
}
export default Summary;
