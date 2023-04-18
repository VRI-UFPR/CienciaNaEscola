import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Tooltip from "@material-ui/core/Tooltip";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { Draggable } from "react-beautiful-dnd";
import FieldFooterOptions from "./FieldFooterOptions";
import DefaultField from "./DefaultField";
import CloseIcon from "@material-ui/icons/Close";
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
  validationGrid: {
    marginBottom: "20px",
    marginLeft: "15%",
    ["@media (max-width:600px)"]: {
      marginLeft: "0px",
    },
  },
  errorGrid: {
    marginTop: "1%",
    color: "#ff4646",
    width: "80%",
    fontSize: "13px",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    ["@media (max-width:600px)"]: {
      flexDirection: "column",
      marginTop: "5%",
    },
  },
  selectFormating: {
    ["@media (max-width:430px)"]: {
      minWidth: "0px",
      width: "85%",
    },
    minWidth: "250px",
  },
  subformSelect: {
    ["@media (max-width:430px)"]: {
      width: "70%",
      fontSize: "76%",
    },
  },
  excludeFormating: {
    ["@media (max-width:1050px)"]: {
      marginLeft: "40%",
    },
  },
  excludeFormatingSmall: {
    ["@media (max-width:1050px)"]: {
      marginLeft: "10%",
    },
    ["@media (max-width: 600px)"]: {
      marginLeft: "50%",
    },
  },
}));
/** Main function that returns the content of the option 'question'. */
function FormFieldText(props) {
  /** Style class. */
  const classes = useStyles();
  /** Representation of the possible 'extra' validations to be used.
   * The types are equivalent to the backend.
   */
  const validationOpts = [
    { type: 3, name: "Máximo de caracteres", value: "" },
    { type: 4, name: "Mínimo de caracteres", value: "" },
  ];
  /** Importing functions to add, remove and set validations and it's properties. */
  const {
    setValidationType,
    setValidationValue,
    removeValidation,
    addValidation,
  } = useForm();
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
              <h4>Caixa de Texto</h4>
            </Grid>
            <Grid container>
              <DefaultField
                question={props.question}
                description={props.description}
                idq={props.idq}
                error={props.error}
              />
              <Grid item xs={12} sm={8} className={classes.questionsGrid}>
                <TextField
                  disabled
                  id="outlined-disabled"
                  label=""
                  defaultValue="Resposta curta"
                />
              </Grid>
              <Grid
                item
                container
                direction="row"
                justify="flex-end"
                alignItems="flex-end"
                xs={12}
                sm={4}
              >
                <FieldFooterOptions
                  idq={props.idq}
                  required={props.validation[0].value}
                />
              </Grid>
            </Grid>
            {props.validation.length > 1 ? (
              <FormControl variant="outlined" className={classes.row}>
                <Grid item xs={12} sm={5} className={classes.questionsGrid}>
                  <InputLabel
                    className={classes.subformSelect}
                    id="demo-simple-select-outlined-label"
                    htmlFor="outlined-subform-simple"
                  >
                    Selecione uma validação
                  </InputLabel>
                  <Select
                    className={classes.selectFormating}
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    onChange={(event) =>
                      setValidationType(event.target.value, props.idq)
                    }
                    value={props.validationType}
                    label="Selecione uma validação"
                    error={props.validationType ? false : true}
                  >
                    {validationOpts.map((x) => (
                      <MenuItem key={x.type} value={x.type}>
                        {x.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                {props.validationType ? (
                  <Grid item xs={12} className={classes.validationGrid}>
                    <TextField
                      label="Quantidade"
                      value={props.validationValue}
                      onChange={(event) =>
                        setValidationValue(event.target.value, props.idq)
                      }
                    />
                    <Grid className={classes.errorGrid}>
                      {props.error.errorMsg.validationValue}
                    </Grid>
                  </Grid>
                ) : null}
                <Grid
                  item
                  xs={1}
                  className={
                    props.validationType
                      ? classes.excludeFormatingSmall
                      : classes.excludeFormating
                  }
                >
                  <Tooltip
                    title="Remover a validação"
                    aria-label="Remover a validação"
                  >
                    <IconButton
                      aria-label="remove validation"
                      onClick={() => {
                        removeValidation(props.idq);
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </FormControl>
            ) : (
              <Grid
                item
                container
                direction="column"
                alignItems="center"
                xs={6}
              >
                <Tooltip
                  title="Adicionar uma validação para a resposta"
                  aria-label="Adicionar uma validação para a resposta"
                >
                  <IconButton
                    aria-label="adicionar opção"
                    onClick={() => {
                      addValidation(props.idq);
                    }}
                  >
                    <AddCircleIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            )}
          </Paper>
        );
      }}
    </Draggable>
  );
}

export default FormFieldText;
