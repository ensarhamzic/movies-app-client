import React, { useState } from "react"
import classes from "./Filters.module.css"
import MultiRangeSlider from "../MultiRangeSlider/MultiRangeSlider"
import Input from "../Input/Input"
import useInput from "../../hooks/use-input"
import Button from "../Button/Button"
import { useSelector } from "react-redux"
import ReactSelect from "react-select"
import NotificationManager from "react-notifications/lib/NotificationManager"

const Filters = ({ className, onFiltersApply, appliedFilters }) => {
  const genres = useSelector((state) => state.genres.data)

  const [minRating, setMinRating] = useState(
    appliedFilters ? appliedFilters.ratings.from : 0
  )
  const [maxRating, setMaxRating] = useState(
    appliedFilters ? appliedFilters.ratings.to : 10
  )

  const { value: startYear, onChange: onStartYearChange } = useInput(
    null,
    appliedFilters ? appliedFilters.years.from : ""
  )
  const { value: endYear, onChange: onEndYearChange } = useInput(
    null,
    appliedFilters ? appliedFilters.years.to : ""
  )

  const [selectedGenres, setSelectedGenres] = useState(
    appliedFilters ? appliedFilters.genres : []
  )

  const changeRatingFilter = (e) => {
    setMinRating(e.min)
    setMaxRating(e.max)
  }

  const clearFilters = () => {
    onFiltersApply(null)
  }

  const applyFilters = () => {
    let error = false
    if ((startYear && startYear < 1800) || (endYear && endYear < 1800)) {
      NotificationManager.error("Year cannot be before 1800", "Error!", 2000)
      error = true
    }
    if (startYear && endYear && startYear > endYear) {
      NotificationManager.error(
        "Starting year cannot be higher than end year",
        "Error!",
        2000
      )
      error = true
    }
    if (endYear > new Date().getFullYear()) {
      NotificationManager.error(
        "End year cannot be in the future",
        "Error!",
        2000
      )
      error = true
    }

    if (error) return

    const filters = {
      ratings: { from: minRating, to: maxRating },
      years: { from: startYear, to: endYear },
      genres: selectedGenres,
    }

    NotificationManager.success("Filters applied!", "Success!", 2000)

    onFiltersApply(filters)
  }

  const genresOptions = genres.map((g) => {
    return {
      label: g.name,
      value: g.id,
    }
  })

  return (
    <div className={`${classes.content} ${className || ""}`}>
      <div className={classes.header}>
        <p>Filters</p>
        {appliedFilters && (
          <Button className={classes.clearButton} onClick={clearFilters}>
            Clear All
          </Button>
        )}
      </div>
      <hr />
      <div>
        <label className={classes.filterLabel}>Filter by rating</label>
        <MultiRangeSlider
          min={0}
          max={10}
          onChange={changeRatingFilter}
          minValSet={(appliedFilters && appliedFilters.ratings.from) || null}
          maxValSet={(appliedFilters && appliedFilters.ratings.to) || null}
        />
      </div>
      <div>
        <label className={classes.filterLabel}>Filter by release year</label>
        <div className={classes.datePickers}>
          <div>
            <p>From</p>
            <Input
              type="number"
              value={startYear}
              onChange={onStartYearChange}
            />
          </div>
          <div>
            <p>To</p>
            <Input type="number" value={endYear} onChange={onEndYearChange} />
          </div>
        </div>
      </div>
      <div className={classes.genresFilter}>
        <label className={classes.filterLabel}>Filter by genres</label>
        <ReactSelect
          className={classes.genresSelect}
          options={genresOptions}
          value={selectedGenres}
          onChange={setSelectedGenres}
          isMulti={true}
        />
      </div>
      <Button className={classes.applyButton} onClick={applyFilters}>
        Apply filters
      </Button>
    </div>
  )
}

export default Filters
