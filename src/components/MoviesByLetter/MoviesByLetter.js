import React from "react"
import Movie from "../Movie/Movie"
import classes from "./MoviesByLetter.module.css"

const MoviesByLetter = ({ movies, letter, showType }) => {
  if (movies.length === 0) return null

  return (
    <div className={classes.wrapper}>
      <p className={classes.letter}>{letter}</p>
      <hr />
      <div className={classes.movies}>
        {movies.map((m) => (
          <Movie key={m.id} movie={m} showType={showType} />
        ))}
      </div>
    </div>
  )
}

export default MoviesByLetter
