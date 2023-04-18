import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ArrowDownwardOutlinedIcon from "@material-ui/icons/ArrowDownwardOutlined";
import Checkbox from "@material-ui/core/Checkbox";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(3),
    width: theme.spacing(100),
    marginBottom: "2%",
    ["@media (max-width: 896px)"]: {
      width: "300px"
    }
  },
  questionsGrid: {
    marginBottom: "20px"
  },
  text: {
    color: "black"
  },
  expPainelD: {
    display: "block"
  },
  type: {
    width: "50px"
  }
}));

function FormFieldCheckbox(props) {
  const classes = useStyles();

  /** HTML object to be displayed on component return. */
  const options = props.options.map((x, index) => {
    return props.answer[x.placement] ? (
      <Typography
        style={{ wordWrap: "break-word" }}
        gutterBottom
        className={classes.text}
      >
        Opção {x.value} foi marcada por {props.answer[x.placement]} pessoa(s).
      </Typography>
    ) : (
      <Typography style={{ wordWrap: "break-word" }} gutterBottom>
        Opção {x.value} não foi marcada.
      </Typography>
    );
  });

  return (
    <ExpansionPanel className={classes.paper}>
      <ExpansionPanelSummary expandIcon={<ArrowDownwardOutlinedIcon />}>
        <Grid item xs={12} className={classes.questionsGrid}>
          <Tooltip placement="left" title="Múltipla escolha" arrow>
            <Grid container className={classes.type}>
              <Checkbox disabled />
            </Grid>
          </Tooltip>
          <Typography
            style={{ wordWrap: "break-word" }}
            className={classes.text}
            variant="h6"
          >
            {props.question}
          </Typography>
          <Typography style={{ wordWrap: "break-word" }} variant="h8">
            {props.description}
          </Typography>
        </Grid>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.expPainelD}>
        <Grid
          item
          container
          direction="column"
          justify="flex-start"
          alignItems="flex-start"
          xs={5}
          className={classes.questionsGrid}
        >
          {options}
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

export default FormFieldCheckbox;
