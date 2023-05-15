import React, { useState, useEffect } from "react";
import api from "../api";
import { useParams } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";

// Components
import CardForm from "../components/fieldsListForms/CardForm.jsx";
import Tab from "../components/fieldsListForms/Tab.jsx";
import { Typography } from "@material-ui/core";
const useStyles = makeStyles(theme => ({
  body: {
    marginBottom: "15%"
  },

  progress: {
    marginTop: "5%"
  },

  Forms: {
    textAlign: "center",
    marginBottom: "3%",
    fontSize: "20px"
  }
}));
export default function ListForms() {
  const classes = useStyles();
  const history = useHistory();

  // Get the ID from the URL
  const { id } = useParams();

  // Hooks
  const [forms, setForms] = React.useState([]);
  const [isLoaded, setisLoaded] = React.useState(false);
  const [auxForms, setAuxForms] = React.useState([]);

  /**
   * Sorting function to sort the forms by some especified type.
   * @param type - the type of the sorting that was selected.
   */
  function sort(type) {
    setAuxForms([]);
    if (type === "") {
      const tmp = [...forms].sort(function (a, b) {
        return a.id > b.id ? 1 : -1;
      });
      setAuxForms(tmp);
    } else if (type === 1) {
      const tmp = [...forms].sort((a, b) => {
        return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
      });
      setAuxForms(tmp);
    } else if (type === 2) {
      const tmp = [...forms].sort(function (a, b) {
        return a.id < b.id ? 1 : -1;
      });
      setAuxForms(tmp);
    } else if (type === 3) {
      const tmp = [...forms].sort(function (a, b) {
        return a.answersNumber < b.answersNumber ? 1 : -1;
      });
      setAuxForms(tmp);
    } else if (type === 4) {
      let tmp = [...forms]
        .filter(value => {
          return value.date;
        })
        .sort((a, b) => a.date > b.date)
        .concat(
          [...forms].filter(value => {
            return value.date === "";
          })
        );
      setAuxForms(tmp);
    }
  }

  /**
   * Function to search for a form title.
   * @param string - the string value to be searched.
   */
  function searching(string) {
    setAuxForms(
      [...forms].filter(value => {
        return value.title.toLowerCase().includes(string.toLowerCase());
      })
    );
  }

  /**
   * Async function to get all of the forms from an user.
   * @param id - the user's id to have the forms listed.
   */
  async function fetchData(id) {
    const res = await api
      .get(`/user/list/${id}`)
      .then(function (res) {
        setForms(res.data.sort((a, b) => a.id > b.id));
        setAuxForms(res.data.sort((a, b) => a.id > b.id));
        setisLoaded(true);
      })
      .catch(error => {
        if (error.response.status === 401) {
          window.sessionStorage.removeItem("token");
          window.sessionStorage.removeItem("userId");
          let path = `/signin`;
          history.push(path);
          return;
        }
      });
  }

  useEffect(() => {
    fetchData(id);
  }, []);

  return isLoaded ? (
    <>
      <div>
        <Tab sort={sort} searching={searching} />
        <Container>
          <Grid className={classes.Forms}>Seus Formulários:</Grid>
          <Grid container justify="center" spacing={3} className={classes.body}>
            {auxForms.length ? (
              auxForms.map(form => (
                <Grid item xl={4} lg={4} md={4} sm={6} xs={12} zeroMinWidth>
                  <CardForm
                    id={form.id}
                    title={form.title}
                    description={form.description}
                    numberOfAnswers={form.answersNumber}
                    date={form.date}
                  />
                </Grid>
              ))
            ) : (
                <Grid item>
                  <Typography variant="h4">
                    Nenhum formulário foi encontrado
                </Typography>
                </Grid>
              )}
          </Grid>
        </Container>
      </div>
    </>
  ) : (
      <Grid container justify="center" className={classes.progress}>
        <CircularProgress />
      </Grid>
    );
}
