import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Divider,
} from '@mui/material';

export default function ContactPage() {
  return (
    <Box
      sx={{
        px: 2,
        py: 6,
        backgroundColor: '#eef2f7',
        minHeight: '90vh',
        display: 'flex',
        // alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Card
        sx={{
          maxWidth: 600,
          width: '100%',
          p: 4,
          borderRadius: 3,
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          backgroundColor: '#fff',
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          mb={1}
          color="primary"
        >
          Contact Us
        </Typography>

        <Typography
          variant="subtitle1"
          textAlign="center"
          mb={3}
          color="text.secondary"
        >
          We're here to help you with your shopping experience!
        </Typography>

        <Typography variant="h6" fontWeight="bold" mb={2}>
          Send Us a Message
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Box component="form" noValidate autoComplete="off">
          <TextField
            label="Your Name"
            variant="outlined"
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Your Email"
            variant="outlined"
            fullWidth
            required
            type="email"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Message"
            variant="outlined"
            fullWidth
            required
            multiline
            rows={5}
            sx={{ mb: 3 }}
          />

          <Box textAlign="center">
            <Button
              variant="contained"
              size="large"
              sx={{
                borderRadius: 2,
                px: 5,
                py: 1.5,
                fontWeight: 'bold',
                background: 'linear-gradient(to right, #2196f3, #21cbf3)',
              }}
            >
              Send Message
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
