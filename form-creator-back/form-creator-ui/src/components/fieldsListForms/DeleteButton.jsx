import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import IconButton from "@material-ui/core/IconButton";
import DialogActions from "@material-ui/core/DialogActions";
import Tooltip from "@material-ui/core/Tooltip";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useTheme } from "@material-ui/core/styles";

import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles(theme => ({
  buttonNo: {
    color: "red"
  },
  buttonYes: {
    color: "blue"
  }
}));

function DeleteButton(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCloseFalse = () => {
    setOpen(false);
    props.handleDelete(false);
  };

  const handleCloseTrue = () => {
    setOpen(false);
    props.handleDelete(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="Deletar" arrow>
        <IconButton aria-label="delete" onClick={handleClickOpen}>
          <DeleteOutlineOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Tem certeza que deseja deletar este formulário?"}
        </DialogTitle>
        <DialogActions>
          <Button autoFocus onClick={handleCloseFalse} className={classes.buttonYes} color="primary">
            Não deletar
          </Button>
          <Button onClick={handleCloseTrue} className={classes.buttonNo} autoFocus>
            Deletar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default DeleteButton;