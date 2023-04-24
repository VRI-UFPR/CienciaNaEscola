import React from "react";
import Dialog from "@material-ui/core/Dialog";
import ShareOutlinedIcon from "@material-ui/icons/ShareOutlined";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Grid from "@material-ui/core/Grid";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useTheme } from "@material-ui/core/styles";

function ShareButton(props) {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="Compartilhar" arrow>
        <IconButton onClick={handleClickOpen}>
          <ShareOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {
            "Aqui está a URL do seu formulário, copie-a e envie-a para ser respondido: "
          }
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            https://genforms.c3sl.ufpr.br/#/answer/{props.id}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ShareButton;
