import React, { useEffect, useState } from "react"
import classes from "./AddCollection.module.css"
import useInput from "../../hooks/use-input"
import Input from "../../components/Input/Input"
import Button from "../../components/Button/Button"
import Form from "../../components/Form/Form"
import useHttp from "../../hooks/use-http"
import Spinner from "../../components/Spinner/Spinner"
import NotificationManager from "react-notifications/lib/NotificationManager"
import { useSelector } from "react-redux"

const validateCollectionName = (name) => {
  if (name.length >= 1 && name.length <= 50) return null
  if (name.length === 0) return "Collection Name field is required"
  return "Collection name must be between 1 and 50 characters long"
}

const AddCollection = () => {
  const {
    value: titleValue,
    onChange: onTitleChange,
    error: titleError,
    setValue: setTitleValue,
  } = useInput(validateCollectionName)

  const token = useSelector((state) => state.auth.token)

  const [formSubmitted, setFormSubmitted] = useState(false)

  const { isLoading, error, sendRequest: addCollection } = useHttp()

  const addCollectionHandler = async () => {
    setFormSubmitted(true)
    if (titleError) {
      NotificationManager.error(titleError, "Title error!", 2000)
      return
    }

    const data = {
      name: titleValue,
    }

    const response = await addCollection({
      url: "/collections",
      method: "POST",
      data,
      token,
    })

    setFormSubmitted(false)
    if (!response) return

    setTitleValue("")
    NotificationManager.success("Collection added!", "Success", 3000)
  }

  useEffect(() => {
    if (error) {
      NotificationManager.error(error, "Error!", 2000)
    }
  }, [error])

  return (
    <div className={classes.wrapper}>
      <h1 className={classes.header}>Add Collection</h1>
      <hr />
      <p className={classes.newCollectionText}>Create New Collection</p>
      <label className={classes.label}>Collection Title</label>
      <Form onSubmit={addCollectionHandler}>
        <Spinner loading={isLoading} size={150} />
        <Input
          className={classes.input}
          type="text"
          placeholder="Collection Title"
          value={titleValue}
          onChange={onTitleChange}
          error={titleError}
          disabled={isLoading}
          submitted={formSubmitted}
        />
        <p className={classes.description}>
          Limit 50 characters. e.g. (My movies, Movie Wishlist, Best movies,
          etc.)
        </p>
        <Button
          className={classes.submitBtn}
          content="Add Collection"
          type="submit"
        />
      </Form>
    </div>
  )
}

export default AddCollection
