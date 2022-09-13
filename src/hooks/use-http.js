import { useState, useCallback } from "react"

const API_URL = process.env.REACT_APP_API_URL

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const sendRequest = useCallback(
    async ({
      url,
      method,
      data,
      token,
      errorMessage,
      contentType = "application/json",
      defaultAPI = true,
    }) => {
      let fullUrl = ""
      if (defaultAPI) fullUrl = `${API_URL}${url}`
      else fullUrl = url
      setIsLoading(true)
      setError(null)
      let fetchConfig = {
        method,
        headers: {
          "Content-Type": contentType,
        },
      }
      if (data) fetchConfig.body = JSON.stringify(data)
      if (token)
        fetchConfig.headers = {
          ...fetchConfig.headers,
          Authorization: `Bearer ${token}`,
        }
      let response = null
      const serverResponse = await fetch(fullUrl, fetchConfig)
      response = await serverResponse.json()

      if (!serverResponse.ok) {
        setError(errorMessage || response.message)
        setIsLoading(false)
        return null
      }
      setError(null)
      setIsLoading(false)
      return response
    },
    []
  )

  return { isLoading, error, sendRequest }
}

export default useHttp
