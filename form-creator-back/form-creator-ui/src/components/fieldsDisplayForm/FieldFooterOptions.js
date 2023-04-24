import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import IconButton from "@material-ui/core/IconButton";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Tooltip from "@material-ui/core/Tooltip";
import useForm from "../../contexts/useForm";

/** Main function that return the component's 'footer' options, handling the required validation and deleting the field as necessary. */
function FieldFooterOptions(props) {
  /** Importing functions to set a question as required and to delete the question. */
  const { setRequiredField, deleteFromForm } = useForm();
  return (
    <Grid>
      {!props.subform && (
        <FormControlLabel
          control={
            <Tooltip
              title="Marcar como obrigatório"
              aria-label="Marcar como obrigatório"
            >
              <Switch
                onChange={(e) => setRequiredField(props.idq)}
                value="required"
                color="primary"
                checked={props.required}
              />
            </Tooltip>
          }
          style={{ size: "0px" }}
          label="Obrigatória"
        />
      )}
      <Tooltip title="Remover a pergunta" aria-label="Remover a pergunta">
        <IconButton
          aria-label="Remover a pergunta"
          onClick={() => {
            deleteFromForm(props.idq);
          }}
        >
          <DeleteOutlinedIcon />
        </IconButton>
      </Tooltip>
    </Grid>
  );
}

export default FieldFooterOptions;
