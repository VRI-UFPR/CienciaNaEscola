import uuid from "uuid/v4";

/** Function that pushes the title object into the form array.
 * @param form - the form where the field will be pushed;
 * @param title - the title;
 * @param description - the description of the form.
 */
export function pushTitle(form, title, description, id, answerTimes) {
  return form.push({
    type: "title",
    question: title ? title : "",
    description: description ? description : "",
    mult_answer: answerTimes,
    id: id ? id : "",
    error: {
      errorMsg: {
        question: title ? "" : "Este campo é obrigatório!",
        description: "",
      },
    },
  });
}
/** Function that pushes a 'question' object into the form array.
 * @param form - the form where the field will be pushed;
 * @param question - the question;
 * @param description - the description of the question;
 * @param validation - optional validation the question may have.
 */
export function pushQuestion(form, question, description, validation, id) {
  form.push({
    type: 0,
    validation: validation ? validation : [{ type: "required", value: false }],
    question: question ? question : "",
    description: description ? description : "",
    id: uuid(),
    inputId: id ? id : null,
    error: {
      errorMsg: {
        question: question ? "" : "Este campo é obrigatório!",
        description: "",
        validationValue: validation
          ? validation[1]
            ? validation[1].value
              ? ""
              : "Por favor, digite um número"
            : ""
          : "",
      },
    },
  });
}

/** Function that pushes a 'select' object into the form array.
 * @param form - the form where the field will be pushed;
 * @param question - the question;
 * @param description - the description of the question;
 * @param options - the options array;
 * @param validation - optional validation the question may have.
 */
export function pushSelect(
  form,
  question,
  description,
  options,
  validation,
  id
) {
  let value = {
    type: 3,
    question: question ? question : "",
    validation: validation ? validation : [{ type: "required", value: false }],
    options: options ? options.map((x) => x.value) : [""],
    description: description ? description : "",
    id: uuid(),
    inputId: id ? id : null,
    error: {
      errorMsg: {
        question: question ? "" : "Este campo é obrigatório!",
        description: "",
        optionsNumber: options
          ? options.length < 2
            ? "O campo precisa ter pelo menos duas opções!"
            : ""
          : "O campo precisa ter pelo menos duas opções!",
        options: options
          ? options.map((x) => (x = ""))
          : ["Por favor, preencha esta opção"],
      },
    },
  };
  return form.push(value);
}

/** Function that pushes a 'radio' object into the form array.
 * @param form - the form where the field will be pushed;
 * @param question - the question;
 * @param description - the description of the question;
 * @param options - the options array;
 * @param validation - optional validation the question may have.
 */
export function pushRadio(
  form,
  question,
  description,
  options,
  validation,
  id
) {
  let value = {
    type: 2,
    question: question ? question : "",
    validation: validation ? validation : [{ type: "required", value: false }],
    options: options ? options.map((x) => x.value) : [""],
    description: description ? description : "",
    id: uuid(),
    inputId: id ? id : null,
    error: {
      errorMsg: {
        question: question ? "" : "Este campo é obrigatório!",
        description: "",
        optionsNumber: options
          ? options.length < 2
            ? "O campo precisa ter pelo menos duas opções!"
            : ""
          : "O campo precisa ter pelo menos duas opções!",
        options: options
          ? options.map((x) => (x = ""))
          : ["Por favor, preencha esta opção"],
      },
    },
  };
  return form.push(value);
}

/** Function that pushes a 'checkbox' object into the form array.
 * @param form - the form where the field will be pushed;
 * @param question - the question;
 * @param description - the description of the question;
 * @param options - the options array;
 * @param validation - optional validation the question may have.
 */
export function pushCheckbox(
  form,
  question,
  description,
  options,
  validation,
  id
) {
  let value = {
    type: 1,
    question: question ? question : "",
    validation: validation ? validation : [{ type: "required", value: false }],
    options: options ? options.map((x) => x.value) : [""],
    description: description ? description : "",
    id: uuid(),
    inputId: id ? id : null,
    error: {
      errorMsg: {
        question: question ? "" : "Este campo é obrigatório!",
        description: "",
        optionsNumber: options
          ? options.length < 2
            ? "O campo precisa ter pelo menos duas opções!"
            : ""
          : "O campo precisa ter pelo menos duas opções!",
        options: options
          ? options.map((x) => (x = ""))
          : ["Por favor, preencha esta opção"],
      },
    },
  };
  return form.push(value);
}
/** Function that pushes a 'select' object into the form array.
 * @param form - the form where the field will be pushed;
 * @param question - the question;
 * @param description - the description of the question;
 * @param subformId - id of the form being used as a subform;
 * @param validation - optional validation the question may have.
 */
export function pushSubform(
  form,
  question,
  description,
  subformId,
  validation,
  id
) {
  return form.push({
    type: 4,
    validation: validation ? validation : [{ type: "required", value: false }],
    question: question ? question : "",
    description: description ? description : "",
    subformId: subformId,
    id: uuid(),
    inputId: id ? id : null,
    error: {
      errorMsg: {
        subformUsage: "",
      },
    },
  });
}
