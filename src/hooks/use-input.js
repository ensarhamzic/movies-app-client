import { useEffect, useState } from "react"

const useInput = (validateValue = null, initialValue = "") => {
  const [value, setValue] = useState(initialValue)
  const [error, setError] = useState(null)
  const handleChange = (event) => {
    setValue(event.target.value)
  }

  useEffect(() => {
    if (validateValue) setError(validateValue(value))
  }, [value, validateValue])

  return { value, onChange: handleChange, error, validateValue, setValue }
}

export default useInput
