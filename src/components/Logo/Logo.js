import logoImg from "../../images/logo.svg"
import classes from "./Logo.module.css"

import React from "react"

const Logo = ({ className }) => {
  return (
    <div className={`${classes.logo} ${className || ""}`}>
      <span>movlib</span>
      <img src={logoImg} alt="logo" />
    </div>
  )
}

export default Logo
