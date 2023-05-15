import React, { useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { Redirect, useParams } from "react-router-dom";
import { Button, createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import FormInput from "../components/fieldsSignUp/FormInput";
import Paper from "@material-ui/core/Paper";
import api from "../api";

const useStyles = makeStyles((theme) => ({
  register: {
    maxWidth: "1000px",
    background: "#ffffff",
    borderRadius: "2px",
    padding: "2% 1%",
    marginTop: "3%",
    ["@media (max-width:590px)"]: {
      marginTop: "20%",
    },
    margin: "0 auto",
    width: "95%",
  },
  custom_strong: {
    fontSize: "25px",
    ["@media (max-width:590px)"]: {
      fontSize: "17px",
    },
    textAlign: "center",
    display: "block",
    color: "#46525d",
    marginBottom: "4%",
    marginTop: "3%",
  },
  button: {
    type: "submit",
    // width: "30%",
    marginTop: "4%",
    background: "#0480ab",
    color: "white",
    borderRadius: "2px",
    padding: "10px 20px",
    // fontSize: "18px",
    "&:hover": {
      backgroundColor: "#045d7b",
    },
    ["@media (max-width:550px)"]: {
      width: "55%",
      fontSize: "60%",
    },
  },
}));
export default function SignUp() {
  const history = useHistory();
  const classes = useStyles();
  const { again } = useParams();
  console.log(again);
  again > 0 ? console.log("É ZERO") : console.log("Não dá");

  const handleClick = () => {
    let path = `/answer/${again}`;
    history.push(path);
  };
  return (
    <Paper className={classes.register} justify="center">
      <strong className={classes.custom_strong}>
        Sua resposta foi registrada em nossa base de dados. <br></br>
        Agradecemos pela sua participação.<br></br>
        {again > 0 ? (
          <Button className={classes.button} onClick={() => handleClick()}>
            Responda novamente o formulário
          </Button>
        ) : null}
      </strong>
    </Paper>
  );
}
