import React from "react"
import classes from "./LetterFilter.module.css"
import letters from "../../helpers/letters"

const LetterFilter = ({ onChange, className, choosenLetter }) => {
  const letterClickHandler = (e) => {
    const letter = e.target.getAttribute("data-value")
    onChange(letter)
  }
  return (
    <div className={`${classes.letters} ${className}`}>
      {letters.map((letter) => (
        <span
          key={letter}
          data-value={letter}
          onClick={letterClickHandler}
          className={choosenLetter === letter ? classes.choosen : ""}
        >
          {letter}
        </span>
      ))}
    </div>
  )
}

export default LetterFilter
