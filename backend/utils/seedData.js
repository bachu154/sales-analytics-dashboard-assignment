const mongoose = require("mongoose")
const faker = require("faker")
const moment = require("moment")
const dotenv = require("dotenv")

// Load environment variables
dotenv.config()

// Import models
const Customer = require("../models/Customer")
const Product = require("../models/Product")
const Sales = require("../models/Sales")

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/sales_analytics", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("Connected to MongoDB for seeding")
  } catch (error) {
    console.error("MongoDB connection error:", error)
    process.exit(1)
  }
}

// Clear existing data
const clearData = async () => {
  try {
    await Customer.deleteMany({})
    await Product.deleteMany({})
    await Sales.deleteMany({})
    console.log("Cleared existing data")
  } catch (error) {
    console.error("Error clearing data:", error)
  }
}

// Seed customers
const seedCustomers = async () => {
  const customers = []
  const regions = ["North", "South", "East", "West", "Central"]
  const types = ["Individual", "Business", "Enterprise"]

  for (let i = 0; i < 100; i++) {
    customers.push({
      name: faker.company.companyName(),
      region: regions[Math.floor(Math.random() * regions.length)],
      type: types[Math.floor(Math.random() * types.length)],
    })
  }

  try {
    const createdCustomers = await Customer.insertMany(customers)
    console.log(`Created ${createdCustomers.length} customers`)
    return createdCustomers
  } catch (error) {
    console.error("Error seeding customers:", error)
    return []
  }
}

// Seed products
const seedProducts = async () => {
  const products = []
  const categories = ["Electronics", "Clothing", "Books", "Home", "Sports", "Beauty"]

  for (let i = 0; i < 50; i++) {
    products.push({
      name: faker.commerce.productName(),
      category: categories[Math.floor(Math.random() * categories.length)],
      price: Number.parseFloat(faker.commerce.price(10, 1000, 2)),
    })
  }

  try {
    const createdProducts = await Product.insertMany(products)
    console.log(`Created ${createdProducts.length} products`)
    return createdProducts
  } catch (error) {
    console.error("Error seeding products:", error)
    return []
  }
}

// Seed sales data for 2 years
const seedSales = async (customers, products) => {
  const sales = []
  const startDate = moment().subtract(2, "years")
  const endDate = moment()

  // Generate sales data for each day in the 2-year period
  for (let date = startDate.clone(); date.isBefore(endDate); date.add(1, "day")) {
    // Generate 5-20 sales per day
    const dailySales = Math.floor(Math.random() * 16) + 5

    for (let i = 0; i < dailySales; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)]
      const product = products[Math.floor(Math.random() * products.length)]
      const quantity = Math.floor(Math.random() * 10) + 1
      const totalRevenue = product.price * quantity

      sales.push({
        customerId: customer._id,
        productId: product._id,
        quantity,
        totalRevenue,
        reportDate: date.toDate(),
      })
    }
  }

  try {
    // Insert in batches to avoid memory issues
    const batchSize = 1000
    let insertedCount = 0

    for (let i = 0; i < sales.length; i += batchSize) {
      const batch = sales.slice(i, i + batchSize)
      await Sales.insertMany(batch)
      insertedCount += batch.length
      console.log(`Inserted ${insertedCount}/${sales.length} sales records`)
    }

    console.log(`Created ${sales.length} sales records`)
    return sales
  } catch (error) {
    console.error("Error seeding sales:", error)
    return []
  }
}

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log("Starting database seeding...")

    await connectDB()
    await clearData()

    console.log("Seeding customers...")
    const customers = await seedCustomers()

    console.log("Seeding products...")
    const products = await seedProducts()

    console.log("Seeding sales data (this may take a while)...")
    await seedSales(customers, products)

    console.log("Database seeding completed successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Error during seeding:", error)
    process.exit(1)
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
}

module.exports = { seedDatabase }
