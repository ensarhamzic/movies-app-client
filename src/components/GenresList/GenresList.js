import React from "react"
import classes from "./GenresList.module.css"

const GenresList = ({ genres, className }) => {
  return (
    <div className={`${classes.genres} ${className || ""}`}>
      {genres.map((g) => (
        <p key={g.id}>{g.name}</p>
      ))}
    </div>
  )
}

export default GenresList
