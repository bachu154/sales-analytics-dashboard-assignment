const mongoose = require("mongoose")

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    region: {
      type: String,
      required: [true, "Region is required"],
      enum: ["North", "South", "East", "West", "Central"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Customer type is required"],
      enum: ["Individual", "Business", "Enterprise"],
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
customerSchema.index({ region: 1, type: 1 })

module.exports = mongoose.model("Customer", customerSchema)
