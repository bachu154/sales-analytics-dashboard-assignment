"use client"

import { useState, useEffect, useCallback } from "react"

// Custom hook for API calls with loading and error states
export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async (...args) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiFunction(...args)
      setData(result)
    } catch (err) {
      setError(err.message || "An error occurred")
      console.error("API Error:", err)
    } finally {
      setLoading(false)
    }
  }, dependencies)

  useEffect(() => {
    if (dependencies.length === 0 || dependencies.every((dep) => dep !== null && dep !== undefined)) {
      fetchData(...dependencies)
    }
  }, dependencies)

  return { data, loading, error, refetch: fetchData }
}

// Hook for manual API calls (like form submissions)
export const useApiCall = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(async (apiFunction, ...args) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiFunction(...args)
      return result
    } catch (err) {
      setError(err.message || "An error occurred")
      console.error("API Error:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { execute, loading, error }
}
