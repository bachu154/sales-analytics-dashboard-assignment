"use client"
import { Alert, AlertTitle, Box, Button } from "@mui/material"
import { Refresh as RefreshIcon } from "@mui/icons-material"

const ErrorMessage = ({ error, onRetry }) => {
  return (
    <Box sx={{ my: 2 }}>
      <Alert
        severity="error"
        action={
          onRetry && (
            <Button color="inherit" size="small" onClick={onRetry} startIcon={<RefreshIcon />}>
              Retry
            </Button>
          )
        }
      >
        <AlertTitle>Error</AlertTitle>
        {error || "Something went wrong. Please try again."}
      </Alert>
    </Box>
  )
}

export default ErrorMessage
