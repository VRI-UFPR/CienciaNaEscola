import React, { useState, useEffect } from "react";
import { useParams, Redirect, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import api from "../api";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormHelperText from "@material-ui/core/FormHelperText";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Jornal from "../components/fieldsGetForm/JornalFolder/FormJornal";
import Summary from "../components/fieldsGetForm/SummaryFolder/FormSummary";
const useStyles = makeStyles(theme => ({
  menu: {
    width: theme.spacing(6),
    minheight: theme.spacing(15),
    position: "fixed",
    top: theme.spacing(10),
    left: "90%",
    padding: theme.spacing(1)
  },
  progress: {
    marginTop: "5%"
  },
  selector: {
    width: "100%",
    borderRadius: "2px",
    padding: "10px 20px"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    ["@media (max-width: 738px)"]: {
      marginBottom: "20px",
      marginLeft: "225px"
    },
    ["@media (max-width: 460px)"]: {
      marginLeft: "20px"
    }
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white"
  },
  answerNum: {
    display: "flex",
    alignItems: "center",
    marginLeft: "20px",
    ["@media (max-width: 654px)"]: {
      marginBottom: "10px",
      marginLeft: "225px"
    },
    ["@media (max-width: 460px)"]: {
      marginLeft: "20px"
    }
  },
  button: {
    marginBottom: "15%",
    backgroundColor: "#d3d609",
    minWidth: "92px",
    width: "12%",
    ["@media (max-width:580px)"]: {
      marginBottom: "40%"
    }
  },
  formTitle: {
    textAlign: "center",
    marginTop: "10px",
    width: "450px",
    ["@media (max-width: 738px)"]: {
      marginBottom: "20px",
      marginRight: "50px"
    },
    ["@media (max-width: 654px)"]: {
      marginBottom: "10px",
      marginLeft: "100px"
    },
    ["@media (max-width: 460px)"]: {
      marginLeft: "20px"
    }
  }
}));

function GetForm() {
  const classes = useStyles();
  const history = useHistory();
  /** Form id got from the browser's URL */
  const { id } = useParams();

  /** Maped form from backend */
  const [formArray, setFormArray] = useState([]);

  const [answers, setAnswers] = useState([]);
  const [answerNum, setAnswerNum] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [times, setTimes] = useState([]);
  const [toLogin, setToLogin] = useState(false);
  const [multAnswer, setMultAnswer] = useState();

  const GoBack = () => {
    if (window.confirm("Tem certeza que deseja sair?")) {
      let path = "/signin";
      history.push(path);
    }
  };
  /**
   * Set selectedValue variable to the right value.
   */
  const handleChange = event => {
    setSelectedValue(event.target.value);
  };

  /**
   * Function to get form object from the API.
   * @param id - Form id got from the broswer's URL
   */
  async function getForm(id) {
    const res = await api
      .get(`/answer/${id}`, {
        headers: {
          authorization: `bearer ${window.sessionStorage.getItem("token")}`
        }
      })
      .then(function (res) {
        if (!res.data.length) {
          alert("Não há respostas!");
          setToLogin(true);
          return;
        }
        setFormArray(res.data);
        setMultAnswer(res.data[0].form.answerTimes)
        res.data.map(value => {
          answers.push(value.inputAnswers);
          times.push(value.timestamp);
        });
        getAnswerNumber(id);
      })
      .catch(error => {
        if (error.response.status === 401) {
          window.sessionStorage.removeItem("token");
          window.sessionStorage.removeItem("userId");
          setToLogin(true);
          return;
        }

        if (error.response.status === 500) {
          if (error.response.data.error === "User dont own this form.") {
            alert("Você não é o dono deste formulário.");
          } else {
            alert("Ocorreu um erro inesperado. Tente novamente mais tarde.");
          }
        }
        return;
      });
  }

  /**
   * Gets the number of answers from a form.
   * @param id - Form's id.
   */
  async function getAnswerNumber(id) {
    const res = await api
      .get(`/answerNumber/${id}`)
      .then(function (res) {
        setAnswerNum(res.data.answerNumber);
      })
      .catch(error => {
        if (error.response.status === 401) {
          window.sessionStorage.removeItem("token");
          window.sessionStorage.removeItem("userId");
          let path = `/signin`;
          history.push(path);
          return;
        }
        alert("Um erro inesperado ocorreu. Contate os desenvolvedores");
      });
    setIsReady(true);
  }

  /** First thing the page does is getting the form from the API. */
  useEffect(() => {
    getForm(id);
  }, []);

  return toLogin ? (
    <Redirect to="/signin" />
  ) : isReady ? (
    <Grid container className={classes.container}>
      <Grid item className={classes.answerNum}>
        <Typography style={{ wordWrap: "break-word" }} variant="h5">
          {answerNum + " Respostas"}
        </Typography>
      </Grid>
      <Grid item className={classes.formTitle}>
        <Typography style={{ wordWrap: "break-word" }} variant="h4">
          {formArray[0].form.title}
        </Typography>
      </Grid>
      <Grid item>
        <FormControl className={classes.formControl}>
          <Select
            value={selectedValue}
            onChange={handleChange}
            displayEmpty
            className={classes.selector}
            inputProps={{ "aria-label": "Without label" }}
          >
            <MenuItem value="">
              <em>Jornal</em>
            </MenuItem>
            <MenuItem value={1}>Resumo</MenuItem>
          </Select>
          <FormHelperText>Visualização</FormHelperText>
        </FormControl>
      </Grid>
      <Grid container item>
        {selectedValue ? (
          <Summary multAnswer={multAnswer} formArray={formArray} answers={answers} />
        ) : (
            <Jornal
              multAnswer={multAnswer}
              formArray={formArray}
              timestamp={times}
              answerNumber={answerNum}
            />
          )}
      </Grid>
      <Grid container justify="center">
        <Button variant="contained" className={classes.button} onClick={GoBack}>
          Voltar
        </Button>
      </Grid>
    </Grid>
  ) : (
        <Grid container justify="center" className={classes.progress}>
          <CircularProgress />
        </Grid>
      );
}

export default GetForm;
