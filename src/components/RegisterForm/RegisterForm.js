import React, { useState, useEffect } from "react"
import classes from "./RegisterForm.module.css"
import Form from "../Form/Form"
import Spinner from "../Spinner/Spinner"
import Input from "../Input/Input"
import Button from "../Button/Button"
import useInput from "../../hooks/use-input"
import useHttp from "../../hooks/use-http"
import NotificationManager from "react-notifications/lib/NotificationManager"
import { authActions } from "../../store/auth-slice"
import { useDispatch } from "react-redux"
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
const validateName = (name) => {
  if (name.length >= 3 && name.length <= 30) return null
  if (name.length === 0) return "Name field is required"
  return "Name must be between 3 and 30 characters long"
}

const RegisterForm = () => {
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
  const {
    value: confirmPasswordValue,
    onChange: onConfirmPasswordChange,
    error: confirmPasswordError,
  } = useInput(validatePassword)
  const {
    value: firstNameValue,
    onChange: onFirstNameChange,
    error: firstNameError,
  } = useInput(validateName)
  const {
    value: lastNameValue,
    onChange: onLastNameChange,
    error: lastNameError,
  } = useInput(validateName)

  const formValid =
    !firstNameError &&
    !lastNameError &&
    !emailError &&
    !passwordError &&
    !confirmPasswordError &&
    passwordValue === confirmPasswordValue

  const [formSubmitted, setFormSubmitted] = useState(false)
  const { isLoading, error, sendRequest: register } = useHttp()

  const formSubmitHandler = async () => {
    setFormSubmitted(true)
    if (!formValid) {
      showValidationError()
      return
    }

    const data = {
      firstName: firstNameValue,
      lastName: lastNameValue,
      email: emailValue,
      confirmPassword: confirmPasswordValue,
      password: passwordValue,
    }

    const response = await register({
      url: "/users/register",
      method: "POST",
      data,
    })

    setFormSubmitted(false)
    if (!response) return

    dispatch(authActions.login({ token: response.token, user: response.user }))
    navigate("/library", { replace: true })
    NotificationManager.success("Successfully registered", "Registered", 2000)
  }

  useEffect(() => {
    if (error) {
      NotificationManager.error(error, "Error!", 2000)
    }
  }, [error])

  const showValidationError = () => {
    const duration = 2000
    firstNameError &&
      NotificationManager.error(firstNameError, "First Name error!", duration)
    lastNameError &&
      NotificationManager.error(lastNameError, "Last Name error!", duration)
    emailError &&
      NotificationManager.error(emailError, "Email error!", duration)
    passwordError &&
      NotificationManager.error(passwordError, "Password error!", duration)
    confirmPasswordError &&
      NotificationManager.error(
        confirmPasswordError,
        "Confirm Password error!",
        duration
      )
    passwordValue !== confirmPasswordValue &&
      NotificationManager.error(
        "Passwords must match",
        "Validation error!",
        duration
      )
  }

  return (
    <Form onSubmit={formSubmitHandler} className={classes.form}>
      <Spinner loading={isLoading} />
      <div className={classes.inputGroup}>
        <Input
          type="text"
          placeholder="First name"
          value={firstNameValue}
          onChange={onFirstNameChange}
          error={firstNameError}
          submitted={formSubmitted}
          disabled={isLoading}
        />
        <Input
          type="text"
          placeholder="Last name"
          value={lastNameValue}
          onChange={onLastNameChange}
          error={lastNameError}
          submitted={formSubmitted}
          disabled={isLoading}
        />
      </div>
      <Input
        type="text"
        placeholder="Email"
        value={emailValue}
        onChange={onEmailChange}
        error={emailError}
        submitted={formSubmitted}
        disabled={isLoading}
      />
      <div className={classes.inputGroup}>
        <Input
          type="password"
          placeholder="Password"
          value={passwordValue}
          onChange={onPasswordChange}
          error={passwordError}
          submitted={formSubmitted}
          disabled={isLoading}
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirmPasswordValue}
          onChange={onConfirmPasswordChange}
          error={confirmPasswordError}
          submitted={formSubmitted}
          disabled={isLoading}
        />
      </div>
      <Button className={classes.submitBtn} type="submit" disabled={isLoading}>
        Register
      </Button>
    </Form>
  )
}

export default RegisterForm
