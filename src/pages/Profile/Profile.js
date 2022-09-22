import React from "react"
import AuthPageWrapper from "../../components/AuthPageWrapper/AuthPageWrapper"
import ProfileButton from "../../components/ProfileButton/ProfileButton"
import classes from "./Profile.module.css"

const Profile = () => {
  return (
    <AuthPageWrapper className={classes.wrapper}>
      <ProfileButton />
      <h1 className={classes.header}>Profile settings</h1>
      <hr />
    </AuthPageWrapper>
  )
}

export default Profile
