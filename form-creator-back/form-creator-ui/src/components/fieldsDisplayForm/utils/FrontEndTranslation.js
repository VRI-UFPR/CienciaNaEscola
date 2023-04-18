import {
  pushTitle,
  pushQuestion,
  pushSelect,
  pushRadio,
  pushCheckbox,
  pushSubform,
} from "./FormComposition";

/** Function that recieves the validation from the backend to  translate it to the frontend.
 * @param validaiton - the validation as it comes from the backend.
 */
function validationTranslate(validation) {
  let val = [{ type: "required", value: false }];
  if (!validation) return val;
  validation.forEach((opt) => {
    if (opt.type === 6) {
      val[0].value = true;
    } else if (opt.type === 2) {
      val[0].value = true;
    } else {
      val.push({ type: opt.type, value: opt.arguments[0] });
    }
  });
  return val;
}

/** Function that converts the backend form to an structure to be used on frontend.
 * @param formData - the backend data.
 */
export function createFrontendForm(formData) {
  let json = [];
  pushTitle(
    json,
    formData.title,
    formData.description,
    formData.id,
    formData.answerTimes
  );

  formData.inputs.forEach((option) => {
    switch (option.type) {
      case 0:
        pushQuestion(
          json,
          option.question,
          option.description,
          validationTranslate(option.validation),
          option.id
        );
        break;
      case 1:
        pushCheckbox(
          json,
          option.question,
          option.description,
          option.sugestions,
          validationTranslate(option.validation),
          option.id
        );
        break;
      case 2:
        pushRadio(
          json,
          option.question,
          option.description,
          option.sugestions,
          validationTranslate(option.validation),
          option.id
        );
        break;
      case 3:
        pushSelect(
          json,
          option.question,
          option.description,
          option.sugestions,
          validationTranslate(option.validation),
          option.id
        );
        break;
      case 4:
        pushSubform(
          json,
          option.question,
          option.description,
          option.subForm.contentFormId,
          validationTranslate(option.validation),
          option.id
        );
      default:
    }
  });
  return json;
}
