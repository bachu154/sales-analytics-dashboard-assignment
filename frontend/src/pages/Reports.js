"use client"

import { useState, useEffect } from "react"
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Pagination,
} from "@mui/material"
import { Add as AddIcon, Visibility as ViewIcon, Assessment as ReportIcon } from "@mui/icons-material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import moment from "moment"

// Components
import LoadingSpinner from "../components/LoadingSpinner"
import ErrorMessage from "../components/ErrorMessage"
import StatCard from "../components/StatCard"

// API and utilities
import { analyticsAPI } from "../services/api"
import { formatDateForAPI, formatCurrency, formatDate } from "../utils/formatters"
import { useApiCall } from "../hooks/useApi"

const Reports = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
  })

  // Generate report dialog state
  const [generateDialog, setGenerateDialog] = useState(false)
  const [generateDates, setGenerateDates] = useState({
    startDate: moment().subtract(30, "days"),
    endDate: moment(),
  })

  // View report dialog state
  const [viewDialog, setViewDialog] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)

  const { execute: generateReport, loading: generating } = useApiCall()

  // Fetch reports
  const fetchReports = async (page = 1) => {
    try {
      setLoading(true)
      setError(null)
      const result = await analyticsAPI.getReports(page, 10)
      setReports(result.data.reports)
      setPagination(result.data.pagination)
    } catch (err) {
      setError(err.message || "Failed to fetch reports")
    } finally {
      setLoading(false)
    }
  }

  // Handle generate report
  const handleGenerateReport = async () => {
    try {
      const start = formatDateForAPI(generateDates.startDate)
      const end = formatDateForAPI(generateDates.endDate)

      await generateReport(analyticsAPI.generateReport, start, end)
      setGenerateDialog(false)
      fetchReports() // Refresh the list
    } catch (err) {
      console.error("Failed to generate report:", err)
    }
  }

  // Handle view report
  const handleViewReport = async (reportId) => {
    try {
      const result = await analyticsAPI.getReportById(reportId)
      setSelectedReport(result.data)
      setViewDialog(true)
    } catch (err) {
      console.error("Failed to fetch report details:", err)
    }
  }

  // Handle page change
  const handlePageChange = (event, page) => {
    fetchReports(page)
  }

  // Initial fetch
  useEffect(() => {
    fetchReports()
  }, [])

  if (loading && reports.length === 0) {
    return <LoadingSpinner message="Loading reports..." />
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <div>
            <Typography variant="h4" component="h1" gutterBottom>
              Analytics Reports
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Generate and view saved analytics reports
            </Typography>
          </div>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setGenerateDialog(true)}
            disabled={generating}
          >
            Generate Report
          </Button>
        </Box>

        {error && <ErrorMessage error={error} onRetry={() => fetchReports()} />}
      </Box>

      {/* Reports Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Saved Reports
          </Typography>

          {reports.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <ReportIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No reports found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Generate your first analytics report to get started
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date Range</TableCell>
                      <TableCell>Total Revenue</TableCell>
                      <TableCell>Total Orders</TableCell>
                      <TableCell>Avg Order Value</TableCell>
                      <TableCell>Generated</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report._id} hover>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              {formatDate(report.startDate)} - {formatDate(report.endDate)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{formatCurrency(report.totalRevenue)}</TableCell>
                        <TableCell>{report.totalOrders.toLocaleString()}</TableCell>
                        <TableCell>{formatCurrency(report.avgOrderValue)}</TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(report.createdAt)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Button size="small" startIcon={<ViewIcon />} onClick={() => handleViewReport(report._id)}>
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                  <Pagination
                    count={pagination.pages}
                    page={pagination.current}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Generate Report Dialog */}
      <Dialog open={generateDialog} onClose={() => setGenerateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Generate Analytics Report</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Start Date"
                  value={generateDates.startDate}
                  onChange={(date) => setGenerateDates((prev) => ({ ...prev, startDate: date }))}
                  maxDate={moment()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="End Date"
                  value={generateDates.endDate}
                  onChange={(date) => setGenerateDates((prev) => ({ ...prev, endDate: date }))}
                  maxDate={moment()}
                  minDate={generateDates.startDate}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGenerateDialog(false)}>Cancel</Button>
          <Button
            onClick={handleGenerateReport}
            variant="contained"
            disabled={generating || !generateDates.startDate || !generateDates.endDate}
          >
            {generating ? "Generating..." : "Generate"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Report Dialog */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          Analytics Report -{" "}
          {selectedReport && `${formatDate(selectedReport.startDate)} to ${formatDate(selectedReport.endDate)}`}
        </DialogTitle>
        <DialogContent>
          {selectedReport && (
            <Box sx={{ pt: 2 }}>
              {/* Summary Cards */}
              <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}>
                  <StatCard
                    title="Total Revenue"
                    value={selectedReport.totalRevenue}
                    type="currency"
                    icon={<ReportIcon />}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StatCard title="Total Orders" value={selectedReport.totalOrders} type="number" />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StatCard title="Avg Order Value" value={selectedReport.avgOrderValue} type="currency" />
                </Grid>
              </Grid>

              {/* Top Products */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Top Products
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Product</TableCell>
                          <TableCell align="right">Units Sold</TableCell>
                          <TableCell align="right">Revenue</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedReport.topProducts.map((product) => (
                          <TableRow key={product.productId}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell align="right">{product.totalSold}</TableCell>
                            <TableCell align="right">{formatCurrency(product.revenue)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>

              {/* Top Customers */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Top Customers
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Customer</TableCell>
                          <TableCell align="right">Orders</TableCell>
                          <TableCell align="right">Total Spent</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedReport.topCustomers.map((customer) => (
                          <TableRow key={customer.customerId}>
                            <TableCell>{customer.name}</TableCell>
                            <TableCell align="right">{customer.totalOrders}</TableCell>
                            <TableCell align="right">{formatCurrency(customer.totalSpent)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>

              {/* Region Stats */}
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Region Performance
                      </Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Region</TableCell>
                              <TableCell align="right">Revenue</TableCell>
                              <TableCell align="right">Orders</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {selectedReport.regionWiseStats.map((region) => (
                              <TableRow key={region.region}>
                                <TableCell>{region.region}</TableCell>
                                <TableCell align="right">{formatCurrency(region.totalRevenue)}</TableCell>
                                <TableCell align="right">{region.totalOrders}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Category Performance
                      </Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Category</TableCell>
                              <TableCell align="right">Revenue</TableCell>
                              <TableCell align="right">Orders</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {selectedReport.categoryWiseStats.map((category) => (
                              <TableRow key={category.category}>
                                <TableCell>{category.category}</TableCell>
                                <TableCell align="right">{formatCurrency(category.totalRevenue)}</TableCell>
                                <TableCell align="right">{category.totalOrders}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Reports
