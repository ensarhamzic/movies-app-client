import React from "react"
import { NavLink } from "react-router-dom"
import Logo from "../Logo/Logo"
import classes from "./Navbar.module.css"

const Navbar = () => {
  return (
    <div className={classes.navbar}>
      <Logo />
      <div className={classes.actions}>
        <NavLink
          className={(nav) => (nav.isActive ? classes.active : "")}
          to="/login"
        >
          Login
        </NavLink>
        <NavLink
          className={(nav) => (nav.isActive ? classes.active : "")}
          to="/register"
        >
          Register
        </NavLink>
      </div>
    </div>
  )
}

export default Navbar
