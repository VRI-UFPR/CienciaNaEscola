import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import api from "../api";
import { createMuiTheme, MuiThemeProvider, Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";

import FormFieldText from "../components/fieldsVisualizeForm/FormFieldText";
import FormFieldSelect from "../components/fieldsVisualizeForm/FormFieldSelect";
import FormFieldRadio from "../components/fieldsVisualizeForm/FormFieldRadio";
import FormFieldCheckbox from "../components/fieldsVisualizeForm/FormFieldCheckbox";
import FormFieldTitle from "../components/fieldsVisualizeForm/FormFieldTitle";
import FormFieldSubform from "../components/fieldsVisualizeForm/FormFieldSubform";

const useStyles = makeStyles(theme => ({
  button: {
    marginBottom: "15%",
    backgroundColor: "#d3d609",
    minWidth: "92px",
    width: "12%",
    ["@media (max-width:600px)"]: {
      marginBottom: "20%"
    }
  },
  progress: {
    marginTop: "5%"
  },
  pageBody: {
    minHeight: "calc(100vh - 92.4px - 78px)",
    paddingBottom: "78px"
  },
  sizeFormating: {
    ["@media (max-width:430px)"]: {
      marginLeft: "3%",
      width: "92%"
    }
  },
  msg: {
    textAlign: "center"
  }
}));

const theme = createMuiTheme({
  overrides: {
    MuiInput: {
      underline: {
        "&:before": {
          borderBottom: "1px solid #35c7fc"
        },
        "&:after": {
          borderBottom: "1px solid #3f51b5"
        }
      }
    },
    MuiButton: {
      label: {
        color: "black"
      }
    }
  }
});

function VisualizeForm() {
  const classes = useStyles();
  const history = useHistory();

  /** Form id got from the browser's URL */
  const { id } = useParams();

  /** Maped form from backend */
  const [formData, setFormData] = useState(0);
  const [multAnswer, setMultAnswer] = useState();

  /**
   * Function to get form object from the API.
   * @param id - Form id got from the broswer's URL
   */
  async function getForm(id) {
    const res = await api
      .get(`/form/${id}`)
      .then(function (res) {
        console.log(res.data)
        setMultAnswer(res.data.answerTimes)
        setFormData(res.data);
      })
      .catch(error => {
        if (error.response.status === 401) {
          window.sessionStorage.removeItem("token");
          window.sessionStorage.removeItem("userId");
          let path = `/signin`;
          history.push(path);
          return;
        }

        if (error.response.status === 500) {
          if (error.response.data.error === "User dont own this form.") {
            alert("Você não é o dono deste formulário.");
          } else {
            alert("Ocorreu um erro inesperado. Tente novamente mais tarde.");
          }
        }
        return;
      });
  }

  const toLogin = () => {
    if (window.confirm("Tem certeza que deseja sair?")) {
      let path = "/signin";
      history.push(path);
    }
  };

  /** First thing the page does is getting the form from the API. */
  useEffect(() => {
    getForm(id);
  }, []);

  return (
    <MuiThemeProvider theme={theme}>
      <div className={classes.pageBody}>
        <Grid
          container
          xs={12}
          direction="column"
          alignItems="center"
          justify="center"
          className={classes.sizeFormating}
        >
          {multAnswer ? (
            <Grid className={classes.msg}>
              <Typography style={{ wordWrap: "break-word" }} gutterBottom>
                Esse formulário permite multiplas respostas de um mesmo usuário
              </Typography>
            </Grid>
          ) : (
              <Grid />
            )}
          {formData ? (
            <>
              <FormFieldTitle
                title={formData.title}
                description={formData.description}
              />
              {formData.inputs.map((input, index) => {
                if (input.type === 0)
                  return (
                    <FormFieldText
                      question={input.question}
                      description={input.description}
                      id={input.id}
                    />
                  );
                else if (input.type === 3)
                  return (
                    <FormFieldSelect
                      question={input.question}
                      id={input.id}
                      description={input.description}
                      options={input.sugestions}
                    />
                  );
                else if (input.type === 2)
                  return (
                    <FormFieldRadio
                      question={input.question}
                      description={input.description}
                      id={input.id}
                      options={input.sugestions}
                    />
                  );
                else if (input.type === 1)
                  return (
                    <FormFieldCheckbox
                      question={input.question}
                      description={input.description}
                      options={input.sugestions}
                      id={input.id}
                    />
                  );
                else if (input.type === 4)
                  return (
                    <FormFieldSubform
                      question={input.question}
                      description={input.description}
                      options={input.sugestions}
                      id={input.subForm.contentFormId}
                    />
                  );
              })}
              <Grid container justify="center">
                <Button
                  variant="contained"
                  className={classes.button}
                  onClick={toLogin}
                >
                  Voltar
                </Button>
              </Grid>
            </>
          ) : (
              <Grid container justify="center" className={classes.progress}>
                <CircularProgress />
              </Grid>
            )}
        </Grid>
      </div>
    </MuiThemeProvider>
  );
}

export default VisualizeForm;
