"use client"

import ReactECharts from "echarts-for-react"
import { Card, CardContent, Typography, Box, Skeleton } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { formatCurrency } from "../../utils/formatters"

const RevenueChart = ({ data, loading = false }) => {
  const theme = useTheme()

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Revenue Trend
          </Typography>
          <Skeleton variant="rectangular" height={300} />
        </CardContent>
      </Card>
    )
  }

  const chartData = data?.dailyRevenue || []

  const option = {
    tooltip: {
      trigger: "axis",
      formatter: (params) => {
        const data = params[0]
        return `
          <div>
            <strong>${data.axisValue}</strong><br/>
            Revenue: ${formatCurrency(data.value)}<br/>
            Orders: ${data.data.totalOrders}
          </div>
        `
      },
    },
    xAxis: {
      type: "category",
      data: chartData.map((item) => item._id),
      axisLabel: {
        rotate: 45,
        formatter: (value) => {
          const date = new Date(value)
          return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
        },
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: (value) => formatCurrency(value),
      },
    },
    series: [
      {
        name: "Revenue",
        type: "line",
        data: chartData.map((item) => ({
          value: item.totalRevenue,
          totalOrders: item.totalOrders,
        })),
        smooth: true,
        lineStyle: {
          color: theme.palette.primary.main,
          width: 3,
        },
        itemStyle: {
          color: theme.palette.primary.main,
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: theme.palette.primary.main + "40",
              },
              {
                offset: 1,
                color: theme.palette.primary.main + "10",
              },
            ],
          },
        },
      },
    ],
    grid: {
      left: "3%",
      right: "4%",
      bottom: "15%",
      containLabel: true,
    },
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Revenue Trend
        </Typography>
        <Box sx={{ height: 300 }}>
          <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
        </Box>
      </CardContent>
    </Card>
  )
}

export default RevenueChart
