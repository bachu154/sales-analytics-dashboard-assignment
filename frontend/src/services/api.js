import axios from "axios"

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message)
    return Promise.reject(error.response?.data || error)
  },
)

// Analytics API functions
export const analyticsAPI = {
  // Get revenue data
  getRevenue: (startDate, endDate) => api.get(`/revenue?startDate=${startDate}&endDate=${endDate}`),

  // Get top products
  getTopProducts: (startDate, endDate, limit = 10) =>
    api.get(`/top-products?startDate=${startDate}&endDate=${endDate}&limit=${limit}`),

  // Get top customers
  getTopCustomers: (startDate, endDate, limit = 10) =>
    api.get(`/top-customers?startDate=${startDate}&endDate=${endDate}&limit=${limit}`),

  // Get region statistics
  getRegionStats: (startDate, endDate) => api.get(`/region-stats?startDate=${startDate}&endDate=${endDate}`),

  // Get category statistics
  getCategoryStats: (startDate, endDate) => api.get(`/category-stats?startDate=${startDate}&endDate=${endDate}`),

  // Generate report
  generateReport: (startDate, endDate) => api.post("/reports", { startDate, endDate }),

  // Get saved reports
  getReports: (page = 1, limit = 10) => api.get(`/reports?page=${page}&limit=${limit}`),

  // Get specific report
  getReportById: (id) => api.get(`/reports/${id}`),

  // Health check
  healthCheck: () => api.get("/health"),
}

export default api
