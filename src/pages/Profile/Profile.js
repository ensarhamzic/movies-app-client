import React from "react"
import AuthPageWrapper from "../../components/AuthPageWrapper/AuthPageWrapper"
import ProfileButton from "../../components/ProfileButton/ProfileButton"
import classes from "./Profile.module.css"
import CollapsingContent from "../../components/CollapsingContent/CollapsingContent"
import Button from "../../components/Button/Button"
import { useSelector, useDispatch } from "react-redux"
import Spinner from "../../components/Spinner/Spinner"
import NotificationManager from "react-notifications/lib/NotificationManager"
import useHttp from "../../hooks/use-http"
import Input from "../../components/Input/Input"
import { useEffect } from "react"
import useInput from "../../hooks/use-input"
import Form from "../../components/Form/Form"
import { authActions } from "../../store/auth-slice"

const validatePassword = (password) => {
  if (password.trim().length < 8) return "Must be at least 8 characters long"
  return null
}

const validateName = (name) => {
  if (name.trim().length === 0) return "Must not be empty"
  return null
}

const Profile = () => {
  const token = useSelector((state) => state.auth.token)
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()
  const { value: passwordValue, onChange: onPasswordChange } = useInput()
  const {
    value: currentPassword,
    onChange: onCurrentPasswordChange,
    error: currentPasswordError,
    setValue: setCurrentPassword,
  } = useInput(validatePassword)
  const {
    value: newPassword,
    onChange: onNewPasswordChange,
    error: newPasswordError,
    setValue: setNewPassword,
  } = useInput(validatePassword)
  const {
    value: repeatPassword,
    onChange: onRepeatPasswordChange,
    error: repeatPasswordError,
    setValue: setRepeatPassword,
  } = useInput(validatePassword)

  const {
    error: deleteAccountError,
    isLoading: deletingAccount,
    sendRequest: deleteAccount,
  } = useHttp()

  const {
    value: firstName,
    onChange: onFirstNameChange,
    error: firstNameError,
    setValue: setFirstName,
  } = useInput(validateName)
  const {
    value: lastName,
    onChange: onLastNameChange,
    error: lastNameError,
    setValue: setLastName,
  } = useInput(validateName)

  const {
    error: changeNameError,
    isLoading: changingName,
    sendRequest: changeName,
  } = useHttp()

  const currentUserFirstName = user.firstName
  const currentUserLastName = user.lastName

  useEffect(() => {
    setFirstName(currentUserFirstName)
    setLastName(currentUserLastName)
  }, [currentUserFirstName, currentUserLastName, setFirstName, setLastName])

  const {
    error: changePasswordError,
    isLoading: changingPassword,
    sendRequest: changePassword,
  } = useHttp()

  const deleteAccountHandler = async () => {
    const response = await deleteAccount({
      url: "/users",
      method: "DELETE",
      data: {
        password: passwordValue,
      },
      token,
    })
    if (!response) return
    dispatch({ type: "RESET" })
    NotificationManager.success(response.message, "Success!", 2000)
  }

  useEffect(() => {
    deleteAccountError &&
      NotificationManager.error(deleteAccountError, "Error!", 2000)
  }, [deleteAccountError])

  const displayChangePasswordErrors = () => {
    let errors = false
    if (currentPasswordError) {
      NotificationManager.error(currentPasswordError, "Password Error!", 2000)
      errors = true
    }
    if (newPasswordError) {
      NotificationManager.error(newPasswordError, "New Password Error!", 2000)
      errors = true
    }
    if (repeatPasswordError) {
      NotificationManager.error(
        repeatPasswordError,
        "Repeat Password Error!, 2000"
      )
      errors = true
    }
    if (newPassword !== repeatPassword) {
      NotificationManager.error("Passwords must match", "Password Error!", 2000)
      errors = true
    }

    return errors
  }

  const changePasswordHandler = async () => {
    if (displayChangePasswordErrors()) return

    const data = {
      currentPassword: currentPassword.trim(),
      newPassword: newPassword.trim(),
      repeatPassword: repeatPassword.trim(),
    }

    const response = await changePassword({
      url: "/users/password",
      method: "PATCH",
      data,
      token,
    })

    if (!response) return

    NotificationManager.success(response.message, "Success!", 2000)
    setCurrentPassword("")
    setNewPassword("")
    setRepeatPassword("")
  }

  useEffect(() => {
    changePasswordError &&
      NotificationManager.error(changePasswordError, "Error!", 2000)
  }, [changePasswordError])

  const displayChangeNameErrors = () => {
    let errors = false
    if (firstNameError) {
      NotificationManager.error(firstNameError, "First Name Error!", 2000)
      errors = true
    }
    if (lastNameError) {
      NotificationManager.error(lastNameError, "Last Name Error!", 2000)
      errors = true
    }

    return errors
  }

  const changeNameHandler = async () => {
    if (displayChangeNameErrors()) return

    const data = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    }

    const response = await changeName({
      url: "/users/name",
      method: "PATCH",
      data,
      token,
    })

    if (!response) return

    NotificationManager.success(response.message, "Success!", 2000)
    dispatch(authActions.changeName({ firstName, lastName }))
  }

  useEffect(() => {
    changeNameError &&
      NotificationManager.error(changeNameError, "Error!", 2000)
  }, [changeNameError])

  return (
    <AuthPageWrapper className={classes.wrapper}>
      <ProfileButton />
      <Spinner loading={deletingAccount || changingPassword || changingName} />
      <h1 className={classes.header}>Profile settings</h1>
      <hr />

      <CollapsingContent
        title="Change Name"
        contentClass={classes.changeNameContent}
      >
        <Form onSubmit={changeNameHandler}>
          <Input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={onFirstNameChange}
          />
          <Input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={onLastNameChange}
          />

          <Button type="submit">Change Name</Button>
        </Form>
      </CollapsingContent>

      <CollapsingContent
        title="Change Password"
        contentClass={classes.changePasswordContent}
      >
        <Form onSubmit={changePasswordHandler}>
          <Input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={onCurrentPasswordChange}
          />
          <Input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={onNewPasswordChange}
          />
          <Input
            type="password"
            placeholder="Repeat New Password"
            value={repeatPassword}
            onChange={onRepeatPasswordChange}
          />
          <Button type="submit">Change Password</Button>
        </Form>
      </CollapsingContent>

      <CollapsingContent title="Delete Account">
        <p className={classes.warning}>Account will be deleted permanently!</p>
        <div className={classes.deleteContent}>
          <Input
            type="password"
            placeholder="Password"
            onChange={onPasswordChange}
            value={passwordValue}
          />
          <Button
            className={classes.deleteAccountButton}
            onClick={deleteAccountHandler}
          >
            Delete My Account
          </Button>
        </div>
      </CollapsingContent>
    </AuthPageWrapper>
  )
}

export default Profile
