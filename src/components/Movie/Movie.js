import React from "react"
import classes from "./Movie.module.css"
import GenresList from "../GenresList/GenresList"
import Card from "../Card/Card"

const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL

const Movie = ({ movie, showType }) => {
  let posterSrc = ""
  if (movie.poster_path) posterSrc = `${IMAGE_BASE_URL}${movie.poster_path}`
  else posterSrc = "https://via.placeholder.com/130x195"

  if (showType === "Cover")
    return (
      <div className={classes.coverMovie}>
        <img src={posterSrc} alt={movie.title} />
        <p className={classes.coverTitle}>{movie.title}</p>
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
      </div>
    )

  if (showType === "Summary") {
    return (
      <Card className={classes.summaryMovie}>
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
