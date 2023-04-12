import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import FormFieldText from "./FormFieldText";
import FormFieldSelect from "./FormFieldSelect";
import FormFieldRadio from "./FormFieldRadio";
import FormFieldCheckbox from "./FormFieldCheckbox";
import FormFieldTitle from "./FormFieldTitle";
import FormFieldSubForm from "./FormFieldSubform";
import uuid from "uuid/v4";
import { verifyError } from "./utils/schemas";
import SideMenu from "./SideMenu";
import { useHistory } from "react-router-dom";

import { FormEditionContext } from "../../contexts/FormContext";
import useForm from "../../contexts/useForm";
import SubmitButton from "./SubmitButton";
/** CSS styles used on page components */
const useStyles = makeStyles((theme) => ({
  app: {
    margin: "0",
    padding: "40px",
    display: "flex",
    ["@media (max-width: 600px)"]: {
      flexDirection: "column-reverse",
      justifyContent: "flex-end",
    },
    paddingBottom: "78px",
    ["@media (min-width: 600px)"]: {
      minHeight: "calc(100vh - 92.4px - 78px -60px)",
    },
    minHeight: "calc(100vh - 71.6px - 78px -60px)",
    marginBottom: "60px",
  },
  addButton: {
    fontSize: "100%",
  },
  sideMenuFormatingGrid: {
    ["@media (max-width:600px)"]: {
      marginTop: "-90px",
    },
  },
  sizeFormating: {
    ["@media (max-width:600px)"]: {
      ["@media (max-width:430px)"]: {
        marginLeft: "1%",
        width: "95%",
      },
      marginLeft: "2%",
    },
  },
  button: {
    marginLeft: "5%",
    backgroundColor: "#a30202",
    minWidth: "92px",
    ["@media (max-width:600px)"]: {
      marginTop: "52px",
    },
    width: "12%",
    ["@media (max-width:600px)"]: {
      marginTop: "52px",
    },
  },
}));
/** CSS style used through Material Ui. */
const theme = createMuiTheme({
  overrides: {
    MuiInput: {
      underline: {
        "&:before": {
          borderBottom: "1px solid #35c7fc",
        },
        "&:after": {
          borderBottom: "1px solid #3f51b5",
        },
      },
    },
    MuiButton: {
      label: {
        color: "white",
      },
    },
  },
});
/** Main function that returns the children that composes the form creation or edition page. */
function DisplayForm() {
  /** Importing and using form state from the context */
  const { formState } = useContext(FormEditionContext);
  const [form] = formState;
  /** Style class. */
  const classes = useStyles();
  /** Importing the function to reorder the questions as consequence of drag'n'drop event */
  const { onDragEnd } = useForm();
  /** An unique string to be used as ID for drag and drop function. */
  const columnId = uuid();
  /** Error state. */
  const [validToSend, setValidToSend] = useState();
  /** variable to redirect */
  const history = useHistory();

  const toLogin = () => {
    if (window.confirm("Tem certeza que deseja sair?")) {
      let path = "/signin";
      history.push(path);
    }
  };
  useEffect(() => {
    console.log(form);
  }, [form]);

  /** Error handling -> every time the form object is updated, it is verified to evaluate it's error messages,
   *  so the submit button can be enabled or disabled.
   */
  useEffect(() => {
    setValidToSend(verifyError(form));
    window.onbeforeunload = confirmExit;
    function confirmExit() {
      return "show warning";
    }
  }, [form]);
  return (
    <MuiThemeProvider theme={theme}>
      <Grid className={classes.app}>
        <Grid xs={12} sm={2} className={classes.sideMenuFormatingGrid}>
          <SideMenu />
        </Grid>
        <DragDropContext onDragEnd={onDragEnd}>
          <Grid
            dragOver
            container
            xs={12}
            sm={8}
            direction="column"
            alignItems="center"
            className={classes.sizeFormating}
          >
            <Droppable droppableId={columnId}>
              {(provided, snapshot) => {
                return (
                  <Grid {...provided.droppableProps} ref={provided.innerRef}>
                    {form ? (
                      form.map((x, index) => {
                        if (x.type === 0)
                          return (
                            <FormFieldText
                              question={x.question}
                              idq={index}
                              description={x.description}
                              id={x.id}
                              error={x.error}
                              validation={x.validation}
                              validationValue={
                                x.validation[1] ? x.validation[1].value : null
                              }
                              validationType={
                                x.validation[1] ? x.validation[1].type : null
                              }
                            />
                          );
                        else if (x.type === 3)
                          return (
                            <FormFieldSelect
                              question={x.question}
                              options={x.options}
                              idq={index}
                              description={x.description}
                              validation={x.validation}
                              id={x.id}
                              error={x.error}
                            />
                          );
                        else if (x.type === 2)
                          return (
                            <FormFieldRadio
                              question={x.question}
                              options={x.options}
                              idq={index}
                              description={x.description}
                              validation={x.validation}
                              id={x.id}
                              error={x.error}
                            />
                          );
                        else if (x.type === 1)
                          return (
                            <FormFieldCheckbox
                              question={x.question}
                              options={x.options}
                              idq={index}
                              description={x.description}
                              validation={x.validation}
                              id={x.id}
                              error={x.error}
                            />
                          );
                        else if (x.type === 4)
                          return (
                            <FormFieldSubForm
                              question={x.question}
                              idq={index}
                              description={x.description}
                              validation={x.validation}
                              id={x.id}
                              error={x.error}
                              validToSend={validToSend}
                              subformId={x.subformId ? x.subformId : null}
                            />
                          );
                        else if (x.type === "title")
                          return (
                            <FormFieldTitle
                              question={x.question}
                              description={x.description}
                              idq={index}
                              error={x.error}
                              multAnswer={x.mult_answer}
                            />
                          );
                      })
                    ) : (
                        <p> carregando... </p>
                      )}
                    {provided.placeholder}
                  </Grid>
                );
              }}
            </Droppable>
            <Grid container justify="center">
              <SubmitButton
                validToSend={validToSend}
                formId={form ? (form[0] ? form[0].id : false) : false}
              />
              <Button
                variant="contained"
                className={classes.button}
                onClick={toLogin}
              >
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </DragDropContext>
      </Grid>
    </MuiThemeProvider>
  );
}

export default DisplayForm;
