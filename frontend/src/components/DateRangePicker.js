"use client"

import { useState } from "react"
import { Box, Button, Paper, Typography } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { CalendarToday as CalendarIcon } from "@mui/icons-material"
import moment from "moment"

const DateRangePicker = ({ startDate, endDate, onDateChange, loading = false }) => {
  const [tempStartDate, setTempStartDate] = useState(startDate)
  const [tempEndDate, setTempEndDate] = useState(endDate)

  const handleApply = () => {
    if (tempStartDate && tempEndDate) {
      onDateChange(tempStartDate, tempEndDate)
    }
  }

  const handleQuickSelect = (days) => {
    const end = moment()
    const start = moment().subtract(days, "days")
    setTempStartDate(start)
    setTempEndDate(end)
    onDateChange(start, end)
  }

  const quickSelectOptions = [
    { label: "Last 7 Days", days: 7 },
    { label: "Last 30 Days", days: 30 },
    { label: "Last 90 Days", days: 90 },
    { label: "Last Year", days: 365 },
  ]

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <CalendarIcon sx={{ mr: 1, color: "primary.main" }} />
        <Typography variant="h6">Date Range</Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          alignItems: { md: "center" },
        }}
      >
        <DatePicker
          label="Start Date"
          value={tempStartDate}
          onChange={setTempStartDate}
          maxDate={moment()}
          slotProps={{
            textField: {
              size: "small",
              sx: { minWidth: 150 },
            },
          }}
        />

        <DatePicker
          label="End Date"
          value={tempEndDate}
          onChange={setTempEndDate}
          maxDate={moment()}
          minDate={tempStartDate}
          slotProps={{
            textField: {
              size: "small",
              sx: { minWidth: 150 },
            },
          }}
        />

        <Button
          variant="contained"
          onClick={handleApply}
          disabled={!tempStartDate || !tempEndDate || loading}
          sx={{ minWidth: 100 }}
        >
          Apply
        </Button>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
        {quickSelectOptions.map((option) => (
          <Button
            key={option.days}
            variant="outlined"
            size="small"
            onClick={() => handleQuickSelect(option.days)}
            disabled={loading}
          >
            {option.label}
          </Button>
        ))}
      </Box>
    </Paper>
  )
}

export default DateRangePicker
