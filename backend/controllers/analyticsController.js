const { validationResult } = require("express-validator")
const moment = require("moment")
const Sales = require("../models/Sales")
const Customer = require("../models/Customer")
const Product = require("../models/Product")
const AnalyticsReport = require("../models/AnalyticsReport")
const { validateDateRange } = require("../utils/helpers")

// Get revenue data by date range
const getRevenue = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      })
    }

    const { startDate, endDate } = req.query
    const dateValidation = validateDateRange(startDate, endDate)

    if (!dateValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: dateValidation.error,
      })
    }

    // Aggregation pipeline for revenue data
    const revenueData = await Sales.aggregate([
      {
        $match: {
          reportDate: {
            $gte: dateValidation.startDate,
            $lte: dateValidation.endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$reportDate",
            },
          },
          totalRevenue: { $sum: "$totalRevenue" },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: "$totalRevenue" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    // Calculate totals
    const totals = await Sales.aggregate([
      {
        $match: {
          reportDate: {
            $gte: dateValidation.startDate,
            $lte: dateValidation.endDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalRevenue" },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: "$totalRevenue" },
        },
      },
    ])

    res.json({
      success: true,
      data: {
        dailyRevenue: revenueData,
        summary: totals[0] || {
          totalRevenue: 0,
          totalOrders: 0,
          avgOrderValue: 0,
        },
      },
    })
  } catch (error) {
    console.error("Error getting revenue data:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

// Get top-selling products
const getTopProducts = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      })
    }

    const { startDate, endDate, limit = 10 } = req.query
    const dateValidation = validateDateRange(startDate, endDate)

    if (!dateValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: dateValidation.error,
      })
    }

    const topProducts = await Sales.aggregate([
      {
        $match: {
          reportDate: {
            $gte: dateValidation.startDate,
            $lte: dateValidation.endDate,
          },
        },
      },
      {
        $group: {
          _id: "$productId",
          totalSold: { $sum: "$quantity" },
          totalRevenue: { $sum: "$totalRevenue" },
          totalOrders: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
      {
        $project: {
          _id: 1,
          name: "$product.name",
          category: "$product.category",
          price: "$product.price",
          totalSold: 1,
          totalRevenue: 1,
          totalOrders: 1,
        },
      },
      {
        $sort: { totalSold: -1 },
      },
      {
        $limit: Number.parseInt(limit),
      },
    ])

    res.json({
      success: true,
      data: topProducts,
    })
  } catch (error) {
    console.error("Error getting top products:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

// Get top customers
const getTopCustomers = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      })
    }

    const { startDate, endDate, limit = 10 } = req.query
    const dateValidation = validateDateRange(startDate, endDate)

    if (!dateValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: dateValidation.error,
      })
    }

    const topCustomers = await Sales.aggregate([
      {
        $match: {
          reportDate: {
            $gte: dateValidation.startDate,
            $lte: dateValidation.endDate,
          },
        },
      },
      {
        $group: {
          _id: "$customerId",
          totalSpent: { $sum: "$totalRevenue" },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: "$totalRevenue" },
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "_id",
          foreignField: "_id",
          as: "customer",
        },
      },
      {
        $unwind: "$customer",
      },
      {
        $project: {
          _id: 1,
          name: "$customer.name",
          region: "$customer.region",
          type: "$customer.type",
          totalSpent: 1,
          totalOrders: 1,
          avgOrderValue: 1,
        },
      },
      {
        $sort: { totalSpent: -1 },
      },
      {
        $limit: Number.parseInt(limit),
      },
    ])

    res.json({
      success: true,
      data: topCustomers,
    })
  } catch (error) {
    console.error("Error getting top customers:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

// Get region-wise statistics
const getRegionStats = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      })
    }

    const { startDate, endDate } = req.query
    const dateValidation = validateDateRange(startDate, endDate)

    if (!dateValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: dateValidation.error,
      })
    }

    const regionStats = await Sales.aggregate([
      {
        $match: {
          reportDate: {
            $gte: dateValidation.startDate,
            $lte: dateValidation.endDate,
          },
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        },
      },
      {
        $unwind: "$customer",
      },
      {
        $group: {
          _id: "$customer.region",
          totalRevenue: { $sum: "$totalRevenue" },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: "$totalRevenue" },
          uniqueCustomers: { $addToSet: "$customerId" },
        },
      },
      {
        $project: {
          region: "$_id",
          totalRevenue: 1,
          totalOrders: 1,
          avgOrderValue: 1,
          uniqueCustomers: { $size: "$uniqueCustomers" },
        },
      },
      {
        $sort: { totalRevenue: -1 },
      },
    ])

    res.json({
      success: true,
      data: regionStats,
    })
  } catch (error) {
    console.error("Error getting region stats:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

// Get category-wise statistics
const getCategoryStats = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      })
    }

    const { startDate, endDate } = req.query
    const dateValidation = validateDateRange(startDate, endDate)

    if (!dateValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: dateValidation.error,
      })
    }

    const categoryStats = await Sales.aggregate([
      {
        $match: {
          reportDate: {
            $gte: dateValidation.startDate,
            $lte: dateValidation.endDate,
          },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
      {
        $group: {
          _id: "$product.category",
          totalRevenue: { $sum: "$totalRevenue" },
          totalOrders: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" },
          avgOrderValue: { $avg: "$totalRevenue" },
          uniqueProducts: { $addToSet: "$productId" },
        },
      },
      {
        $project: {
          category: "$_id",
          totalRevenue: 1,
          totalOrders: 1,
          totalQuantity: 1,
          avgOrderValue: 1,
          uniqueProducts: { $size: "$uniqueProducts" },
        },
      },
      {
        $sort: { totalRevenue: -1 },
      },
    ])

    res.json({
      success: true,
      data: categoryStats,
    })
  } catch (error) {
    console.error("Error getting category stats:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

// Generate and save analytics report
const generateReport = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      })
    }

    const { startDate, endDate } = req.body
    const dateValidation = validateDateRange(startDate, endDate)

    if (!dateValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: dateValidation.error,
      })
    }

    // Get all analytics data
    const [revenueData, topProducts, topCustomers, regionStats, categoryStats] = await Promise.all([
      // Revenue summary
      Sales.aggregate([
        {
          $match: {
            reportDate: {
              $gte: dateValidation.startDate,
              $lte: dateValidation.endDate,
            },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalRevenue" },
            totalOrders: { $sum: 1 },
            avgOrderValue: { $avg: "$totalRevenue" },
          },
        },
      ]),

      // Top products
      Sales.aggregate([
        {
          $match: {
            reportDate: {
              $gte: dateValidation.startDate,
              $lte: dateValidation.endDate,
            },
          },
        },
        {
          $group: {
            _id: "$productId",
            totalSold: { $sum: "$quantity" },
            revenue: { $sum: "$totalRevenue" },
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $unwind: "$product",
        },
        {
          $project: {
            productId: "$_id",
            name: "$product.name",
            totalSold: 1,
            revenue: 1,
          },
        },
        {
          $sort: { totalSold: -1 },
        },
        {
          $limit: 5,
        },
      ]),

      // Top customers
      Sales.aggregate([
        {
          $match: {
            reportDate: {
              $gte: dateValidation.startDate,
              $lte: dateValidation.endDate,
            },
          },
        },
        {
          $group: {
            _id: "$customerId",
            totalOrders: { $sum: 1 },
            totalSpent: { $sum: "$totalRevenue" },
          },
        },
        {
          $lookup: {
            from: "customers",
            localField: "_id",
            foreignField: "_id",
            as: "customer",
          },
        },
        {
          $unwind: "$customer",
        },
        {
          $project: {
            customerId: "$_id",
            name: "$customer.name",
            totalOrders: 1,
            totalSpent: 1,
          },
        },
        {
          $sort: { totalSpent: -1 },
        },
        {
          $limit: 5,
        },
      ]),

      // Region stats
      Sales.aggregate([
        {
          $match: {
            reportDate: {
              $gte: dateValidation.startDate,
              $lte: dateValidation.endDate,
            },
          },
        },
        {
          $lookup: {
            from: "customers",
            localField: "customerId",
            foreignField: "_id",
            as: "customer",
          },
        },
        {
          $unwind: "$customer",
        },
        {
          $group: {
            _id: "$customer.region",
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: "$totalRevenue" },
            avgOrderValue: { $avg: "$totalRevenue" },
          },
        },
        {
          $project: {
            region: "$_id",
            totalOrders: 1,
            totalRevenue: 1,
            avgOrderValue: 1,
          },
        },
      ]),

      // Category stats
      Sales.aggregate([
        {
          $match: {
            reportDate: {
              $gte: dateValidation.startDate,
              $lte: dateValidation.endDate,
            },
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $unwind: "$product",
        },
        {
          $group: {
            _id: "$product.category",
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: "$totalRevenue" },
            avgOrderValue: { $avg: "$totalRevenue" },
          },
        },
        {
          $project: {
            category: "$_id",
            totalOrders: 1,
            totalRevenue: 1,
            avgOrderValue: 1,
          },
        },
      ]),
    ])

    const summary = revenueData[0] || {
      totalRevenue: 0,
      totalOrders: 0,
      avgOrderValue: 0,
    }

    // Create analytics report
    const report = new AnalyticsReport({
      startDate: dateValidation.startDate,
      endDate: dateValidation.endDate,
      totalOrders: summary.totalOrders,
      totalRevenue: summary.totalRevenue,
      avgOrderValue: summary.avgOrderValue,
      topProducts,
      topCustomers,
      regionWiseStats: regionStats,
      categoryWiseStats: categoryStats,
    })

    await report.save()

    res.json({
      success: true,
      message: "Analytics report generated successfully",
      data: report,
    })
  } catch (error) {
    console.error("Error generating report:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

// Get saved reports
const getReports = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const skip = (page - 1) * limit

    const reports = await AnalyticsReport.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit))
      .select("-topProducts -topCustomers -regionWiseStats -categoryWiseStats")

    const total = await AnalyticsReport.countDocuments()

    res.json({
      success: true,
      data: {
        reports,
        pagination: {
          current: Number.parseInt(page),
          pages: Math.ceil(total / limit),
          total,
        },
      },
    })
  } catch (error) {
    console.error("Error getting reports:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

// Get specific report by ID
const getReportById = async (req, res) => {
  try {
    const { id } = req.params
    const report = await AnalyticsReport.findById(id)

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      })
    }

    res.json({
      success: true,
      data: report,
    })
  } catch (error) {
    console.error("Error getting report:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

module.exports = {
  getRevenue,
  getTopProducts,
  getTopCustomers,
  getRegionStats,
  getCategoryStats,
  generateReport,
  getReports,
  getReportById,
}
