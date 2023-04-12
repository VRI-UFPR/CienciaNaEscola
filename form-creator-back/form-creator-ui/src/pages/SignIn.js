import React from "react";
import { useHistory, Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import FormInput from "../components/fieldsSignUp/FormInput";
import Paper from "@material-ui/core/Paper";
import api from "../api";

const useStyles = makeStyles(theme => ({
  register: {
    maxWidth: "1000px",
    background: "#ffffff",
    borderRadius: "2px",
    padding: "2% 1%",
    margin: "0 auto",
    marginTop: "9%",
    width: "95%"
  },
  custom_strong: {
    fontSize: "25px",
    textAlign: "center",
    display: "block",
    color: "#46525d"
  },
  strong_description: {
    fontSize: "14px",
    color: "#c2c6ca"
  },
  form: {
    marginTop: "3%",
    alignItems: "center",
    textAlign: "center"
  },
  noAcc: {
    marginTop: "10px"
  },
  button: {
    type: "submit",
    width: "30%",
    marginTop: "4%",
    background: "#6ec46c",
    borderRadius: "2px",
    padding: "10px 20px",
    fontSize: "18px",
    "&:hover": {
      backgroundColor: "rgb(25, 109, 23)"
    },
    ["@media (max-width:550px)"]: {
      width: "55%"
    }
  }
}));
export default function SignIn() {
  const classes = useStyles();
  const history = useHistory();
  const [isLoged, setIsLoged] = React.useState(
    window.sessionStorage.getItem("token")
  );
  const [values, setValues] = React.useState({
    email: "",
    password: "",
    emailError: false
  });
  async function update(prop, event) {
    await setValues({ ...values, [prop]: event.target.value });
  }

  const handleChange = prop => event => {
    if (!checkEmail()) {
      values.emailError = true;
    } else {
      values.emailError = false;
    }
    update(prop, event);
  };
  function checkEmail() {
    return values.email
      ? /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(values.email)
        ? true
        : false
      : true;
  }
  function verifyValues() {
    if (values.email && values.password) {
      return true;
    }
    return false;
  }
  function verifyValuesContent() {
    if (!checkEmail()) {
      alert(
        "Falha de autenticação. Certifique-se que email e senha estão corretos."
      );
      return false;
    }
    return true;
  }
  async function handleSubmit() {
    const response = await api
      .post(`/user/signIn`, {
        email: values.email,
        hash: values.password
      })
      .then(function (response) {
        if (!response.data.error) {
          window.sessionStorage.setItem("token", response.data.token);
          window.sessionStorage.setItem("userId", response.data.id);
          let path = `list/${response.data.id}`;
          history.push(path);
        }
      })
      .catch(function (error) {
        if (error.response) {
          alert(
            "Falha de autenticação. Certifique-se que email e senha estão corretos."
          );
        }
      });
  }
  function submit() {
    if (verifyValues()) {
      if (verifyValuesContent()) {
        handleSubmit();
      }
    }
  }
  const theme = createMuiTheme({
    overrides: {
      root: {
        color: "white"
      },
      MuiInput: {
        underline: {
          "&:before": {
            borderBottom: "1px solid #35c7fc"
          },
          "&:after": {
            borderBottom: "1px solid #3f51b5"
          }
        }
      }
    }
  });
  return isLoged ? (
    <Redirect to={`/list/${window.sessionStorage.getItem("userId")}`} />
  ) : (
      <MuiThemeProvider theme={theme}>
        <Paper className={classes.register} justify="center">
          <strong className={classes.custom_strong}>
            Login de Usuário
          <p className={classes.strong_description}>
              Insira as informações abaixo
          </p>
          </strong>
          <form className={classes.form} autocomplete="off">
            <Grid>
              <FormInput
                label="E-mail"
                param="email"
                onUpdate={handleChange}
                error={!checkEmail()}
              />
            </Grid>
            <Grid>
              <FormInput label="Senha" param="password" onUpdate={handleChange} />
            </Grid>
            <Grid className={classes.noAcc}>
              <Link to="/signup">
                Não é cadastrado?
            </Link>
            </Grid>
            <Grid>
              <IconButton
                size="medium"
                className={classes.button}
                id="whiteTextedButton"
                onClick={() => submit()}
              >
                <KeyboardArrowRightIcon />
                Conecte-se
            </IconButton>
            </Grid>
          </form>
        </Paper>
      </MuiThemeProvider>
    );
}
