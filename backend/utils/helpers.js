const moment = require("moment")

// Date validation helper
const validateDateRange = (startDate, endDate) => {
  const start = moment(startDate)
  const end = moment(endDate)

  if (!start.isValid() || !end.isValid()) {
    return {
      isValid: false,
      error: "Invalid date format. Please use YYYY-MM-DD format.",
    }
  }

  if (start.isAfter(end)) {
    return {
      isValid: false,
      error: "Start date cannot be after end date.",
    }
  }

  if (end.isAfter(moment())) {
    return {
      isValid: false,
      error: "End date cannot be in the future.",
    }
  }

  return {
    isValid: true,
    startDate: start.toDate(),
    endDate: end.toDate(),
  }
}

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

// Calculate percentage change
const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

// Generate date range array
const generateDateRange = (startDate, endDate, interval = "day") => {
  const dates = []
  const start = moment(startDate)
  const end = moment(endDate)

  while (start.isSameOrBefore(end)) {
    dates.push(start.clone().toDate())
    start.add(1, interval)
  }

  return dates
}

module.exports = {
  validateDateRange,
  formatCurrency,
  calculatePercentageChange,
  generateDateRange,
}
