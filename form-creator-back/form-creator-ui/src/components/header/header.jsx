import React, { useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { useHistory } from "react-router-dom";
import logo from "./header_imgs/imgsimmc-01.png";
import { makeStyles } from "@material-ui/core";
import LogoutButton from "./header_components/LogoutButton";

const useStyles = makeStyles((theme) => ({
  header: {
    background: "#05a5dd",
    width: "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height: "13%",
  },
  simmc: {
    marginTop: "5%",
    fontSize: "15px",
    color: "#ffffff",
    marginLeft: "2%",
    ["@media (max-width:1040px)"]: {
      display: "none",
    },
  },
  form_creator: {
    color: "#ffffff",
    marginTop: "10%",
    ["@media (max-width:599px)"]: {
      fontSize: "21px",
      ["@media (max-width:525px)"]: {
        marginTop: "5%",
        marginLeft: "10%",
      },
      ["@media (max-width:337px)"]: {
        fontSize: "19px",
      },
    },
  },
  link: {
    textDecoration: "none",
  },
  logo: {
    marginLeft: "2.5%",
    marginTop: "4%",
    width: "85px",
    ["@media (max-width:600px)"]: {
      width: "65px",
      ["@media (max-width:338px)"]: {
        marginTop: "3%",
      },
    },
  },
  userImgContainer: {
    display: "flex",
    flexDirection: "column",
  },
}));

export default function Header() {
  const classes = useStyles();
  const [isLoged, setIsLoged] = React.useState(false);
  const history = useHistory();

  function checkLoged() {
    if (window.sessionStorage.getItem("token")) {
      return true;
    }

    return false;
  }
  useEffect(() => {
    setIsLoged(checkLoged);
  }, [window.sessionStorage.getItem("token")]);

  return (
    <Grid>
      <header className={classes.header} alignItems="center ">
        <Grid container item>
          <Grid container item xs={3} sm={3} md={4}>
            <a
              href="https://simmc.c3sl.ufpr.br/"
              title="Ir para a página inicial do SIMMC"
            >
              <img
                src={logo}
                alt="logo"
                href="localhost3000/#/signup"
                className={classes.logo}
                maxWidth="100px"
              />
            </a>
            <Grid
              container
              item
              xs={5}
              sm={6}
              md={7}
              alignContent="flexstart"
              alignItems="start"
            >
              <a
                href="https://simmc.c3sl.ufpr.br/"
                title="Ir para a página inicial do SIMMC"
                className={classes.link}
              >
                <h2 className={classes.simmc}>
                  Sistema Integrado de Monitoramento do Ministério da Ciência,
                  Tecnologia, Inovações e Comunicações
                </h2>
              </a>
            </Grid>
          </Grid>
          <Grid container item xs={6} sm={6} md={4} justify="center">
            <a
              href="https://genforms.c3sl.ufpr.br/"
              title="Home"
              className={classes.link}
            >
              <h2 className={classes.form_creator}>
                Gerador de Formulários
              </h2>
            </a>
          </Grid>
          <Grid
            container
            item
            xs={3}
            sm={3}
            md={4}
            className={classes.userImgContainer}
            justify="center"
            alignContent="flex-end"
          >
            {isLoged && (
              <LogoutButton isLoged={isLoged} checkLoged={checkLoged} />
            )}
          </Grid>
        </Grid>
      </header>
    </Grid>
  );
}
