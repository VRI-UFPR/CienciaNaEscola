import React, { useState, useEffect } from "react";
import Divider from "@material-ui/core/Divider";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
// Icons
import MoreVertOutlinedIcon from "@material-ui/icons/MoreVertOutlined";
import DeleteButton from "./DeleteButton";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import ShareButton from "./ShareButton";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import QuestionAnswerOutlinedIcon from "@material-ui/icons/QuestionAnswerOutlined";

const useStyles = makeStyles(theme => ({
  title: {
    fontSize: 20,
    flex: 1,
    width: 0,
    textAlign: "center",
    color: "#667079"
  },

  description: {
    alignSelf: "center"
  },

  container: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    color: "#667079"
  },

  item: {
    margin: "5px"
  },

  expPainelD: {
    display: "block"
  },

  date: {
    fontSize: 16,
    textAlign: "center",
    color: "#667079"
  },

  create: {
    fontSize: 13,
    textAlign: "center",
    color: "#667079"
  },

  icons: {
    marginLeft: "20%",
    ["@media (max-width: 370px)"]: {
      marginLeft: "10%"
    }
  },

  numberOfAnswers: {
    fontSize: 18,
    textAlign: "center",
    margin: "7px"
  }
}));

function CardForm(props) {
  const classes = useStyles();
  const history = useHistory();

  const handleAnswer = () => {
    //redirecionar para /answer/props.id
    if (props.numberOfAnswers) {
      let path = `/form/${props.id}`;
      history.push(path);
    } else {
      alert("Não há respostas nesse form.");
    }
  };

  const handleVisualize = () => {
    //redirecionar para /visual/props.id
    let path = `/visualize/${props.id}`;
    history.push(path);
  };

  const handleEdit = () => {
    //redirecionar para /edit/props.id
    let path = `/edit/${props.id}`;
    history.push(path);
  };

  function handleDelete(value) {
    if (value) {
      // deleteForm();
    }
  }

  async function deleteForm() {
    // const res = await api
  }

  function manageDate(date) {
    if (date === "") {
      return "";
    }

    let newDate = new Date(date);
    let options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return newDate.toLocaleDateString("pt-BR", options);
  }

  return (
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<MoreVertOutlinedIcon />}>
        <Typography noWrap className={classes.title}>
          {props.title}
          <br />
          <div className={classes.create}>{props.description}</div>
          <Divider />
          <div className={classes.numberOfAnswers}>
            {props.numberOfAnswers} Respostas
          </div>
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.expPainelD}>
        <Typography className={classes.date}>
          {props.date ? "Data de modificação: " + manageDate(props.date) : ""}
        </Typography>
        <Tooltip className={classes.icons} title="Editar" arrow>
          <IconButton onClick={handleEdit}>
            <EditOutlinedIcon />
          </IconButton>
        </Tooltip>

        <ShareButton id={props.id} />

        <Tooltip title="Visualizar" arrow>
          <IconButton aria-label="visualize" onClick={handleVisualize}>
            <VisibilityOutlinedIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Respostas" arrow>
          <IconButton aria-label="delete" onClick={handleAnswer}>
            <QuestionAnswerOutlinedIcon />
          </IconButton>
        </Tooltip>

        {/*<DeleteButton handleDelete={handleDelete} />*/}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

export default CardForm;
