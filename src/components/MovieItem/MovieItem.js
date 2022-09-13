import React, { useEffect } from "react"
import Button from "../Button/Button"
import classes from "./MovieItem.module.css"
import {
  AiFillHeart,
  AiFillMinusCircle,
  AiFillPlusCircle,
  AiOutlineHeart,
} from "react-icons/ai"
import useHttp from "../../hooks/use-http"
import NotificationManager from "react-notifications/lib/NotificationManager"
import { useSelector } from "react-redux"
import { collectionsActions } from "../../store/collections-slice"
import { useDispatch } from "react-redux"
import Spinner from "../Spinner/Spinner"
import { favoritesActions } from "../../store/favorites-slice"
import GenresList from "../GenresList/GenresList"

const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL

const MovieItem = ({ movie, collection }) => {
  const dispatch = useDispatch()
  const {
    isLoading: addingToCollection,
    error: addToCollectionError,
    sendRequest: addToCollection,
  } = useHttp()
  const {
    isLoading: addingToFavorites,
    error: addToFavoritesError,
    sendRequest: addToFavorites,
  } = useHttp()
  const token = useSelector((state) => state.auth.token)
  const collections = useSelector((state) => state.collections.data)
  const favorites = useSelector((state) => state.favorites.data)

  const addToCollectionHandler = async () => {
    if (!collection) {
      NotificationManager.error("Choose collection first!", "Error!", 2000)
      return
    }

    const data = {
      id: movie.id,
      collectionId: collection,
    }

    const response = await addToCollection({
      url: "/collections/add-movie",
      method: "POST",
      token,
      data,
    })

    if (!response) return

    dispatch(
      collectionsActions.addRemoveMovie({
        movieId: movie.id,
        collectionId: collection,
      })
    )
    NotificationManager.success(response.message, "Success!", 2000)
  }

  useEffect(() => {
    if (addToCollectionError)
      NotificationManager.error(addToCollectionError, "Error!", 2000)
  }, [addToCollectionError])

  const addToFavoritesHandler = async () => {
    const data = {
      id: movie.id,
    }

    const response = await addToFavorites({
      url: "/collections/favorize",
      method: "POST",
      token,
      data,
    })

    if (!response) return

    dispatch(favoritesActions.addRemoveFavorite({ movieId: movie.id }))

    NotificationManager.success(response.message, "Success!", 2000)
  }

  useEffect(() => {
    if (addToFavoritesError)
      NotificationManager.error(addToFavoritesError, "Error!", 2000)
  }, [addToFavoritesError])

  let posterSrc = ""
  if (movie.poster_path) posterSrc = `${IMAGE_BASE_URL}${movie.poster_path}`
  else posterSrc = "https://via.placeholder.com/250x375"

  let collectionButtonContent = ""
  if (
    !collection ||
    !collections
      .find((c) => c.id === parseInt(collection))
      .movies.find((m) => m.id === movie.id)
  ) {
    collectionButtonContent = (
      <>
        <AiFillPlusCircle /> <span>Add</span>
      </>
    )
  } else {
    collectionButtonContent = (
      <>
        <AiFillMinusCircle />
        <span>Remove</span>
      </>
    )
  }

  let favoriteButtonContent = ""
  if (!favorites.find((f) => f.id === movie.id)) {
    favoriteButtonContent = <AiOutlineHeart />
  } else {
    favoriteButtonContent = <AiFillHeart />
  }

  return (
    <>
      <Spinner loading={addingToCollection || addingToFavorites} />
      <div className={classes.movie}>
        <div className={classes.left}>
          <img src={posterSrc} alt={movie.title} />
          <div className={classes.actions}>
            <Button
              onClick={addToCollectionHandler}
              className={classes.addButton}
            >
              {collectionButtonContent}
            </Button>
            <Button
              className={classes.favoritesBtn}
              onClick={addToFavoritesHandler}
            >
              {favoriteButtonContent}
            </Button>
          </div>
        </div>
        <div className={classes.details}>
          <p className={classes.title}>{movie.title}</p>
          <GenresList genres={movie.genres} />
          <div className={classes.inner}>
            <p>
              <span>Release date: </span>
              {movie.release_date}
            </p>
            <p>
              <span>Rating: </span>
              {movie.vote_average}
            </p>
          </div>
          <div className={classes.overview}>
            <p>{movie.overview}</p>
          </div>
        </div>
      </div>
      <hr />
    </>
  )
}

export default MovieItem
