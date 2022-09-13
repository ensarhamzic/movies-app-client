import React from "react"
import classes from "./LetterFilter.module.css"

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
  "ALL",
]

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
