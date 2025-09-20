const axios = require("axios")
const moment = require("moment")

// Test script to verify API endpoints
const API_BASE = "http://localhost:5000/api"

const testEndpoints = async () => {
  try {
    console.log("🧪 Testing API endpoints...\n")

    const startDate = moment().subtract(30, "days").format("YYYY-MM-DD")
    const endDate = moment().format("YYYY-MM-DD")

    // Test health endpoint
    console.log("1. Testing health endpoint...")
    const health = await axios.get(`${API_BASE}/health`)
    console.log("✅ Health check:", health.data.message)

    // Test revenue endpoint
    console.log("\n2. Testing revenue endpoint...")
    const revenue = await axios.get(`${API_BASE}/revenue?startDate=${startDate}&endDate=${endDate}`)
    console.log("✅ Revenue data:", {
      totalRevenue: revenue.data.data.summary.totalRevenue,
      totalOrders: revenue.data.data.summary.totalOrders,
      dailyRecords: revenue.data.data.dailyRevenue.length,
    })

    // Test top products endpoint
    console.log("\n3. Testing top products endpoint...")
    const products = await axios.get(`${API_BASE}/top-products?startDate=${startDate}&endDate=${endDate}&limit=5`)
    console.log("✅ Top products:", products.data.data.length, "products found")

    // Test top customers endpoint
    console.log("\n4. Testing top customers endpoint...")
    const customers = await axios.get(`${API_BASE}/top-customers?startDate=${startDate}&endDate=${endDate}&limit=5`)
    console.log("✅ Top customers:", customers.data.data.length, "customers found")

    // Test region stats endpoint
    console.log("\n5. Testing region stats endpoint...")
    const regions = await axios.get(`${API_BASE}/region-stats?startDate=${startDate}&endDate=${endDate}`)
    console.log("✅ Region stats:", regions.data.data.length, "regions found")

    // Test category stats endpoint
    console.log("\n6. Testing category stats endpoint...")
    const categories = await axios.get(`${API_BASE}/category-stats?startDate=${startDate}&endDate=${endDate}`)
    console.log("✅ Category stats:", categories.data.data.length, "categories found")

    // Test generate report endpoint
    console.log("\n7. Testing generate report endpoint...")
    const report = await axios.post(`${API_BASE}/reports`, {
      startDate,
      endDate,
    })
    console.log("✅ Report generated:", report.data.data._id)

    // Test get reports endpoint
    console.log("\n8. Testing get reports endpoint...")
    const reports = await axios.get(`${API_BASE}/reports?page=1&limit=5`)
    console.log("✅ Reports list:", reports.data.data.reports.length, "reports found")

    console.log("\n🎉 All API endpoints are working correctly!")
  } catch (error) {
    console.error("❌ API test failed:", error.response?.data || error.message)
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testEndpoints()
}

module.exports = { testEndpoints }
