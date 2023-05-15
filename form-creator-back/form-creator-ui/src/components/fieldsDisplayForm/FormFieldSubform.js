import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import api from "../../api";
import FieldFooterOptions from "./FieldFooterOptions";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
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
  subformSelect: {
    width: "90%",
  },
  errorGrid: {
    marginTop: "1%",
    color: "#ff4646",
    width: "40%",
    fontSize: "13px",
  },
  errorGridSubform: {
    color: "#ff4646",
    marginTop: "2%",
    width: "100%",
    fontSize: "13px",
  },
  textFieldStyle: {
    width: "80%",
  },
  textFieldDescriptionStyle: {
    width: "96%",
    ["@media (max-width: 600px)"]: {
      width: "80%",
    },
  },
  footerOptsAdjustment: {
    ["@media (min-width: 600px)"]: {
      marginBottom: "3%",
    },
  },
}));

/** Function that returns the component to select te subform to be used. */
function SubformSelect(props) {
  /** Style class. */
  const classes = useStyles();
  /** Importing function to save the chosen form id as a subform. */
  const { setSubformId } = useForm();
  /** Functions that handle the input changes to save it at the father component. */
  const handleChange = (event) => {
    setSubformId(event.target.value, props.idq);
  };
  return (
    <FormControl variant="outlined" className={classes.subformSelect}>
      <InputLabel
        className={classes.subformSelect}
        id="demo-simple-select-outlined-label"
        htmlFor="outlined-subform-simple"
      >
        Selecione um formulário
      </InputLabel>
      <Select
        labelId="demo-simple-select-outlined-label"
        id="demo-simple-select-outlined"
        value={props.subformId}
        onChange={handleChange}
        label="Selecione um subformulário"
        style={{ width: "100%" }}
        error={props.subformId ? false : true}
      >
        {props.array.length > 0 ? (
          props.array.map((form) => (
            <MenuItem key={form.id} value={form.id}>
              {form.title}
            </MenuItem>
          ))
        ) : (
          <MenuItem key={0} value={0} disabled>
            {"Você não tem formulários para usar aqui"}
          </MenuItem>
        )}
      </Select>
    </FormControl>
  );
}
/** Main function that returns the 'subform' field. */
export default function FormFieldSubform(props) {
  /** Style class. */
  const classes = useStyles();
  /** State to store the subform options the user can use. */
  const [forms, setForms] = React.useState([]);
  /** UseEffect to make an api call and list the forms the current user has to be used as subform. */
  useEffect(() => {
    const fetchData = async () => {
      var forms_response = await api
        .get(`/user/list/${window.sessionStorage.getItem("userId")}`, {})
        .then((response) => {
          setForms(response.data);
        });
    };
    fetchData();
  }, []);
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
            <Grid container>
              <Grid container item>
                <Grid container item xs={12} justify="center">
                  <h4>Subformulário</h4>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6} className={classes.questionsGrid}>
                <SubformSelect
                  array={forms}
                  setSubformId={props.setSubformId}
                  idq={props.idq}
                  error={props.error}
                  subformId={props.subformId}
                />
              </Grid>
              <Grid item sm={2} xs={12} className={classes.errorGridSubform}>
                {props.error.errorMsg.subformUsage}
              </Grid>
              <Grid
                item
                container
                direction="row"
                justify="flex-end"
                alignItems="flex-end"
                xs={12}
                sm={4}
                className={classes.footerOptsAdjustment}
              >
                <FieldFooterOptions
                  subform={true}
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
