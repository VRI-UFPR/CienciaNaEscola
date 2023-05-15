import React from "react";
import DisplayForm from "../components/fieldsDisplayForm/DisplayForm";
import FormProvider from "../contexts/FormContext";
/** External component that wraps the display page into the form context. */
export default function EditForm() {
  return (
    <FormProvider>
      <DisplayForm />
    </FormProvider>
  );
}
