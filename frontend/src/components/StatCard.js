"use client"

import { Card, CardContent, Typography, Box, Skeleton } from "@mui/material"
import { TrendingUp, TrendingDown } from "@mui/icons-material"
import { formatCurrency, formatNumber, getValueColor } from "../utils/formatters"
import { useTheme } from "@mui/material/styles"

const StatCard = ({ title, value, change, changeLabel, icon, loading = false, type = "currency" }) => {
  const theme = useTheme()

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Skeleton variant="text" width={120} />
            <Skeleton variant="circular" width={40} height={40} />
          </Box>
          <Skeleton variant="text" width={100} height={32} />
          <Skeleton variant="text" width={80} />
        </CardContent>
      </Card>
    )
  }

  const formatValue = (val) => {
    switch (type) {
      case "currency":
        return formatCurrency(val)
      case "number":
        return formatNumber(val)
      case "percentage":
        return `${val?.toFixed(1) || 0}%`
      default:
        return val?.toString() || "0"
    }
  }

  const changeColor = getValueColor(change, theme)
  const TrendIcon = change >= 0 ? TrendingUp : TrendingDown

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Typography color="text.secondary" variant="body2">
            {title}
          </Typography>
          {icon && (
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                backgroundColor: theme.palette.primary.main + "20",
                color: theme.palette.primary.main,
              }}
            >
              {icon}
            </Box>
          )}
        </Box>

        <Typography variant="h4" component="div" sx={{ mb: 1, fontWeight: 600 }}>
          {formatValue(value)}
        </Typography>

        {change !== undefined && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <TrendIcon sx={{ fontSize: 16, color: changeColor }} />
            <Typography variant="body2" sx={{ color: changeColor }}>
              {Math.abs(change).toFixed(1)}%
            </Typography>
            {changeLabel && (
              <Typography variant="body2" color="text.secondary">
                {changeLabel}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default StatCard
