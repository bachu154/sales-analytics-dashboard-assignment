"use client"

import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Skeleton,
  Box,
} from "@mui/material"
import { formatCurrency } from "../utils/formatters"

const TopCustomersTable = ({ data, loading = false }) => {
  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Top Customers
          </Typography>
          <Box>
            {[...Array(5)].map((_, index) => (
              <Box key={index} sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Skeleton variant="text" width="30%" />
                <Skeleton variant="text" width="20%" />
                <Skeleton variant="text" width="25%" />
                <Skeleton variant="text" width="25%" />
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    )
  }

  const customers = data || []

  const getTypeColor = (type) => {
    switch (type) {
      case "Enterprise":
        return "primary"
      case "Business":
        return "secondary"
      case "Individual":
        return "default"
      default:
        return "default"
    }
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Top Customers
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Customer</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Region</TableCell>
                <TableCell align="right">Orders</TableCell>
                <TableCell align="right">Total Spent</TableCell>
                <TableCell align="right">Avg Order</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer, index) => (
                <TableRow key={customer._id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {customer.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={customer.type} size="small" color={getTypeColor(customer.type)} />
                  </TableCell>
                  <TableCell>{customer.region}</TableCell>
                  <TableCell align="right">{customer.totalOrders}</TableCell>
                  <TableCell align="right">{formatCurrency(customer.totalSpent)}</TableCell>
                  <TableCell align="right">{formatCurrency(customer.avgOrderValue)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

export default TopCustomersTable
