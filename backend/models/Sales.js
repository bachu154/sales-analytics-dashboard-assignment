const mongoose = require("mongoose")

const salesSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Customer ID is required"],
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    totalRevenue: {
      type: Number,
      required: [true, "Total revenue is required"],
      min: [0, "Total revenue cannot be negative"],
    },
    reportDate: {
      type: Date,
      required: [true, "Report date is required"],
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better query performance
salesSchema.index({ reportDate: 1 })
salesSchema.index({ customerId: 1, reportDate: 1 })
salesSchema.index({ productId: 1, reportDate: 1 })

module.exports = mongoose.model("Sales", salesSchema)
