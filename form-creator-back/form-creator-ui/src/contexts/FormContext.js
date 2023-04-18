import React, { useState, createContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { createFrontendForm } from "../components/fieldsDisplayForm/utils/FrontEndTranslation";
import { useHistory } from "react-router-dom";
export const FormEditionContext = createContext();

const FormProvider = (props) => {
  const history = useHistory();
  /** Getting the id from the route information */
  const { id } = useParams();
  /** Form state being started with the title in the case of the creation or 0 when editing (to be overrided by the backend data afterwards)
   *  it's an array where each position stands for a question selected by the user. */
  const [form, setForm] = useState(
    id
      ? 0
      : [
          {
            type: "title",
            question: "",
            description: "",
            mult_answer: false,
            error: {
              errorMsg: {
                question: "Este campo é obrigatório!",
                description: "",
              },
            },
          },
        ]
  );

  /** Hook to access the API in the case a edition is being done */
  useEffect(() => {
    const fetchData = async () => {
      api
        .get(`/form/${id}`)
        .then(async function (res) {
          setForm(await createFrontendForm(res.data));
        })
        .catch((error) => {
          if (error.response.status === 401) {
            window.sessionStorage.removeItem("token");
            window.sessionStorage.removeItem("userId");
            let path = `/signin`;
            history.push(path);
            return;
          }
        });
    };
    if (id) fetchData();
  }, []);
  return (
    <FormEditionContext.Provider
      value={{ formState: [form, setForm], idValue: id }}
    >
      {props.children}
    </FormEditionContext.Provider>
  );
};

export default FormProvider;
