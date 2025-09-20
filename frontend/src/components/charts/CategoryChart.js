"use client"

import ReactECharts from "echarts-for-react"
import { Card, CardContent, Typography, Box, Skeleton } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { formatCurrency } from "../../utils/formatters"

const CategoryChart = ({ data, loading = false }) => {
  const theme = useTheme()

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Sales by Category
          </Typography>
          <Skeleton variant="rectangular" height={300} />
        </CardContent>
      </Card>
    )
  }

  const chartData = data || []

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
            Orders: ${data.data.totalOrders}<br/>
            Quantity: ${data.data.totalQuantity}<br/>
            Products: ${data.data.uniqueProducts}
          </div>
        `
      },
    },
    xAxis: {
      type: "category",
      data: chartData.map((item) => item.category),
      axisLabel: {
        rotate: 45,
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
        type: "bar",
        data: chartData.map((item) => ({
          value: item.totalRevenue,
          totalOrders: item.totalOrders,
          totalQuantity: item.totalQuantity,
          uniqueProducts: item.uniqueProducts,
        })),
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: theme.palette.info.main,
              },
              {
                offset: 1,
                color: theme.palette.info.light,
              },
            ],
          },
        },
        barWidth: "60%",
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
          Sales by Category
        </Typography>
        <Box sx={{ height: 300 }}>
          <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
        </Box>
      </CardContent>
    </Card>
  )
}

export default CategoryChart
