"use client"

import ReactECharts from "echarts-for-react"
import { Card, CardContent, Typography, Box, Skeleton } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { formatCurrency } from "../../utils/formatters"

const TopProductsChart = ({ data, loading = false }) => {
  const theme = useTheme()

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Top Products
          </Typography>
          <Skeleton variant="rectangular" height={300} />
        </CardContent>
      </Card>
    )
  }

  const chartData = (data || []).slice(0, 10)

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: (params) => {
        const data = params[0]
        return `
          <div>
            <strong>${data.name}</strong><br/>
            Revenue: ${formatCurrency(data.value)}<br/>
            Units Sold: ${data.data.totalSold}<br/>
            Orders: ${data.data.totalOrders}
          </div>
        `
      },
    },
    xAxis: {
      type: "value",
      axisLabel: {
        formatter: (value) => formatCurrency(value),
      },
    },
    yAxis: {
      type: "category",
      data: chartData.map((item) => item.name),
      axisLabel: {
        interval: 0,
        formatter: (value) => {
          return value.length > 20 ? value.substring(0, 20) + "..." : value
        },
      },
    },
    series: [
      {
        name: "Revenue",
        type: "bar",
        data: chartData.map((item) => ({
          value: item.totalRevenue,
          totalSold: item.totalSold,
          totalOrders: item.totalOrders,
        })),
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: theme.palette.secondary.main,
              },
              {
                offset: 1,
                color: theme.palette.secondary.light,
              },
            ],
          },
        },
        barWidth: "60%",
      },
    ],
    grid: {
      left: "25%",
      right: "4%",
      bottom: "3%",
      top: "10%",
      containLabel: true,
    },
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Top Products by Revenue
        </Typography>
        <Box sx={{ height: 300 }}>
          <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
        </Box>
      </CardContent>
    </Card>
  )
}

export default TopProductsChart
