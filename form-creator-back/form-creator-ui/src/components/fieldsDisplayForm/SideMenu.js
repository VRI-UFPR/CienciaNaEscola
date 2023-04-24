import React, { useState } from "react";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import ReorderIcon from "@material-ui/icons/Reorder";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core";
import ListAltIcon from "@material-ui/icons/ListAlt";
import TextFieldsIcon from "@material-ui/icons/TextFields";
import useForm from "../../contexts/useForm";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme) => ({
  addButton: {
    fontSize: "100%",
  },
  outerGrid: {
    flexDirection: "column",
    ["@media(max-width: 600px)"]: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    ["@media(max-width: 1050px)"]: {
      fontSize: "0",
      alignItems: "center",
    },
    alignItems: "flex-start",
  },
  paper: {
    ["@media (min-width: 600px)"]: {
      position: "fixed",
    },
    ["@media (min-width:600px)"]: {
      maxWidth: "190px",
    },
    ["@media(max-width: 1050px)"]: {
      ["@media(min-width: 600px)"]: {
        width: "85px",
      },
    },
    justifyContent: "flex-start",
  },
  newQuestionGrid: {
    marginTop: "5%",
  },
  flex: {},
  newQuestionGrid: {
    ["@media(max-width: 1050px)"]: {
      display: "none",
    },
  },
}));
function SideMenu(props) {
  const {
    addToFormQuestion,
    addToFormSelect,
    addToFormRadio,
    addToFormCheckbox,
    addToFormSubform,
  } = useForm();
  const classes = useStyles();
  const msg = {
    text: "Adicionar uma caixa de texto",
    susp: "Adicionar lista suspensa",
    uniq: "Adicionar seleção única",
    mult: "Adicionar múltipla escolha",
    sub: "Adicionar subformulário",
  };

  return (
    <Paper className={classes.paper}>
      <Grid item container className={classes.outerGrid}>
        <Grid className={classes.newQuestionGrid} container justify="center">
          <h4>Adicionar pergunta:</h4>
        </Grid>
        <Tooltip title={msg.text} aria-label={msg.text}>
          <IconButton
            aria-label="add question"
            type="submit"
            size="medium"
            className={classes.addButton}
            onClick={() => {
              addToFormQuestion();
            }}
          >
            <TextFieldsIcon />
            Caixa de Texto
          </IconButton>
        </Tooltip>
        <Tooltip title={msg.susp} aria-label={msg.susp}>
          <IconButton
            aria-label="add select"
            type="submit"
            size="medium"
            className={classes.addButton}
            onClick={() => {
              addToFormSelect();
            }}
          >
            <ReorderIcon />
            Lista Suspensa
          </IconButton>
        </Tooltip>
        <Tooltip title={msg.uniq} aria-label={msg.uniq}>
          <IconButton
            aria-label="add radio"
            type="submit"
            size="medium"
            className={classes.addButton}
            onClick={() => {
              addToFormRadio();
            }}
          >
            <RadioButtonCheckedIcon />
            Seleção Única
          </IconButton>
        </Tooltip>
        <Tooltip title={msg.mult} aria-label={msg.mult}>
          <IconButton
            aria-label="add checkbox"
            type="submit"
            size="medium"
            className={classes.addButton}
            onClick={() => {
              addToFormCheckbox();
            }}
          >
            <CheckBoxOutlineBlankIcon />
            Múltipla Escolha
          </IconButton>
        </Tooltip>
        <Tooltip title={msg.sub} aria-label={msg.sub}>
          <IconButton
            aria-label="add subform"
            type="submit"
            size="medium"
            className={classes.addButton}
            onClick={() => {
              addToFormSubform();
            }}
          >
            <ListAltIcon />
            Subformulário
          </IconButton>
        </Tooltip>
      </Grid>
    </Paper>
  );
}

export default SideMenu;
