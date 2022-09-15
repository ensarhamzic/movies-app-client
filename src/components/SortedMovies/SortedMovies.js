import React from "react"
import Movie from "../Movie/Movie"
import classes from "./SortedMovies.module.css"

const SortedMovies = ({ movies, groupName, showType }) => {
  if (movies.length === 0) return null
  let moviesClass = classes.coverMovies
  if (showType === "List") moviesClass = classes.listMovies
  else if (showType === "Summary") moviesClass = classes.summaryMovies

  return (
    <div className={classes.wrapper}>
      <p className={classes.group}>{groupName || "N/A"}</p>
      <hr />
      <div className={moviesClass}>
        {movies.map((m) => (
          <Movie key={m.id} movie={m} showType={showType} />
        ))}
      </div>
    </div>
  )
}

export default SortedMovies
