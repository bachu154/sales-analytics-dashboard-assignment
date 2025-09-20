const mongoose = require("mongoose")

const analyticsReportSchema = new mongoose.Schema(
  {
    reportDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalOrders: {
      type: Number,
      required: true,
      default: 0,
    },
    totalRevenue: {
      type: Number,
      required: true,
      default: 0,
    },
    avgOrderValue: {
      type: Number,
      required: true,
      default: 0,
    },
    topProducts: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        name: String,
        totalSold: Number,
        revenue: Number,
      },
    ],
    topCustomers: [
      {
        customerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Customer",
        },
        name: String,
        totalOrders: Number,
        totalSpent: Number,
      },
    ],
    regionWiseStats: [
      {
        region: String,
        totalOrders: Number,
        totalRevenue: Number,
        avgOrderValue: Number,
      },
    ],
    categoryWiseStats: [
      {
        category: String,
        totalOrders: Number,
        totalRevenue: Number,
        avgOrderValue: Number,
      },
    ],
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
analyticsReportSchema.index({ startDate: 1, endDate: 1 })
analyticsReportSchema.index({ reportDate: -1 })

module.exports = mongoose.model("AnalyticsReport", analyticsReportSchema)
