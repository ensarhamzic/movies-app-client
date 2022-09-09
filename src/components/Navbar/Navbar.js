import React from "react"
import { Link } from "react-router-dom"
import Button from "../Button/Button"
import Logo from "../Logo/Logo"
import classes from "./Navbar.module.css"

const Navbar = () => {
  return (
    <div className={classes.navbar}>
      <Logo />
      <div className={classes.actions}>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </div>
  )
}

export default Navbar
