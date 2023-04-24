import * as Yup from "yup";
/** The validation through Yup is schema based, so there are schemas and it's validations. */

/**Function that compares the value with a regex, to assure the input is valid */
function checkText(value) {
  return /^[A-Za-z!?$%,. 1234567890àèìòùáéíóúâêîôûãõç]+$/.test(value);
}
/** Function that applies the validation of it's used schema and sets the error messages. */
export async function testQuestionTextSchema(error, value) {
  value
    ? (error.errorMsg.question = "")
    : (error.errorMsg.question = "Este campo é obrigatório!");
}
/** Function that applies the validation of it's used schema and sets the error messages. */
export async function testDescriptionTextSchema(error, value) {
  value
    ? checkText(value)
      ? (error.errorMsg.description = "")
      : (error.errorMsg.description = "O caractere não é permitido")
    : (error.errorMsg.description = "");
}
/** Schema to validate the number of options at options field from FormFieldSelect, FormFieldCheckbox and FormFieldRadio. */
const selectOptionsSchema = Yup.array()
  .of(Yup.string())
  .test("minimo 2", "O campo precisa ter pelo menos duas opções!", (value) => {
    if (value.length < 2) return false;
    else return true;
  });
/** Function that applies the validation of it's used schema and sets the error messages. */
export async function selectOptionsTesting(form, index) {
  await selectOptionsSchema
    .validate(form[index].options)
    .then((x) => {
      form[index].error.errorMsg.optionsNumber = "";
    })
    .catch((err) => {
      form[index].error.errorMsg.optionsNumber = err.message;
    });
}
/** Schema to validate the subform field from FormFieldSubform. */
const subformSchema = Yup.array().test(
  "repetition",
  "Este formulário já está sendo usado!",
  (form) => {
    for (let i = 1; i < form.length; i++) {
      if (form[i].type === "subForm") {
        for (let j = i + 1; j < form.length; j++) {
          if (
            form[j].type === "subForm" &&
            form[j].subformId === form[i].subformId
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }
);
/** Function that applies the validation of it's used schema and sets the error messages. */
export async function testSubformSchema(form, index) {
  await subformSchema
    .validate(form)
    .then((x) => {
      form[index].error.errorMsg.subformUsage = "";
    })
    .catch((err) => {
      form[index].error.errorMsg.subformUsage = err.message;
    });
}
/** Function that applies the validation of it's used schema and sets the error messages. */
export async function selectOptionTextTesting(error, value, idopt) {
  value
    ? (error.errorMsg.options[idopt] = "")
    : (error.errorMsg.options[idopt] = "Por favor, preencha esta opção");
}
/** Schema to validate the quantity field of the validation from FormFieldText. */
const textValidationSchema = Yup.string()
  .required("Por favor, digite um número")
  .test("numeric", "Digite um número válido", (value) => {
    return /^\d+$/.test(value);
  });
/** Function that applies the validation of it's used schema and sets the error messages. */
export async function testTextValidation(form, index, value) {
  await textValidationSchema
    .validate(value)
    .then((x) => {
      form[index].error.errorMsg.validationValue = "";
    })
    .catch((err) => (form[index].error.errorMsg.validationValue = err.message));
}
/** Functions that verify if the form array can be sent to the backend. */
export function verifyError(form) {
  if (!form || form.length < 2) return false;
  let valid = true;
  form.map(function (x) {
    if (x.error.errorMsg.question || x.error.errorMsg.description) {
      valid = false;
      return;
    }
    if (x.type === 0) {
      if (x.error.errorMsg.validationValue) {
        valid = false;
        return;
      }
    }
    if (x.type === 4) {
      if (x.error.errorMsg.subformUsage || !x.subformId) {
        valid = false;
        return;
      }
    }
    if (x.type === 1 || x.type === 2 || x.type === 3) {
      if (x.error.errorMsg.optionsNumber) valid = false;
      x.error.errorMsg.options.forEach((y) => {
        if (y) {
          valid = false;
        }
      });
      return;
    }
  });
  return valid;
}
