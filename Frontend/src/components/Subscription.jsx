import React from "react";
import { Box, Typography, TextField, Button, Container } from "@mui/material";

export default function Subscription() {
  return (
    <Box sx={{ backgroundColor: "#f5f5f5", py: 6 , mt:5 }}>
      <Container maxWidth="sm">
        <Typography variant="h5" align="center" gutterBottom>
          Subscribe to our Newsletter
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" gutterBottom>
          Get updates about latest products, deals and discounts directly in your inbox.
        </Typography>

        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mt: 3,
            justifyContent: "center",
          }}
        >
          <TextField
            fullWidth
            type="email"
            label="Enter your email"
            variant="outlined"
            required
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ px: 4, py: 1.5 }}
          >
            Subscribe
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
