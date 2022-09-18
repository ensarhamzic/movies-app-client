import React, { useEffect, useState } from "react"
import AuthPageWrapper from "../../components/AuthPageWrapper/AuthPageWrapper"
import classes from "./Publish.module.css"
import Form from "../../components/Form/Form"
import Input from "../../components/Input/Input"
import useInput from "../../hooks/use-input"
import Button from "../../components/Button/Button"
import useHttp from "../../hooks/use-http"
import { useSelector } from "react-redux"
import NotificationManager from "react-notifications/lib/NotificationManager"
import Spinner from "../../components/Spinner/Spinner"
import ReactSelect from "react-select"

const validateName = (name) => {
  if (name.length === 0) return "Name cannot be empty"
  if (!name.match(/^[a-zA-Z0-9-_]+$/))
    return "Name must only contain alphanumeric characters, dashes and underscores"
  return null
}

const Publish = () => {
  const collections = useSelector((state) => state.collections.data)
  const { isLoading: gettingPublishUrl, sendRequest: getUserPublish } =
    useHttp()
  const {
    isLoading: changingUrl,
    error: changeUrlError,
    sendRequest: changeUrl,
  } = useHttp()

  const {
    isLoading: publishing,
    error: publishError,
    sendRequest: publish,
  } = useHttp()

  const [selectedCollections, setSelectedCollections] = useState([])
  const token = useSelector((state) => state.auth.token)

  const {
    value: nameValue,
    onChange: onNameChange,
    error: nameValueError,
    setValue: setName,
  } = useInput(validateName)

  useEffect(() => {
    ;(async () => {
      const response = await getUserPublish({
        url: "/publishes",
        method: "GET",
        token,
      })

      if (!response) return

      if (response.publish) setName(response.publish.name)
    })()
  }, [getUserPublish, token, setName])

  const urlNameSubmitHandler = async () => {
    if (nameValueError) {
      NotificationManager.error(nameValueError, "Error!", 2000)
      return
    }
    const data = {
      name: nameValue,
    }
    const response = await changeUrl({
      url: "/publishes",
      method: "POST",
      data,
      token,
    })

    if (!response) return

    NotificationManager.success(response.message, "Success", 2000)
  }

  useEffect(() => {
    if (changeUrlError) {
      NotificationManager.error(changeUrlError, "Error!", 2000)
    }
  }, [changeUrlError])

  const publishHandler = async () => {
    if (selectedCollections.length === 0) {
      NotificationManager.error(
        "Must have at least one collection",
        "Error",
        2000
      )
      return
    }
    const data = {
      collectionIds: selectedCollections.map((c) => c.value),
    }
    const response = await publish({
      url: "/publishes/publish-collections",
      method: "POST",
      data,
      token,
    })

    if (!response) return

    NotificationManager.success(response.message, "Success", 2000)
  }

  useEffect(() => {
    if (publishError) {
      NotificationManager.error(publishError, "Error!", 2000)
    }
  }, [publishError])

  const options = collections.map((c) => {
    return {
      label: c.name,
      value: c.id,
    }
  })

  return (
    <AuthPageWrapper className={classes.content}>
      <Spinner loading={changingUrl || publishing || gettingPublishUrl} />
      <h1 className={classes.header}>Publish personal page</h1>
      <hr />
      <Form onSubmit={urlNameSubmitHandler}>
        <label className={classes.label}>Your Public Site Url</label>
        <p>Visible on http://localhost:3000/u/{nameValue}</p>
        <p className={classes.description}>
          Must consist of only alphanumeric characters, dashes and underscores
        </p>
        <Input
          type="text"
          placeholder="name"
          value={nameValue}
          onChange={onNameChange}
          error={nameValueError}
          className={classes.urlInput}
        />
        <Button className={classes.submitBtn} type="submit">
          Change Url
        </Button>
      </Form>

      <Form onSubmit={publishHandler}>
        <label className={classes.label}>Select collections to publish</label>
        <ReactSelect
          className={classes.multiSelect}
          options={options}
          value={selectedCollections}
          onChange={setSelectedCollections}
          isMulti={true}
        />
        <Button className={classes.submitBtn} type="submit">
          Publish
        </Button>
      </Form>
    </AuthPageWrapper>
  )
}

export default Publish
