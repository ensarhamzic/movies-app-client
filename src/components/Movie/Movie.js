import React, { useEffect } from "react"
import classes from "./Movie.module.css"
import GenresList from "../GenresList/GenresList"
import Card from "../Card/Card"
import Button from "../Button/Button"
import { RiDeleteBinLine } from "react-icons/ri"
import useHttp from "../../hooks/use-http"
import { useDispatch } from "react-redux"
import { favoritesActions } from "../../store/favorites-slice"
import { collectionsActions } from "../../store/collections-slice"
import NotificationManager from "react-notifications/lib/NotificationManager"
import { useSelector } from "react-redux"
import Spinner from "../Spinner/Spinner"

const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL

const Movie = ({ movie, showType, editing, forFavorites, collection }) => {
  const {
    isLoading: removingMovie,
    error: removingMovieError,
    sendRequest: removeMovie,
  } = useHttp()
  const dispatch = useDispatch()
  const token = useSelector((state) => state.auth.token)

  let posterSrc = ""
  if (movie.poster_path) posterSrc = `${IMAGE_BASE_URL}${movie.poster_path}`
  else posterSrc = "https://via.placeholder.com/130x195"

  const removeMovieHandler = async () => {
    if (forFavorites) {
      const data = {
        id: movie.id,
      }

      const response = await removeMovie({
        url: "/collections/favorize",
        method: "POST",
        token,
        data,
      })

      if (!response) return

      dispatch(favoritesActions.addRemoveFavorite({ movieId: movie.id }))

      NotificationManager.success(response.message, "Success!", 2000)
    } else if (collection) {
      const data = {
        id: movie.id,
        collectionId: collection,
      }

      const response = await removeMovie({
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
  }

  useEffect(() => {
    if (removingMovieError)
      NotificationManager.error(removingMovieError, "Error!", 2000)
  }, [removingMovieError])

  if (showType === "Cover")
    return (
      <div className={classes.coverMovie}>
        <Spinner loading={removingMovie} />
        <img src={posterSrc} alt={movie.title} />
        <p className={classes.coverTitle}>{movie.title}</p>
        {editing && (
          <Button
            className={`${classes.removeButton} ${classes.coverRemoveButton}`}
            onClick={removeMovieHandler}
          >
            <RiDeleteBinLine />
            <span>Remove</span>
          </Button>
        )}
      </div>
    )

  if (showType === "List")
    return (
      <div className={classes.listMovie}>
        <GenresList genres={movie.genres} className={classes.listGenres} />
        <p className={classes.listTitle}>{movie.title}</p>
        <div className={classes.listMovieDetails}>
          <p>
            Release date: <span>{movie.release_date || "N/A"}</span>
          </p>
          <p>
            Rating: <span>{movie.vote_average}</span>
          </p>
        </div>
        {editing && (
          <Button className={classes.removeButton} onClick={removeMovieHandler}>
            <RiDeleteBinLine />
            <span>Remove</span>
          </Button>
        )}
      </div>
    )

  if (showType === "Summary") {
    return (
      <Card className={classes.summaryMovie}>
        {editing && (
          <Button
            className={`${classes.removeButton} ${classes.summaryRemoveButton}`}
            onClick={removeMovieHandler}
          >
            <RiDeleteBinLine />
            <span>Remove</span>
          </Button>
        )}
        <div className={classes.summaryLeft}>
          <img src={posterSrc} alt={movie.title} />
        </div>
        <div className={classes.summaryRight}>
          <p className={classes.summaryTitle}>{movie.title}</p>
          <GenresList genres={movie.genres} className={classes.listGenres} />
          <div className={classes.summaryMovieDetails}>
            <p>
              Release date: <span>{movie.release_date || "N/A"}</span>
            </p>
            <p>
              Rating: <span>{movie.vote_average}</span>
            </p>
          </div>
          <p className={classes.overview}>{movie.overview}</p>
        </div>
      </Card>
    )
  }
}

export default Movie
