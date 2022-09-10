import React from "react"
import classes from "./Register.module.css"
import Card from "../../components/Card/Card"
import logoIcon from "../../images/logo.svg"
import { Link } from "react-router-dom"
import RegisterForm from "../../components/RegisterForm/RegisterForm"

const Register = () => {
  return (
    <Card className={classes.card}>
      <div className={classes.header}>
        <img src={logoIcon} alt="logo" />
        <p>Sign up for movlib</p>
      </div>
      <RegisterForm />
      <div className={classes.footer}>
        <p>
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </Card>
  )
}

export default Register
