import React from "react"
import SortedMovies from "../SortedMovies/SortedMovies"
import classes from "./Movies.module.css"
import letters from "../../helpers/letters"

const Movies = ({ movies, showType, sortBy, ascending }) => {
  if (movies.length === 0)
    return <p className={classes.noMovies}>No movies found</p>

  if (sortBy === "Title") {
    const sortedLetters = [...letters]
    if (!ascending) sortedLetters.reverse()
    return (
      <>
        {movies.length > 0 && (
          <div className={classes.movies}>
            {sortedLetters.map((letter) => {
              let currentMovies = []
              if (letter !== "#")
                currentMovies = movies.filter(
                  (m) => m.title.charAt(0) === letter
                )
              else
                currentMovies = movies.filter((m) =>
                  m.title.charAt(0).match(/[^a-zA-z]/)
                )
              return (
                <SortedMovies
                  key={letter}
                  movies={currentMovies}
                  groupName={letter}
                  showType={showType}
                />
              )
            })}
          </div>
        )}
      </>
    )
  }

  if (sortBy === "Rating") {
    let ratings = movies.map((m) => m.vote_average)
    ratings = [...new Set(ratings)] // filters only unique values
    ratings.sort((a, b) => a - b)
    if (!ascending) ratings.reverse()
    return (
      <>
        {movies.length > 0 && (
          <div className={classes.movies}>
            {ratings.map((rating) => (
              <SortedMovies
                key={rating}
                movies={movies.filter((m) => m.vote_average === rating)}
                groupName={rating}
                showType={showType}
              />
            ))}
          </div>
        )}
      </>
    )
  }

  if (sortBy === "Release Date") {
    let releaseDates = movies.map((m) => m.release_date.substring(0, 4))
    releaseDates = [...new Set(releaseDates)] // filters only unique values
    releaseDates.sort((a, b) => a - b)
    if (!ascending) releaseDates.reverse()
    return (
      <>
        {movies.length > 0 && (
          <div className={classes.movies}>
            {releaseDates.map((rating) => (
              <SortedMovies
                key={rating}
                movies={movies.filter(
                  (m) => m.release_date.substring(0, 4) === rating
                )}
                groupName={rating}
                showType={showType}
              />
            ))}
          </div>
        )}
      </>
    )
  }
}

export default Movies
