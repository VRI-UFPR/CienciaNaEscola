import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Logo from "./c3sl.png";

const useStyles = makeStyles(theme => ({
  footer: {
    background: "#66a6c2",
    left: 0,
    position: "fixed",
    bottom: 0,
    right: 0,
    width: "100%",
    height: "78px"
  },

  img: {
    width: "50px",
    display: "block",
    marginTop: "auto",
    marginBottom: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    ["@media (min-width: 960px)"]: {
      marginLeft: "5px"
    }
  },

  item: {
    display: "flex",
    justifyContent: "space-evenly",
    flexDirection: "column"
  },

  link: {
    textDecoration: "none"
  },

  text: {
    color: "#46525d",
    fontSize: "15px",
    textAlign: "center",
    left: "50%",
    ["@media (max-width: 960px)"]: {
      display: "none"
    }
  },

  adress: {
    display: "block",
    marginTop: "auto",
    marginBottom: "auto",
    marginLeft: "auto",
    paddingRight: "10px",

    color: "#46525d",
    fontSize: "12px",
    textAlign: "right",
    ["@media (max-width: 960px)"]: {
      display: "none"
    }
  }
}));

function Footer() {
  const classes = useStyles();
  return (
    <Grid container className={classes.footer}>
      <Grid item xs={12} sm={12} md={3} lg={2} className={classes.item}>
        <a
          href="https://www.c3sl.ufpr.br/"
          title="Ir para a página inicial do C3SL"
          className={classes.link}
        >
          <img src={Logo} className={classes.img} />
        </a>
      </Grid>

      <Grid item md={6} lg={8} className={classes.item}>
        <Typography className={classes.text}>
          Ministério da
          <b>
            <br />
            Ciência, Tecnologia,
            <br />
            Inovações e Comunicações
          </b>
        </Typography>
      </Grid>

      <Grid item md={3} lg={2} className={classes.item}>
        <Typography className={classes.adress}>
          Esplanada dos Ministérios, Bloco R
          <br />
          CEP: 70044-900 – Brasília-DF
          <br />
          Telefone: 61 2027-6000
        </Typography>
      </Grid>
    </Grid>
  );
}

export default Footer;
