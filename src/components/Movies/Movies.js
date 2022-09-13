import React from "react"
import MoviesByLetter from "../MoviesByLetter/MoviesByLetter"
import classes from "./Movies.module.css"

const letters = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "#",
]

const Movies = ({ movies, showType = "Cover" }) => {
  return (
    <>
      {movies.length > 0 && (
        <div className={classes.movies}>
          {letters.map((letter) => (
            <MoviesByLetter
              key={letter}
              movies={
                letter !== "#"
                  ? movies.filter((m) => m.title.charAt(0) === letter)
                  : movies.filter((m) => m.title.charAt(0).match(/[^a-zA-z]/))
              }
              letter={letter}
              showType={showType}
            />
          ))}
        </div>
      )}
      {movies.length === 0 && (
        <p className={classes.noMovies}>No movies found</p>
      )}
    </>
  )
}

export default Movies
