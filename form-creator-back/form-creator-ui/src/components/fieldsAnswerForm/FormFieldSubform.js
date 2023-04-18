import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import api from "../../api";
import CircularProgress from "@material-ui/core/CircularProgress";

import FormFieldText from "./FormFieldText";
import FormFieldSelect from "./FormFieldSelect";
import FormFieldRadio from "./FormFieldRadio";
import FormFieldCheckbox from "./FormFieldCheckbox";

const useStyles = makeStyles(theme => ({
  menu: {
    width: theme.spacing(6),
    minheight: theme.spacing(15),
    position: "fixed",
    top: theme.spacing(10),
    left: "90%",
    padding: theme.spacing(1)
  },
  progress: {
    marginTop: "5%"
  }
}));

function FormFieldSubform(props) {
  const classes = useStyles();

  /** Subform id */
  const id = props.id;

  /** Maped subform */
  const [formData, setFormData] = useState(0);

  /** Get subform */
  async function getForm(id) {
    const res = await api.get(`/form/${id}`).then(function(res) {
      setFormData(res.data);
      props.mapInputs(res.data);
    });
  }

  /** First gets info from the backend */
  useEffect(() => {
    getForm(id);
  }, []);

  return (
    <Grid
      container
      direction="column"
      item
      alignItems="center"
      justify="center"
    >
      {formData ? (
        <div>
          {formData.inputs.map((input, index) => {
            if (input.type === 0)
              return (
                <FormFieldText
                  question={input.question}
                  validation={input.validation}
                  description={input.description}
                  id={input.id}
                  createAnswer={props.createAnswer}
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
                  createAnswer={props.createAnswer}
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
                  createAnswer={props.createAnswer}
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
                  createAnswer={props.createAnswer}
                />
              );
            else if (input.type === 4)
              return (
                <FormFieldSubform
                  question={input.question}
                  description={input.description}
                  options={input.sugestions}
                  id={input.subForm.contentFormId}
                  createAnswer={props.createAnswer}
                  mapInputs={props.mapInputs}
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
  );
}

export default FormFieldSubform;
