import { useEffect, useState } from "react"

const useInput = (validateValue, initialValue = "") => {
  const [value, setValue] = useState(initialValue)
  const [error, setError] = useState(null)
  const handleChange = (event) => {
    setValue(event.target.value)
  }

  useEffect(() => {
    setError(validateValue(value))
  }, [value, validateValue])

  return { value, onChange: handleChange, error, validateValue }
}

export default useInput
