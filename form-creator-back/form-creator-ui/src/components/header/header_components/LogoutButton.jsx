import React from "react";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  menuPopUp: {
    alignContent: "start",
    ["@media (max-width:346px)"]: {
      width: "23%",
    },
  },
  menuList: {
    alignItems: "flex-start",
    color: "grey",
  },
  button: {
    marginRight: "10px",
    fontSize: 14,
    width: "80px",
    backgroundColor: "#0480ab",
    color: "white",
    ["@media (max-width: 600px)"]: {
      width: "60px",
      fontSize: 12,
    },
  },
}));

/**
 * Para fazer com que o componente não apareça em telas em que o usuário não está logado, basta fazer uma função de verificação para tal e retornar o componente,
 * caso logado, ou NULL, caso não-logado.
 */

function LogoutButton(props) {
  const [open, setOpen] = React.useState(false);
  const history = useHistory();

  const handleLogOut = (event) => {
    window.sessionStorage.removeItem("token");
    window.sessionStorage.removeItem("userId");
    props.checkLoged();
    let path = `/signin`;
    history.push(path);
  };

  const classes = useStyles();

  return (
    <div>
      <Button
        className={classes.button}
        id="notWhiteButton"
        aria-haspopup="true"
        onClick={handleLogOut}
        variant="contained"
      >
        LogOut
      </Button>
    </div>
  );
}

export default LogoutButton;
