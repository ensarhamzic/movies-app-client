import React from "react"
import classes from "./Settings.module.css"
import AuthPageWrapper from "../../components/AuthPageWrapper/AuthPageWrapper"
import { useState } from "react"
import ReactSelect from "react-select"
import { useDispatch, useSelector } from "react-redux"
import Button from "../../components/Button/Button"
import { AiOutlineClose } from "react-icons/ai"
import useInput from "../../hooks/use-input"
import Input from "../../components/Input/Input"
import useHttp from "../../hooks/use-http"
import Spinner from "../../components/Spinner/Spinner"
import { useEffect } from "react"
import { NotificationManager } from "react-notifications"
import { collectionsActions } from "../../store/collections-slice"
import ProfileButton from "../../components/ProfileButton/ProfileButton"
import CollapsingContent from "../../components/CollapsingContent/CollapsingContent"

const Settings = () => {
  const dispatch = useDispatch()
  const collections = useSelector((state) => state.collections.data).map(
    (c) => {
      return { label: c.name, value: c.id }
    }
  )
  const token = useSelector((state) => state.auth.token)

  const [renaming, setRenaming] = useState(false)
  const [selectedRenameCollection, setSelectedRenameCollection] = useState(null)
  const {
    value: collectionName,
    onChange: onCollectionNameChange,
    error: collectionNameError,
    setValue: setCollectionName,
  } = useInput((name) => {
    if (name.trim().length === 0) return "Name cannot be empty"
    if (name.length > 50) return "Name must be less than 50 characters long"
    return null
  })
  const {
    isLoading: renamingCollection,
    error: renameError,
    sendRequest: renameCollection,
  } = useHttp()

  const renameHandler = async () => {
    if (!selectedRenameCollection) {
      NotificationManager.warning("Select collection first!", "Warning!", 2000)
      return
    }
    if (!renaming) {
      setCollectionName(
        collections.find((c) => c.value === selectedRenameCollection.value)
          .label
      )
      setRenaming(true)
      return
    }

    // renaming mode is activated here.. Button click should rename collection

    if (collectionNameError) {
      NotificationManager.error(collectionNameError, "Error!", 2000)
      return
    }

    const data = { id: selectedRenameCollection.value, name: collectionName }
    const response = await renameCollection({
      url: "/collections",
      method: "PUT",
      data,
      token,
    })

    if (!response) return

    dispatch(collectionsActions.renameCollection(data))
    NotificationManager.success(response.message, "Success!", 2000)
  }

  useEffect(() => {
    renameError && NotificationManager.error(renameError, "Error!", 2000)
  }, [renameError])

  const [selectedDeleteCollection, setSelectedDeleteCollection] = useState(null)
  const {
    isLoading: deletingCollection,
    error: deleteCollectionError,
    sendRequest: deleteCollection,
  } = useHttp()

  const deleteCollectionHandler = async () => {
    if (!selectedDeleteCollection) {
      NotificationManager.warning("Select collection first!", "Warning!", 2000)
      return
    }

    const data = {
      id: selectedDeleteCollection.value,
    }

    const response = await deleteCollection({
      url: "/collections",
      method: "Delete",
      data,
      token,
    })

    if (!response) return

    dispatch(collectionsActions.removeCollection(data))
    NotificationManager.success(response.message, "Success!", 2000)
    if (selectedRenameCollection.value === selectedDeleteCollection.value)
      setSelectedRenameCollection(null)
    setSelectedDeleteCollection(null)
  }

  useEffect(() => {
    deleteCollectionError &&
      NotificationManager.error(deleteCollectionError, "Error!", 2000)
  }, [deleteCollectionError])

  return (
    <AuthPageWrapper className={classes.content}>
      <ProfileButton />
      <Spinner loading={renamingCollection || deletingCollection} />
      <h1 className={classes.header}>Settings</h1>
      <hr />
      <CollapsingContent
        title="Rename Collections"
        contentClass={classes.collapse}
      >
        {!renaming && (
          <ReactSelect
            options={collections}
            value={selectedRenameCollection}
            onChange={setSelectedRenameCollection}
            className={classes.select}
          />
        )}

        {renaming && (
          <Input
            className={classes.nameInput}
            value={collectionName}
            onChange={onCollectionNameChange}
            error={collectionNameError}
          />
        )}

        <Button className={classes.actionButton} onClick={renameHandler}>
          Rename
        </Button>
        {renaming && (
          <Button
            onClick={() => {
              setRenaming(false)
            }}
            className={classes.cancelButton}
          >
            <AiOutlineClose />
          </Button>
        )}
      </CollapsingContent>

      <CollapsingContent title="Delete Collections">
        <div className={classes.content}>
          <p className={classes.warning}>
            Collection will be deleted permanently!
          </p>
          <div className={classes.innerContent}>
            <ReactSelect
              options={collections}
              value={selectedDeleteCollection}
              onChange={setSelectedDeleteCollection}
              className={classes.select}
            />

            <Button
              className={classes.deleteCollectionButton}
              onClick={deleteCollectionHandler}
            >
              Delete
            </Button>
          </div>
        </div>
      </CollapsingContent>
    </AuthPageWrapper>
  )
}

export default Settings
