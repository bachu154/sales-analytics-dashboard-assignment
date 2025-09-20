"use client"

import ReactECharts from "echarts-for-react"
import { Card, CardContent, Typography, Box, Skeleton } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { formatCurrency } from "../../utils/formatters"

const RegionChart = ({ data, loading = false }) => {
  const theme = useTheme()

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Sales by Region
          </Typography>
          <Skeleton variant="rectangular" height={300} />
        </CardContent>
      </Card>
    )
  }

  const chartData = data || []

  const option = {
    tooltip: {
      trigger: "item",
      formatter: (params) => {
        return `
          <div>
            <strong>${params.name}</strong><br/>
            Revenue: ${formatCurrency(params.value)}<br/>
            Orders: ${params.data.totalOrders}<br/>
            Customers: ${params.data.uniqueCustomers}<br/>
            Avg Order: ${formatCurrency(params.data.avgOrderValue)}
          </div>
        `
      },
    },
    legend: {
      orient: "vertical",
      left: "left",
      top: "center",
    },
    series: [
      {
        name: "Revenue by Region",
        type: "pie",
        radius: ["40%", "70%"],
        center: ["60%", "50%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: chartData.map((item, index) => ({
          value: item.totalRevenue,
          name: item.region,
          totalOrders: item.totalOrders,
          uniqueCustomers: item.uniqueCustomers,
          avgOrderValue: item.avgOrderValue,
          itemStyle: {
            color: [
              theme.palette.primary.main,
              theme.palette.secondary.main,
              theme.palette.success.main,
              theme.palette.warning.main,
              theme.palette.info.main,
            ][index % 5],
          },
        })),
      },
    ],
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Sales by Region
        </Typography>
        <Box sx={{ height: 300 }}>
          <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
        </Box>
      </CardContent>
    </Card>
  )
}

export default RegionChart
