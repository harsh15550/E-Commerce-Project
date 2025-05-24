import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn, YouTube } from '@mui/icons-material';
import Logo from '../assets/Logo.png';

export default function Footer() {
  return (
    <Box sx={{ bgcolor: '#f5f5f5', py: 4, mt: 5 }}>
      {/* <Container maxWidth="lg"> */}
        <Grid container spacing={4} justifyContent="space-around" sx={{mr:'80px', ml:'80px'}} columns={{ xs: 12, sm: 12, md: 12 }}>
          {/* Logo Section */}
          <Grid  gridColumn={{ xs: 'span 12', sm: 'span 4', md: 'span 2' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              <img src={Logo} alt="" style={{height:'60px'}} />
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Company description or tagline goes here. Short and crisp.
            </Typography>
          </Grid>

          {/* Information Section */}
          <Grid  gridColumn={{ xs: 'span 12', sm: 'span 4', md: 'span 2' }}>
            <Typography variant="h6" gutterBottom>
              Information
            </Typography>
            <Box>
              <Link href="#" color="inherit" sx={{ display: 'block', mb: 1, textDecoration: 'none' }}>About Us</Link>
              <Link href="#" color="inherit" sx={{ display: 'block', mb: 1, textDecoration: 'none' }}>Careers</Link>
              <Link href="#" color="inherit" sx={{ display: 'block', mb: 1, textDecoration: 'none' }}>Terms & Conditions</Link>
              <Link href="#" color="inherit" sx={{ display: 'block', mb: 1, textDecoration: 'none' }}>Privacy Policy</Link>
            </Box>
          </Grid>

          {/* Helpful Links Section */}
          <Grid  gridColumn={{ xs: 'span 12', sm: 'span 4', md: 'span 2' }}>
            <Typography variant="h6" gutterBottom>
              Helpful Links
            </Typography>
            <Box>
              <Link href="#" color="inherit" sx={{ display: 'block', mb: 1, textDecoration: 'none' }}>FAQs</Link>
              <Link href="#" color="inherit" sx={{ display: 'block', mb: 1, textDecoration: 'none' }}>Shipping Info</Link>
              <Link href="#" color="inherit" sx={{ display: 'block', mb: 1, textDecoration: 'none' }}>Returns</Link>
              <Link href="#" color="inherit" sx={{ display: 'block', mb: 1, textDecoration: 'none' }}>Support</Link>
            </Box>
          </Grid>

          {/* Our Services Section */}
          <Grid  gridColumn={{ xs: 'span 12', sm: 'span 4', md: 'span 2' }}>
            <Typography variant="h6" gutterBottom>
              Our Services
            </Typography>
            <Box>
              <Link href="#" color="inherit" sx={{ display: 'block', mb: 1, textDecoration: 'none' }}>Web Development</Link>
              <Link href="#" color="inherit" sx={{ display: 'block', mb: 1, textDecoration: 'none' }}>Mobile App Development</Link>
              <Link href="#" color="inherit" sx={{ display: 'block', mb: 1, textDecoration: 'none' }}>SEO Services</Link>
              <Link href="#" color="inherit" sx={{ display: 'block', mb: 1, textDecoration: 'none' }}>Digital Marketing</Link>
            </Box>
          </Grid>

          {/* Contact Us Section */}
          <Grid  gridColumn={{ xs: 'span 12', sm: 'span 4', md: 'span 2' }}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Box>
              <Link href="mailto:info@company.com" color="inherit" sx={{ display: 'block', mb: 1, textDecoration: 'none' }}>Email: info@company.com</Link>
              <Link href="tel:+1234567890" color="inherit" sx={{ display: 'block', mb: 1, textDecoration: 'none' }}>Phone: +123 456 7890</Link>
              <Link href="#" color="inherit" sx={{ display: 'block', mb: 1, textDecoration: 'none' }}>Address: 123 Company St.</Link>
            </Box>
          </Grid>
        </Grid>

        {/* Social Media Icons */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <IconButton color="inherit" href="#" sx={{ mr: 2 }}><Facebook /></IconButton>
          <IconButton color="inherit" href="#" sx={{ mr: 2 }}><Twitter /></IconButton>
          <IconButton color="inherit" href="#" sx={{ mr: 2 }}><Instagram /></IconButton>
          <IconButton color="inherit" href="#" sx={{ mr: 2 }}><LinkedIn /></IconButton>
          <IconButton color="inherit" href="#" sx={{ mr: 2 }}><YouTube /></IconButton>
        </Box>

        {/* Copyright */}
        <Typography variant="body2" align="center" sx={{ mt: 4 }}>
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </Typography>
      {/* </Container> */}
    </Box>
  );
}
