import React from "react"
import GenresList from "../GenresList/GenresList"
import classes from "./Movie.module.css"

const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL

const Movie = ({ movie, showType }) => {
  let posterSrc = ""
  if (movie.poster_path) posterSrc = `${IMAGE_BASE_URL}${movie.poster_path}`
  else posterSrc = "https://via.placeholder.com/130x195"

  return (
    <div className={classes.movie}>
      <img src={posterSrc} alt={movie.title} />
      <p className={classes.title}>{movie.title}</p>
    </div>
  )
}

export default Movie
