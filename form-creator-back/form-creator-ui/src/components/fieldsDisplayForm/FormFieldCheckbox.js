import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CloseIcon from "@material-ui/icons/Close";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import Tooltip from "@material-ui/core/Tooltip";
import FieldFooterOptions from "./FieldFooterOptions";
import { Draggable } from "react-beautiful-dnd";
import DefaultField from "./DefaultField";
import useForm from "../../contexts/useForm";

/** CSS styles used on page components. */
const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
    width: theme.spacing(100),
    ["@media (max-width:1050px)"]: {
      width: theme.spacing(63),
      ["@media (max-width:849px)"]: {
        width: "85%",
      },
    },
    marginBottom: "2%",
    ["@media (min-width:600px)"]: {
      marginLeft: "4%",
    },
  },
  questionsGrid: {
    marginBottom: "20px",
  },
  errorGrid: {
    marginTop: "1%",
    color: "#ff4646",
    width: "40%",
    fontSize: "13px",
  },
  textFieldStyle: {
    width: "80%",
  },
  iconAdjustment: {
    marginTop: "17px",
  },
}));
/** Main function that returns the 'checkbox' field. */
function FormFieldCheckbox(props) {
  /** Style class. */
  const classes = useStyles();
  /** Importing functions to add, remove and set Options and its value. */
  const { setSelectOption, removeSelectOption, addSelectOption } = useForm();

  return (
    <Draggable key={props.id} draggableId={props.id} index={props.idq}>
      {(provided, snapshot) => {
        return (
          <Paper
            className={classes.paper}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Grid container item xs={12} justify="center">
              <h4>Múltipla Escolha</h4>
            </Grid>
            <Grid container>
              <DefaultField
                question={props.question}
                description={props.description}
                idq={props.idq}
                error={props.error}
              />
              <Grid
                item
                container
                direction="column"
                justify="flex-start"
                alignItems="flex-start"
                xs={12}
                sm={8}
                className={classes.questionsGrid}
              >
                {props.options.map((x, index) => {
                  return (
                    <Grid container>
                      <Grid
                        item
                        container
                        justify="center"
                        alignItems="center"
                        xs={1}
                        className={
                          props.error.errorMsg.options[index]
                            ? null
                            : classes.iconAdjustment
                        }
                      >
                        <CheckBoxOutlineBlankIcon />
                      </Grid>
                      <Grid item xs={8}>
                        <TextField
                          multiline
                          label={"Opção " + index}
                          value={x}
                          className={classes.textFieldStyle}
                          onChange={(e) =>
                            setSelectOption(e.target.value, props.idq, index)
                          }
                        />
                        <Grid
                          item
                          className={classes.errorGrid}
                          style={{ width: "100%" }}
                        >
                          {props.error.errorMsg.options[index]}
                        </Grid>
                      </Grid>
                      <Grid item xs={2}>
                        <Tooltip
                          title="Remover a opção"
                          aria-label="Remover a opção"
                        >
                          <IconButton
                            aria-label="remove option"
                            onClick={() => {
                              removeSelectOption(props.idq, index);
                            }}
                          >
                            <CloseIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  );
                })}
              </Grid>
              <Grid
                item
                className={classes.errorGrid}
                container
                direction="column"
                justify="flex-start"
                alignItems="flex-start"
                sm={4}
                xs={12}
              >
                {props.error.errorMsg.optionsNumber}
              </Grid>
              <Grid
                item
                container
                direction="column"
                alignItems="center"
                xs={6}
              >
                <Tooltip
                  title="Adicionar uma nova opção"
                  aria-label="Adicionar uma nova opção"
                >
                  <IconButton
                    aria-label="add option"
                    onClick={() => {
                      addSelectOption(props.idq);
                    }}
                  >
                    <AddCircleIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid
                item
                container
                direction="row"
                justify="flex-end"
                alignItems="flex-end"
                sm={6}
                xs={12}
              >
                <FieldFooterOptions
                  idq={props.idq}
                  required={props.validation[0].value}
                />
              </Grid>
            </Grid>
          </Paper>
        );
      }}
    </Draggable>
  );
}

export default FormFieldCheckbox;
