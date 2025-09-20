"use client"

import { useState, useEffect } from "react"
import { Grid, Container, Typography, Box } from "@mui/material"
import { AttachMoney as RevenueIcon, ShoppingCart as OrdersIcon, TrendingUp as AvgIcon } from "@mui/icons-material"
import moment from "moment"

// Components
import DateRangePicker from "../components/DateRangePicker"
import StatCard from "../components/StatCard"
import RevenueChart from "../components/charts/RevenueChart"
import TopProductsChart from "../components/charts/TopProductsChart"
import RegionChart from "../components/charts/RegionChart"
import CategoryChart from "../components/charts/CategoryChart"
import TopCustomersTable from "../components/TopCustomersTable"
import ErrorMessage from "../components/ErrorMessage"

// API and utilities
import { analyticsAPI } from "../services/api"
import { formatDateForAPI } from "../utils/formatters"

const Dashboard = () => {
  // State management
  const [dateRange, setDateRange] = useState({
    startDate: moment().subtract(30, "days"),
    endDate: moment(),
  })

  const [data, setData] = useState({
    revenue: null,
    topProducts: null,
    topCustomers: null,
    regionStats: null,
    categoryStats: null,
  })

  const [loading, setLoading] = useState({
    revenue: true,
    topProducts: true,
    topCustomers: true,
    regionStats: true,
    categoryStats: true,
  })

  const [errors, setErrors] = useState({})

  // Fetch all dashboard data
  const fetchDashboardData = async (startDate, endDate) => {
    const start = formatDateForAPI(startDate)
    const end = formatDateForAPI(endDate)

    // Reset loading states
    setLoading({
      revenue: true,
      topProducts: true,
      topCustomers: true,
      regionStats: true,
      categoryStats: true,
    })

    setErrors({})

    // Fetch all data concurrently
    const promises = [
      analyticsAPI.getRevenue(start, end).catch((err) => ({ error: err, type: "revenue" })),
      analyticsAPI.getTopProducts(start, end, 10).catch((err) => ({ error: err, type: "topProducts" })),
      analyticsAPI.getTopCustomers(start, end, 10).catch((err) => ({ error: err, type: "topCustomers" })),
      analyticsAPI.getRegionStats(start, end).catch((err) => ({ error: err, type: "regionStats" })),
      analyticsAPI.getCategoryStats(start, end).catch((err) => ({ error: err, type: "categoryStats" })),
    ]

    const results = await Promise.allSettled(promises)

    // Process results
    const newData = { ...data }
    const newErrors = {}

    results.forEach((result, index) => {
      const types = ["revenue", "topProducts", "topCustomers", "regionStats", "categoryStats"]
      const type = types[index]

      if (result.status === "fulfilled") {
        const value = result.value
        if (value.error) {
          newErrors[type] = value.error.message || "An error occurred"
        } else {
          newData[type] = value.data
        }
      } else {
        newErrors[type] = result.reason?.message || "An error occurred"
      }

      setLoading((prev) => ({ ...prev, [type]: false }))
    })

    setData(newData)
    setErrors(newErrors)
  }

  // Handle date range change
  const handleDateChange = (startDate, endDate) => {
    setDateRange({ startDate, endDate })
    fetchDashboardData(startDate, endDate)
  }

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData(dateRange.startDate, dateRange.endDate)
  }, [])

  // Retry function for individual components
  const retryFetch = (type) => {
    setLoading((prev) => ({ ...prev, [type]: true }))
    setErrors((prev) => ({ ...prev, [type]: null }))

    const start = formatDateForAPI(dateRange.startDate)
    const end = formatDateForAPI(dateRange.endDate)

    let apiCall
    switch (type) {
      case "revenue":
        apiCall = analyticsAPI.getRevenue(start, end)
        break
      case "topProducts":
        apiCall = analyticsAPI.getTopProducts(start, end, 10)
        break
      case "topCustomers":
        apiCall = analyticsAPI.getTopCustomers(start, end, 10)
        break
      case "regionStats":
        apiCall = analyticsAPI.getRegionStats(start, end)
        break
      case "categoryStats":
        apiCall = analyticsAPI.getCategoryStats(start, end)
        break
      default:
        return
    }

    apiCall
      .then((result) => {
        setData((prev) => ({ ...prev, [type]: result.data }))
      })
      .catch((err) => {
        setErrors((prev) => ({ ...prev, [type]: err.message || "An error occurred" }))
      })
      .finally(() => {
        setLoading((prev) => ({ ...prev, [type]: false }))
      })
  }

  const isAnyLoading = Object.values(loading).some((l) => l)

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Sales Analytics Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor your sales performance and key metrics
        </Typography>
      </Box>

      {/* Date Range Picker */}
      <DateRangePicker
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
        onDateChange={handleDateChange}
        loading={isAnyLoading}
      />

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          {errors.revenue ? (
            <ErrorMessage error={errors.revenue} onRetry={() => retryFetch("revenue")} />
          ) : (
            <StatCard
              title="Total Revenue"
              value={data.revenue?.summary?.totalRevenue}
              icon={<RevenueIcon />}
              loading={loading.revenue}
              type="currency"
            />
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          {errors.revenue ? (
            <ErrorMessage error={errors.revenue} onRetry={() => retryFetch("revenue")} />
          ) : (
            <StatCard
              title="Total Orders"
              value={data.revenue?.summary?.totalOrders}
              icon={<OrdersIcon />}
              loading={loading.revenue}
              type="number"
            />
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          {errors.revenue ? (
            <ErrorMessage error={errors.revenue} onRetry={() => retryFetch("revenue")} />
          ) : (
            <StatCard
              title="Avg Order Value"
              value={data.revenue?.summary?.avgOrderValue}
              icon={<AvgIcon />}
              loading={loading.revenue}
              type="currency"
            />
          )}
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Revenue Chart */}
        <Grid item xs={12} lg={8}>
          {errors.revenue ? (
            <ErrorMessage error={errors.revenue} onRetry={() => retryFetch("revenue")} />
          ) : (
            <RevenueChart data={data.revenue} loading={loading.revenue} />
          )}
        </Grid>

        {/* Region Chart */}
        <Grid item xs={12} lg={4}>
          {errors.regionStats ? (
            <ErrorMessage error={errors.regionStats} onRetry={() => retryFetch("regionStats")} />
          ) : (
            <RegionChart data={data.regionStats} loading={loading.regionStats} />
          )}
        </Grid>

        {/* Top Products Chart */}
        <Grid item xs={12} lg={6}>
          {errors.topProducts ? (
            <ErrorMessage error={errors.topProducts} onRetry={() => retryFetch("topProducts")} />
          ) : (
            <TopProductsChart data={data.topProducts} loading={loading.topProducts} />
          )}
        </Grid>

        {/* Category Chart */}
        <Grid item xs={12} lg={6}>
          {errors.categoryStats ? (
            <ErrorMessage error={errors.categoryStats} onRetry={() => retryFetch("categoryStats")} />
          ) : (
            <CategoryChart data={data.categoryStats} loading={loading.categoryStats} />
          )}
        </Grid>

        {/* Top Customers Table */}
        <Grid item xs={12}>
          {errors.topCustomers ? (
            <ErrorMessage error={errors.topCustomers} onRetry={() => retryFetch("topCustomers")} />
          ) : (
            <TopCustomersTable data={data.topCustomers} loading={loading.topCustomers} />
          )}
        </Grid>
      </Grid>
    </Container>
  )
}

export default Dashboard
