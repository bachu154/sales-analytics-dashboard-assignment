// Format currency values
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0)
}

// Format large numbers with K, M, B suffixes
export const formatNumber = (num) => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + "B"
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num?.toString() || "0"
}

// Format percentage
export const formatPercentage = (value, decimals = 1) => {
  return `${(value || 0).toFixed(decimals)}%`
}

// Format date for display
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Format date for API calls
export const formatDateForAPI = (date) => {
  return date.toISOString().split("T")[0]
}

// Calculate percentage change
export const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

// Get color based on value (for positive/negative indicators)
export const getValueColor = (value, theme) => {
  if (value > 0) return theme.palette.success.main
  if (value < 0) return theme.palette.error.main
  return theme.palette.text.secondary
}
