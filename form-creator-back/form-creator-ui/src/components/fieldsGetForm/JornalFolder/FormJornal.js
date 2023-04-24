import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

import FormFieldText from "./FormFieldText";
import FormFieldSelect from "./FormFieldSelect";
import FormFieldRadio from "./FormFieldRadio";
import FormFieldCheckbox from "./FormFieldCheckbox";
import FormFieldTitle from "./FormFieldTitle";
import FormFieldSubform from "./FormFieldSubform";
import JornalTab from "./JornalTab";
import { validate } from "json-schema";

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

function Jornal(props) {
  const classes = useStyles();

  /** Variable of the selected form number in an array of forms. */
  const [selectedForm, setSelectedForm] = useState(0);

  /**
   * Date parser and validator.
   * @param date - Date string to be parsed.
   */
  function manageDate(date) {
    if (date === "") {
      return "";
    }

    let newDate = new Date(date);
    let options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return newDate.toLocaleDateString("pt-BR", options);
  }

  /**
   * Function to find the array of answers of a given question.
   * @param questionId - Question's ID.
   */
  function findAnswer(questionId) {
    if (props.formArray[selectedForm].inputAnswers[questionId]) {
      return Object.values(
        props.formArray[selectedForm].inputAnswers[questionId]
      );
    }
  }

  /**
   * Function to change the current page to a new one.
   * @param page - Selected page.
   */
  function changePage(page) {
    setSelectedForm(page - 1);
  }

  return (
    <>
      <JornalTab
        answerNumber={props.answerNumber}
        pagesNum={props.formArray.length}
        changePage={changePage}
      />
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
          <Grid className={classes.msg}>
            <Typography>
              Data da resposta: {manageDate(props.timestamp[selectedForm])}
            </Typography>
          </Grid>
          {props.formArray[selectedForm].form.inputs.map((input, index) => {
            if (input.type === 0)
              return (
                <FormFieldText
                  question={input.question}
                  description={input.description}
                  id={input.id}
                  answer={findAnswer(input.id)}
                  place={input.placement}
                />
              );
            else if (input.type === 3)
              return (
                <FormFieldSelect
                  question={input.question}
                  id={input.id}
                  description={input.description}
                  options={input.sugestions}
                  answer={findAnswer(input.id)}
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
                  answer={findAnswer(input.id)}
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
                  answer={findAnswer(input.id)}
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
                  findAnswer={findAnswer}
                  place={input.placement - 1}
                />
              );
          })}
        </div>
      </Grid>
    </>
  );
}
export default Jornal;
