const express = require("express")
const { query, body } = require("express-validator")
const {
  getRevenue,
  getTopProducts,
  getTopCustomers,
  getRegionStats,
  getCategoryStats,
  generateReport,
  getReports,
  getReportById,
} = require("../controllers/analyticsController")

const router = express.Router()

// Validation middleware for date queries
const validateDateQuery = [
  query("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Start date must be in YYYY-MM-DD format"),
  query("endDate")
    .notEmpty()
    .withMessage("End date is required")
    .isISO8601()
    .withMessage("End date must be in YYYY-MM-DD format"),
]

// Validation middleware for report generation
const validateReportBody = [
  body("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Start date must be in YYYY-MM-DD format"),
  body("endDate")
    .notEmpty()
    .withMessage("End date is required")
    .isISO8601()
    .withMessage("End date must be in YYYY-MM-DD format"),
]

// Analytics routes
router.get("/revenue", validateDateQuery, getRevenue)
router.get("/top-products", validateDateQuery, getTopProducts)
router.get("/top-customers", validateDateQuery, getTopCustomers)
router.get("/region-stats", validateDateQuery, getRegionStats)
router.get("/category-stats", validateDateQuery, getCategoryStats)

// Reports routes
router.post("/reports", validateReportBody, generateReport)
router.get("/reports", getReports)
router.get("/reports/:id", getReportById)

// Health check route
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Analytics API is running",
    timestamp: new Date().toISOString(),
  })
})

module.exports = router
