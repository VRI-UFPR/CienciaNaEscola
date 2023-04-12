/** Functions that create the json object to be sent to the backend. */
import api from "../../../api";
import { createFrontendForm } from "./FrontEndTranslation";
/** Function that pushes the 'translated' object into the new array, wich will be sent to the backend.
 * @param form - the form object;
 * @param index - the position of the question inside the array, to be used as the placement.
 * @param json - the object that will recieve the 'translation', to be sent to the bakcend;
 * @param {sugestions, validation, subForm, type} - translated properties to be used on the backend object.
 */
function setInput(
  form,
  placement,
  json,
  sugestions,
  validation,
  subForm,
  type,
  id
) {
  json.inputs.push({
    placement: placement,
    description: form.description,
    question: form.question,
    type: type,
    validation: validation,
    sugestions: sugestions,
    subForm: subForm ? subForm : null,
    id: id,
  });
}

/** Translates the 'options' array to the backend padronization.
 * @param sugestions - the 'options' property from the frontend object;
 */
function setSugestions(sugestions) {
  let tmp = [];
  if (!sugestions) return tmp;
  sugestions.forEach((value, index) => {
    tmp.push({
      value: value,
      placement: index,
    });
  });
  return tmp;
}

/** Sets the validation field to be sent to the backend.
 * @param form - the form[i] position of the array.
 */
function setValidation(form) {
  if (!form.validation[0].value && form.validation.length <= 1) return [];
  let val = [];
  if (form.type === 1) {
    val.push({
      type: 6,
      arguments: [],
    });
    return val;
  }

  if (form.validation[0].value) {
    val.push({
      type: 2,
      arguments: [],
    });
  }
  if (form.type === 0 && form.validation.length > 1) {
    val.push({
      type: form.validation[1].type,
      arguments: [form.validation[1].value],
    });
  }
  return val;
}
/** Set the subform as the backend padronization.
 * @param form - the form[i] position of the array.
 */
function setSubform(form) {
  if (form.type !== 4) return null;
  return {
    contentFormId: form.subformId,
  };
}

/** The function that triggers the 'translation'
 * @param form - the form[i] position of the array.
 */
export default async function createBackendForm(form) {
  let json = {
    id: form[0].id ? form[0].id : "",
    title: form[0].question,
    description: form[0].description,
    inputs: [],
    answerTimes: form[0].mult_answer,
  };
  for (var i = 1; i < form.length; i++) {
    setInput(
      form[i],
      i,
      json,
      setSugestions(form[i].options),
      setValidation(form[i]),
      setSubform(form[i], i),
      form[i].type,
      form[i].inputId
    );
  }
  return json;
}
