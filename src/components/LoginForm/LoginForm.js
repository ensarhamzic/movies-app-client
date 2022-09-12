import React, { useState, useEffect } from "react"
import classes from "./LoginForm.module.css"
import Form from "../Form/Form"
import Input from "../Input/Input"
import Spinner from "../Spinner/Spinner"
import Button from "../Button/Button"
import { useDispatch } from "react-redux"
import useInput from "../../hooks/use-input"
import useHttp from "../../hooks/use-http"
import NotificationManager from "react-notifications/lib/NotificationManager"
import { authActions } from "../../store/auth-slice"
import { useNavigate } from "react-router-dom"

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

const LoginForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {
    value: emailValue,
    onChange: onEmailChange,
    error: emailError,
  } = useInput(validateEmail)
  const {
    value: passwordValue,
    onChange: onPasswordChange,
    error: passwordError,
  } = useInput(validatePassword)

  const { isLoading, error, sendRequest: login } = useHttp()

  const [formSubmitted, setFormSubmitted] = useState(false)

  const formValid = !emailError && !passwordError

  const formSubmitHandler = async () => {
    setFormSubmitted(true)
    if (!formValid) {
      showValidationError()
      return
    }

    const data = {
      email: emailValue,
      password: passwordValue,
    }

    const response = await login({
      url: "/users/login",
      method: "POST",
      data,
    })

    setFormSubmitted(false)
    if (!response) return

    dispatch(authActions.login({ token: response.token, user: response.user }))
    navigate("/library", { replace: true })
    NotificationManager.success("Successfully logged in", "Logged in", 2000)
  }

  useEffect(() => {
    if (error) {
      NotificationManager.error(error, "Error!", 2000)
    }
  }, [error])

  const showValidationError = () => {
    const duration = 2000
    emailError &&
      NotificationManager.error(emailError, "Email Error!", duration)
    passwordError &&
      NotificationManager.error(passwordError, "Password Error!", duration)
  }
  return (
    <Form onSubmit={formSubmitHandler} className={classes.form}>
      <Spinner loading={isLoading} />
      <Input
        type="text"
        placeholder="Email"
        value={emailValue}
        onChange={onEmailChange}
        error={emailError}
        submitted={formSubmitted}
        disabled={isLoading}
      />
      <Input
        type="password"
        placeholder="Password"
        value={passwordValue}
        onChange={onPasswordChange}
        error={passwordError}
        submitted={formSubmitted}
        disabled={isLoading}
      />
      <Button className={classes.submitBtn} type="submit" disabled={isLoading}>
        Sign In
      </Button>
    </Form>
  )
}

export default LoginForm
