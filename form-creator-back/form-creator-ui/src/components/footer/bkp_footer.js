import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Logo from "./c3sl.png";

const useStyles = makeStyles(theme => ({
  footer: {
    background: "#66a6c2",
    position: "fixed",
    left: 0,
    bottom: 0,
    right: 0,
    width: "100%",
    height: "78px"
  },

  img: {
    width: "50px",
    marginTop: "5px",
    marginBottom: "5px",
    justifyCenter: "center"
    ["@media (min-width:1200px)"]: {
        marginLeft: "15px",
    },
    ["@media (max-width:1200px)"]: {
        marginLeft: "50%",
        width: "50px",
        justifyCenter: "center"
    }
  },

  item: {
    marginTop: "5px",
    marginBottom: "5px",
    display: "flex",
    justifyContent: "space-evenly",
    flexDirection: "column",
    ["@media (max-width:525px)"]: {
      width: "50px",
      ["@media (max-width:338px)"]: {
        marginTop: "3%"
      }
    },
    ["@media (max-height:681px)"]: {
      width: "65px"
    },
    ["@media (max-width:1040px)"]: {
        justifyCenter: "center"
    }
  },

  text: {
    color: "#46525d",
    fontSize: "15px",
    textAlign: "center",
    ["@media (max-width:1200px)"]: {
        display:"none"
    }
  },

  adress: {
    color: "#46525d",
    fontSize: "12px",
    textAlign: "right",
    marginRight: "15px",
    ["@media (max-width:1200px)"]: {
        display:"none"
    }
  }
}));

function Footer() {
  const classes = useStyles();
  return (
    <Grid container className={classes.footer}>
      <Grid item xs={12} md={2} lg={2} className={classes.item}>
        <img src={Logo} className={classes.img}></img>
      </Grid>

      <Grid item md={8} lg={8} className={classes.item}>
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

      <Grid item md={2} lg={2} className={classes.item}>
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
