import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import api from "../api";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";

import FormFieldText from "../components/fieldsAnswerForm/FormFieldText";
import FormFieldSelect from "../components/fieldsAnswerForm/FormFieldSelect";
import FormFieldRadio from "../components/fieldsAnswerForm/FormFieldRadio";
import FormFieldCheckbox from "../components/fieldsAnswerForm/FormFieldCheckbox";
import FormFieldTitle from "../components/fieldsAnswerForm/FormFieldTitle";
import FormFieldSubform from "../components/fieldsAnswerForm/FormFieldSubform";

const useStyles = makeStyles((theme) => ({
  menu: {
    width: theme.spacing(6),
    minheight: theme.spacing(15),
    position: "fixed",
    top: theme.spacing(10),
    left: "90%",
    padding: theme.spacing(1),
  },
  progress: {
    marginTop: "5%",
  },
  button: {
    type: "submit",
    width: "100%",
    marginBottom: "50px",
    background: "#6ec46c",
    borderRadius: "2px",
    padding: "10px 20px",
    fontSize: "18px",
    "&:hover": {
      backgroundColor: "rgb(25, 109, 23)",
    },
  },
  pageBody: {
    minHeight: "calc(100vh - 92.4px - 78px)",
    paddingBottom: "78px",
    flexDirection: "column",
  },
  questions: {
    marginBottom: "7%",
  },
}));

function AnwserForm() {
  const classes = useStyles();
  const history = useHistory();

  /** Array of answers created when form is maped from the api */
  const [answerArray, setanswerArray] = React.useState([]);

  /**
   * Function to update the array of answers.
   * @param id - Input's id that was just answered.
   * @param inputAnswer - Input's answer that was just answered.
   * @param error - Boolean variable that indicates if answer is valid or not.
   */
  function createAnswer(id, inputAnswer, error) {
    for (const answer of answerArray) {
      if (id === answer.idInput) {
        answer.answerInput = inputAnswer;
        answer.error = error;
      }
    }
  }

  /** Function to check if answers are valid */
  function isError() {
    return answerArray.some((value) => {
      return value.error;
    });
  }

  /**
   * Function to check if some question was answered.
   * It wouldn't make sense to have a form answered without any answers on it.
   */
  function isAnswer() {
    return answerArray.some((value) => {
      return value.answerInput.length !== 0;
    });
  }

  /** Function to check if the answers of a form can generate a JSON */
  function isValid() {
    if (!isAnswer()) {
      alert("Não há respostas no form");
      return false;
    }

    if (isError()) {
      alert(
        "Erro. Verifique se suas respostas estão de acordo com as validações."
      );
      return false;
    }

    return true;
  }

  /**
   * Funtion to generate the JSON object that is sent to the API
   */
  function backendTranslation() {
    let id;
    let retVal = {};

    if (!isValid()) {
      return;
    }

    for (const answerObj of answerArray) {
      if (answerObj.typeInput === 0 && answerObj.answerInput.length !== 0) {
        id = answerObj.idInput;
        var answer = answerObj.answerInput;
        retVal[id] = [answer];
      } else if (
        (answerObj.typeInput === 1 ||
          answerObj.typeInput === 2 ||
          answerObj.typeInput === 3) &&
        answerObj.answerInput.length !== 0
      ) {
        let tmpArray = [];
        id = answerObj.idInput;
        for (const value of answerObj.answerInput) {
          tmpArray.push(String(value));
        }
        retVal[id] = tmpArray;
      }
    }

    return retVal;
  }

  /** Form id got from the browser's URL */
  const { id } = useParams();

  /** Maped form from backend */
  const [formData, setFormData] = useState(0);

  /**
   * Function to send some form answers to the API
   * @param id - Form id got from the broswer's URL
   */
  async function answerForm(id) {
    if (backendTranslation()) {
      const res = await api
        .post(`/answer/${id}`, backendTranslation())
        .then(function (res) {
          if (!formData.answerTimes) {
            setCookie("answerForm", id, 92);
          }
          alert("Formulário respondido!");
          let path = formData.answerTimes ? `/post/${id}` : `/post/0`;
          history.push(path);
        })
        .catch((error) => {
          if (error.response.status === 401) {
            window.sessionStorage.removeItem("token");
            window.sessionStorage.removeItem("userId");
            let path = `/signin`;
            history.push(path);
            return;
          }
          alert("Ocorreu um erro ao responder seu formulário.");
          return;
        });
    }
  }

  /**
   * Function to map form inputs from the backend.
   * @param form - Form object that just came from the API.
   */
  function mapInputs(form) {
    form.inputs.map((input) => {
      if (
        input.validation.some((value) => {
          return value.type === 2 || value.type === 6;
        })
      ) {
        answerArray.push({
          idInput: input.id,
          typeInput: input.type,
          answerInput: [],
          error: true,
        });
      } else {
        answerArray.push({
          idInput: input.id,
          typeInput: input.type,
          answerInput: [],
          error: false,
        });
      }
    });
  }

  /**
   * Function to get form object from the API.
   * @param id - Form id got from the broswer's URL
   */
  async function getForm(id) {
    const res = await api
      .get(`/form/${id}`)
      .then(function (res) {
        checkCookie(id);
        setFormData(res.data);
        mapInputs(res.data);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          window.sessionStorage.removeItem("token");
          window.sessionStorage.removeItem("userId");
          let path = `/signin`;
          history.push(path);
          return;
        }
        if (error.response.status === 500) {
          alert("Ocorreu um erro: formulário não encontrado.");
          return;
        }
      });
  }

  function setCookie(cookieName, cookieValue, expirationsDays) {
    var date = new Date();
    date.setTime(date.getTime() + expirationsDays * 60 * 60 * 24 * 1000);
    var expires = "expires=" + date.toUTCString();
    document.cookie =
      cookieName + "=" + cookieValue + ";" + expires + ";path=/";
  }

  function getCookie(cookieName) {
    var name = cookieName + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  function checkCookie(id) {
    var answer = getCookie("answerForm");
    if (answer == id) {
      alert("Você já respondeu esse formulário! ");
      let path = `/signin`;
      history.push(path);
    }
  }

  /** First thing the page does is getting the form from the API. */
  useEffect(() => {
    getForm(id);
    window.onbeforeunload = confirmExit;
    function confirmExit() {
      return "show warning";
    }
  }, []);
  console.log(formData);
  return (
    <Grid
      className={classes.pageBody}
      container
      alignItems="center"
      justify="center"
    >
      <Grid item className={classes.questions}>
        {formData ? (
          <div>
            <FormFieldTitle
              title={formData.title}
              description={formData.description}
            />
            {formData.inputs.map((input, index) => {
              if (input.type === 0)
                return (
                  <FormFieldText
                    question={input.question}
                    validation={input.validation}
                    description={input.description}
                    id={input.id}
                    createAnswer={createAnswer}
                  />
                );
              else if (input.type === 3)
                return (
                  <FormFieldSelect
                    question={input.question}
                    validation={input.validation}
                    id={input.id}
                    description={input.description}
                    options={input.sugestions}
                    createAnswer={createAnswer}
                  />
                );
              else if (input.type === 2)
                return (
                  <FormFieldRadio
                    question={input.question}
                    description={input.description}
                    id={input.id}
                    validation={input.validation}
                    options={input.sugestions}
                    createAnswer={createAnswer}
                  />
                );
              else if (input.type === 1)
                return (
                  <FormFieldCheckbox
                    question={input.question}
                    description={input.description}
                    validation={input.validation}
                    options={input.sugestions}
                    id={input.id}
                    createAnswer={createAnswer}
                  />
                );
              else if (input.type === 4)
                return (
                  <FormFieldSubform
                    question={input.question}
                    description={input.description}
                    options={input.sugestions}
                    id={input.subForm.contentFormId}
                    createAnswer={createAnswer}
                    mapInputs={mapInputs}
                  />
                );
            })}
          </div>
        ) : (
            <Grid container justify="center" className={classes.progress}>
              <CircularProgress />
            </Grid>
          )}
      </Grid>
      <Grid>
        <Button
          type="submit"
          variant="contained"
          className={classes.button}
          onClick={() => answerForm(id)}
        >
          Responder
        </Button>
      </Grid>
    </Grid>
  );
}

export default AnwserForm;
