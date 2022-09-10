import React from "react"
import logoIcon from "../../images/logo.svg"
import Card from "../../components/Card/Card"
import classes from "./Login.module.css"
import { Link } from "react-router-dom"
import LoginForm from "../../components/LoginForm/LoginForm"

const Login = () => {
  return (
    <Card className={classes.card}>
      <div className={classes.header}>
        <img src={logoIcon} alt="logo" />
        <p>Login to your account</p>
      </div>
      <LoginForm />
      <div className={classes.footer}>
        <p>
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </div>
    </Card>
  )
}

export default Login
