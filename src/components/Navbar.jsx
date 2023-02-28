//Navigation Bar Component
import Hamburguer_logo from "../assets/images/Hamburger_icon.svg";
import {React, useState } from "react";

import "./Navbar.css";

const Navbar = () => {
    const [active, setActive] = useState(false);
    const handleClick = () => {
        setActive(!active);
        console.log("OIII");
    };
    
    return (
        <div className="navbar" onClick={handleClick}>
            <img src={Hamburguer_logo} alt="logo" width="72px" height="45px"/>
        </div>
   );
}

export default Navbar;