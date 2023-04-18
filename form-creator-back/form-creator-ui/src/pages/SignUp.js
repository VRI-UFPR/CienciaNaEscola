import React, { useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { Redirect, Link } from "react-router-dom";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";
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
    margin: "0 auto",
    width: "95%",
  },
  custom_strong: {
    fontSize: "25px",
    textAlign: "center",
    display: "block",
    color: "#46525d",
  },
  strong_description: {
    fontSize: "14px",
    color: "#c2c6ca",
  },
  form: {
    alignItems: "center",
    textAlign: "center",
  },
  alreadyAcc: {
    marginTop: "10px",
  },
  button: {
    type: "submit",
    width: "30%",
    marginTop: "4%",
    marginBottom: "10%",
    background: "#6ec46c",
    borderRadius: "2px",
    padding: "10px 20px",
    fontSize: "18px",
    "&:hover": {
      backgroundColor: "rgb(25, 109, 23)",
    },
    ["@media (max-width:550px)"]: {
      width: "55%",
    },
  },
  errorGridOpts: {
    marginTop: "1%",
    color: "#ff4646",
    width: "100%",
    fontSize: "13px",
  },
}));
export default function SignUp() {
  const history = useHistory();
  const classes = useStyles();
  const [isLoged, setIsLoged] = React.useState(
    window.sessionStorage.getItem("token")
  );
  const [values, setValues] = React.useState({
    name: "",
    email: "",
    password: "",
    password_confirm: "",
    nameError: false,
    emailError: false,
  });
  useEffect(() => {
    !checkName() ? (values.nameError = true) : (values.nameError = false);
  }, [values.name]);
  useEffect(() => {
    !checkEmail() ? (values.emailError = true) : (values.emailError = false);
  }, [values.email]);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  function checkPassword() {
    if (values.password !== values.password_confirm) {
      alert("As senhas não conferem");
      return false;
    }
    return true;
  }
  function checkName() {
    return values.name
      ? /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/.test(values.name) &&
        values.name.length <= 225
        ? true
        : false
      : true;
  }

  function checkEmail() {
    return values.email
      ? /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(values.email)
        ? true
        : false
      : true;
  }

  function checkPasswordString() {
    return values.password
      ? /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&+_ ():;/?\|"'-])[A-Za-z\d@$!%*?&+_ ():;/\|"'-]{8,24}$/.test(
        values.password
      )
      : true;
  }

  function verifyValues() {
    if (
      values.name &&
      values.email &&
      values.password &&
      values.password_confirm
    ) {
      if (verifyValuesContent()) {
        return true;
      } else return false;
    }
    return false;
  }
  // Ficou com essa configuração porque as funções para verificar nome e email são chamadas em 'tempo real' para deixar o campo em vermelho.
  function verifyValuesContent() {
    if (!checkName()) {
      alert("Nome inválido");
      return false;
    } else if (!checkEmail()) {
      alert("Email invalido");
      return false;
    } else if (!checkPassword()) {
      alert("Verifique se sua senha satisfaz as condições mencionadas");
      return false;
    } else if (!checkPasswordString()) {
      return false;
    } else return true;
  }
  async function handleSubmit() {
    const response = await api
      .post(`/user/signUp`, {
        email: values.email,
        name: values.name,
        hash: values.password,
      })
      .then(function (error) {
        if (!error.response) {
          let path = `signin`;
          history.push(path);
        }
      })
      .catch(function (error) {
        if (error.response) {
          switch (error.response.data.error) {
            case 'duplicate key value violates unique constraint "form_user_name_key"':
              alert("Você já tem uma conta.");
              break;
            case "Email exists on the database.":
              alert("Email já cadastrado");
              break;
            case "data and salt arguments required":
              alert(
                "Ocorreu um erro com sua senha. Tente novamente em alguns minutos ou tente mudá-la"
              );
            default:
              alert("Um erro ocorreu. Tente novamente mais tarde.");
          }
          return;
        }
      });
  }
  function submit() {
    if (verifyValues()) {
      handleSubmit();
    }
  }

  const theme = createMuiTheme({
    overrides: {
      root: {
        color: "white",
      },
      MuiInput: {
        underline: {
          "&:before": {
            borderBottom: "1px solid #35c7fc",
          },
          "&:after": {
            borderBottom: "1px solid #3f51b5",
          },
        },
      },
    },
  });
  let msg =
    "Sua senha deve conter entre 8 e 24 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere dentre @$!%*?&+_ ():;/|\"'-";
  return isLoged ? (
    <Redirect to="/signin" />
  ) : (
      <MuiThemeProvider theme={theme}>
        <Paper className={classes.register} justify="center">
          <strong className={classes.custom_strong}>
            Cadastro de Usuário
          <p className={classes.strong_description}>
              Insira as informações abaixo
          </p>
          </strong>
          <form className={classes.form} autocomplete="off">
            <Grid>
              <FormInput
                label="Nome Completo"
                param="name"
                onUpdate={handleChange}
                error={!checkName()}
              />
            </Grid>
            <Grid>
              <FormInput
                label="E-mail"
                param="email"
                onUpdate={handleChange}
                error={!checkEmail()}
              />
            </Grid>
            <Grid>
              <FormInput
                label="Senha"
                param="password"
                onUpdate={handleChange}
                error={!checkPasswordString()}
              />
              {(!checkPasswordString() || !values.password) && (
                <Grid className={classes.errorGridOpts}>
                  Sua senha deve conter entre 8 e 24 caracteres, uma letra
                  maiúscula, uma minúscula, um número e um caractere dentre
                  @$!%*?+_ ():;/?\|"'-
              </Grid>
              )}
            </Grid>
            <Grid>
              <FormInput
                label="Confirmar Senha"
                param="password_confirm"
                onUpdate={handleChange}
                error={
                  values.password_confirm
                    ? values.password === values.password_confirm
                      ? false
                      : true
                    : false
                }
              />
            </Grid>
            <Grid className={classes.alreadyAcc}>
              <Link to="/signin">
                Já é cadastrado?
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
                Cadastre-se
            </IconButton>
            </Grid>
          </form>
        </Paper>
      </MuiThemeProvider>
    );
}
