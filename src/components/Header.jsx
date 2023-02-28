import React from 'react';
import { Grid } from '@mui/material';
import Navbar from './Navbar';
import icone_cienciaCidada from '../assets/images/icon_cienciaCidada.svg';
import letreiro_cienciaCidada from '../assets/images/letreiro_cienciaCidada.svg';
import "./Header.css";

const Header = () => {
    return (
        <div>
        <p>OI</p>
        <Grid container className="header">
            <Grid container className="content-container">
                <Navbar />
                <img src={letreiro_cienciaCidada} alt="Name app" className="letreiro-CienciaCidada" width="141px" height="102px" />
                <img src={icone_cienciaCidada} alt="Ciencia na Escola icon" className="logo-CienciaCidada" width="117.87px" height="75.24px"/>
            </Grid>
        </Grid>
    </div>
   );
}

export default Header;