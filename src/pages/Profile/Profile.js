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

const Profile = () => {
  const token = useSelector((state) => state.auth.token)
  const dispatch = useDispatch()

  const { isLoading: deletingAccount, sendRequest: deleteAccount } = useHttp()

  const deleteAccountHandler = async () => {
    const response = await deleteAccount({
      url: "/users",
      method: "DELETE",
      token,
    })

    if (!response) return

    dispatch({ type: "RESET" })
    NotificationManager.success(response.message, "Success!", 2000)
  }

  return (
    <AuthPageWrapper className={classes.wrapper}>
      <ProfileButton />
      <Spinner loading={deletingAccount} />
      <h1 className={classes.header}>Profile settings</h1>
      <hr />
      <CollapsingContent title="Delete Account" contentClass={classes.collapse}>
        <p className={classes.warning}>Account will be deleted permanently!</p>
        <Button
          className={classes.deleteAccountButton}
          onClick={deleteAccountHandler}
        >
          Delete My Account
        </Button>
      </CollapsingContent>
    </AuthPageWrapper>
  )
}

export default Profile
