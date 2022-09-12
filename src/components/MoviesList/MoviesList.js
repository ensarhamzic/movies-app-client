import React from "react"
import MovieItem from "../MovieItem/MovieItem"
import classes from "./MoviesList.module.css"

const MoviesList = ({ movies, collection }) => {
  return (
    <div className={classes.movies}>
      <hr />
      <p className={classes.title}>Results</p>
      {movies.map((m) => (
        <MovieItem key={m.id} movie={m} collection={collection} />
      ))}
    </div>
  )
}

export default MoviesList
