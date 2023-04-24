import { useContext, useEffect } from "react";
import { FormEditionContext } from "./FormContext";
import uuid from "uuid/v4";
import { useHistory } from "react-router-dom";
import {
  testQuestionTextSchema,
  testDescriptionTextSchema,
  selectOptionsTesting,
  testSubformSchema,
  selectOptionTextTesting,
  testTextValidation,
} from "../components/fieldsDisplayForm/utils/schemas";
import {
  pushTitle,
  pushQuestion,
  pushSelect,
  pushRadio,
  pushCheckbox,
  pushSubform,
} from "../components/fieldsDisplayForm/utils/FormComposition";

import api from "../api";

import createBackendForm from "../components/fieldsDisplayForm/utils/BackendTranslation";
import { createFrontendForm } from "../components/fieldsDisplayForm/utils/FrontEndTranslation";

const useForm = () => {
  const { formState, idValue } = useContext(FormEditionContext);
  const [form, setForm] = formState;

  const routeId = idValue;

  /** Function that adds a 'question' object into the form array.
   * Its parameters are used on the translation of the backend data.
   * @param question - the question;
   * @param description - the description of the question;
   * @param validation - optional validation the question may have.
   */
  function addToFormQuestion(question, description, validation) {
    pushQuestion(form, question, description, validation);
    setForm([...form]);
  }
  /** Function that adds a 'select' object into the form array.
   * Its parameters are used on the translation of the backend data.
   * @param question - the question;
   * @param description - the description of the question;
   * @param options - the options array;
   * @param validation - optional validation the question may have.
   */
  function addToFormSelect(question, description, options, validation) {
    pushSelect(form, question, description, options, validation);
    setForm([...form]);
  }
  /** Function that adds a 'radio' object into the form array.
   * Its parameters are used on the translation of the backend data.
   * @param question - the question;
   * @param description - the description of the question;
   * @param options - the options array;
   * @param validation - optional validation the question may have.
   */
  function addToFormRadio(question, description, options, validation) {
    pushRadio(form, question, description, options, validation);
    setForm([...form]);
  }
  /** Function that adds a 'checkbox' object into the form array.
   * Its parameters are used on the translation of the backend data.
   * @param question - the question;
   * @param description - the description of the question;
   * @param options - the options array;
   * @param validation - optional validation the question may have.
   */
  function addToFormCheckbox(question, description, options, validation) {
    pushCheckbox(form, question, description, options, validation);
    setForm([...form]);
  }
  /** Function that adds a 'select' object into the form array.
   * Its parameters are used on the translation of the backend data.
   * @param question - the question;
   * @param description - the description of the question;
   * @param subformId - id of the form being used as a subform;
   * @param validation - optional validation the question may have.
   */
  function addToFormSubform(question, description, subformId, validation) {
    pushSubform(form, question, description, subformId, validation);
    setForm([...form]);
  }

  /** Function used on FormFieldRadio, FormFieldCheckbox and FormFieldSelect, it adds a new option field for those types of questions.
   * @param index - the position on the array that the operation needs to be done.
   */
  async function addSelectOption(index) {
    form[index].options.push("");
    form[index].error.errorMsg.options.push("Por favor, preencha esta opção");
    await selectOptionsTesting(form, index);
    setForm([...form]);
  }

  /** Function used on FormFieldRadio, FormFieldCheckbox and FormFieldSelect, it removes an option field for those types of questions.
   * @param index - the position on the array that the operation needs to be done.
   */
  async function removeSelectOption(index, idopt) {
    form[index].options.splice(idopt, 1);
    form[index].error.errorMsg.options.splice(idopt, 1);
    await selectOptionsTesting(form, index);
    setForm([...form]);
  }

  /** Function used on every FormField, it deletes the question from the array.
   * @param index - the position on the array that the operation needs to be done.
   */
  function deleteFromForm(index) {
    form.splice(index, 1);
    setForm([...form]);
  }

  /** Function used on FormFieldQuestion, it handles the validation the user chooses.
   *  Currently, only handle max and min number of characters.
   * @param index - the position on the array that the operation needs to be done.
   */
  function addValidation(index) {
    form[index].validation.push({ type: "", value: "" });
    form[index].error.errorMsg.validationValue = "Por favor, digite um número";
    setForm([...form]);
  }

  /** Function used on every FormField, it updates the value of the question property on the form array.
   * @param value - the value being typed by the user;
   * @param index - the position on the array that the operation needs to be done.
   */
  async function setQuestionField(value, index) {
    form[index].question = value;
    testQuestionTextSchema(form[index].error, value);
    setForm([...form]);
  }

  /** Function used on every FormField, it updates the value of the description property on the array.
   * @param value - the value being typed by the user;
   * @param index - the position on the array that the operation needs to be done.
   */
  async function setDescriptionField(value, index) {
    form[index].description = value;
    setForm([...form]);
  }

  /** Function used on every FormField, it updates the value of the oprion property of the object on the array.
   * @param value - the value being typed by the user;
   * @param index - the position on the array that the operation needs to be done;
   * @param idopt - the id of the options being changed, inside the form[index].
   */
  function setSelectOption(value, index, idopt) {
    form[index].options[idopt] = value;
    selectOptionTextTesting(form[index].error, value, idopt);
    setForm([...form]);
  }

  /** Function used on every FormField, it updates the value of the required property of a question.
   * @param index - the position on the array that the operation needs to be done.
   */
  function setRequiredField(index) {
    form[index].validation[0].value = !form[index].validation[0].value;
    setForm([...form]);
  }
  /** Function to store the selected subform Id on it's corresponding object.
   * @param value - the id of the selected form;
   * @param index - the position on the array that the operation needs to be done.
   */
  async function setSubformId(value, index) {
    form[index].subformId = value;
    await testSubformSchema(form, index);
    setForm([...form]);
  }

  /** Function used on FormFieldText to set the chosen validation type, currently min and max char.
   * @param value - the type of the chosen validation;
   * @param index - the position on the array that the operation needs to be done.
   */
  async function setValidationType(value, index) {
    form[index].validation[1].type = value;
    setForm([...form]);
  }

  /** Function used on FormFieldText to set the value of the validation
   * @param value - the value for the chosen validation;
   * @param index - the position on the array that the operation needs to be done.
   */
  async function setValidationValue(value, index) {
    form[index].validation[1].value = value;
    await testTextValidation(form, index, value);
    setForm([...form]);
  }

  /** Function used on FormFieldText to remove the validaiton.
   * @param index - the position on the array that the operation needs to be done.
   */
  function removeValidation(index) {
    form[index].validation.splice(-1, 1);
    form[index].error.errorMsg.validationValue = "";
    setForm([...form]);
  }
  /** Function used on FormFieldTitle to use the multiple answer property
   */
  function setMultipleAnswer() {

    form[0].mult_answer = !form[0].mult_answer;
    setForm([...form]);
  }
  /** Reordering the form array based on the place the question is being dragged over.
   * @param result - an composed object bringing info about the drag event.
   */
  function onDragEnd(result) {
    if (!result.destination) return;
    const { source, destination } = result;
    const copiedForm = [...form];
    const [removed] = copiedForm.splice(source.index, 1);
    copiedForm.splice(destination.index, 0, removed);
    setForm(copiedForm);
  }
  /** Verify if the validation was changed on the edition.
   * @param backForm - form that came from the backend;
   * @param form - form being edited.
   */
  function differentValidation(backForm, form) {
    for (let i = 0; i < form.validation.length; i++) {
      if (
        JSON.stringify(form.validation[i]) !==
        JSON.stringify(backForm.validation[i])
      ) {
        return true;
      }
    }
    return false;
  }
  /** Comparing the edited form with the 'original' form that is on the backend.
   *  If some property of the input was changed in the edition, its id becomes null.
   */
  async function setId() {
    const fetchData = async () => {
      await api.get(`/form/${routeId}`).then(async function (res) {
        let backForm = createFrontendForm(res.data);
        for (let i = 1; i < backForm.length; i++) {
          for (let j = 1; j < form.length; j++) {
            if (backForm[i].inputId === form[j].inputId) {
              if (
                JSON.stringify(backForm[i], [
                  "question",
                  "description",
                  "options",
                  "subformId",
                ]) !==
                JSON.stringify(form[j], [
                  "question",
                  "description",
                  "options",
                  "subformId",
                ]) ||
                differentValidation(backForm[i], form[j])
              ) {
                form[j].inputId = null;
              }
            }
          }
        }
      });
    };
    await fetchData();
  }
  const history = useHistory();
  /** The submit function. It's triggered when the submit button is pressed on the interface.
   *  Its api call may be to create or to edit a form.
   */
  async function submit(validToSend) {
    if (!validToSend) return;
    if (form[0].mult_answer) {
      document.cookie = `answerForm=${form[0].id}; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
    if (form[0].id) {
      await setId();
      let data = await createBackendForm(form, routeId);
      const post_response = await api
        .put(`/form/${routeId}`, data, {
          headers: {
            authorization: `bearer ${window.sessionStorage.getItem("token")}`,
          },
        })
        .then(function (error) {
          if (!error.response) {
            alert("Seu formulário foi atualizado com sucesso.");
            let path = `/signin`;
            history.push(path);
          }
        })
        .catch(function (error) {
          if (error.response.status === 401) {
            window.sessionStorage.removeItem("token");
            window.sessionStorage.removeItem("userId");
            let path = `/signin`;
            history.push(path);
            return;
          }
          if (error.response.data.error === "User dont own this form.")
            alert("Você não tem permissão para alterar este formulário");
          else if (error.response.data.error === "Found a subform loop")
            alert(
              "Foi encontrada uma recursão de subformulários. Por favor, altere o subformulário selecionado ou o exclua."
            );
          else alert("Um erro ocorreu.");
        });
    } else {
      const post_response = await api
        .post(`/form`, await createBackendForm(form), {
          headers: {
            authorization: `bearer ${window.sessionStorage.getItem("token")}`,
          },
        })
        .then(function (error) {
          if (!error.response) {
            alert("Seu formulário foi criado com sucesso.");
            let path = `/signin`;
            history.push(path);
          }
        })
        .catch(function (error) {
          if (error.response.status === 401) {
            window.sessionStorage.removeItem("token");
            window.sessionStorage.removeItem("userId");
            let path = `/signin`;
            history.push(path);
            return;
          }
          alert("Um erro ocorreu.");
        });
    }
  }

  return {
    addToFormQuestion,
    addToFormSelect,
    addToFormRadio,
    addToFormCheckbox,
    addToFormSubform,
    addSelectOption,
    removeSelectOption,
    deleteFromForm,
    addValidation,
    setQuestionField,
    setDescriptionField,
    setSelectOption,
    setRequiredField,
    setSubformId,
    setValidationType,
    setValidationValue,
    removeValidation,
    setMultipleAnswer,
    onDragEnd,
    submit,
  };
};

export default useForm;
