import React, { useState } from "react"
import logoIcon from "../../images/logo.svg"
import Card from "../../components/Card/Card"
import Input from "../../components/Input/Input"
import classes from "./Login.module.css"
import Button from "../../components/Button/Button"
import { Link } from "react-router-dom"
import Form from "../../components/Form/Form"
import useInput from "../../hooks/use-input"
import { NotificationManager } from "react-notifications"

const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const validateEmail = (email) => {
  if (email.match(emailRegex)) return null
  if (email.length === 0) return "Email field is required"
  return "Incorrect email syntax"
}
const validatePassword = (password) => {
  if (password.length >= 8) return null
  if (password.length === 0) return "Password field is required"
  return "Password must be at least 8 characters long"
}

const Login = () => {
  const {
    value: emailValue,
    onChange: onEmailChange,
    error: emailError,
  } = useInput(validateEmail, "")
  const {
    value: passwordValue,
    onChange: onPasswordChange,
    error: passwordError,
  } = useInput(validatePassword, "")

  const [formSubmitted, setFormSubmitted] = useState(false)

  const formValid = !emailError && !passwordError

  const formSubmitHandler = () => {
    setFormSubmitted(true)
    if (!formValid) {
      showNotification()
      return
    }
  }

  const showNotification = () => {
    let errorMessage = ""
    if (emailError) {
      errorMessage += emailError
    }
    if (passwordError) {
      errorMessage += "\n" + passwordError
    }
    if (errorMessage) {
      NotificationManager.error(errorMessage, "Error!", 3000)
    }
  }

  return (
    <Card className={classes.card}>
      <div className={classes.header}>
        <img src={logoIcon} alt="logo" />
        <p>Login to your account</p>
      </div>
      <Form onSubmit={formSubmitHandler}>
        <Input
          type="text"
          placeholder="Email"
          value={emailValue}
          onChange={onEmailChange}
          error={emailError}
          submitted={formSubmitted}
        />
        <Input
          type="password"
          placeholder="Password"
          value={passwordValue}
          onChange={onPasswordChange}
          error={passwordError}
          submitted={formSubmitted}
        />
        <Button className={classes.submitBtn} type="submit" content="Sign In" />
      </Form>
      <div className={classes.footer}>
        <p>
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </div>
    </Card>
  )
}

export default Login
