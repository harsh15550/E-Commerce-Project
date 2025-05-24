import React from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Avatar,
    Divider,
    useTheme,
    Slide,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

const AboutPage = () => {
    const theme = useTheme();

    const features = [
        {
            icon: <ShoppingCartIcon fontSize="large" color="primary" />,
            title: 'Seamless Shopping',
            desc: 'We deliver a smooth and secure shopping experience to all our customers.',
        },
        {
            icon: <LocalShippingIcon fontSize="large" color="secondary" />,
            title: 'Fast Delivery',
            desc: 'With our logistics partners, your orders reach your doorstep quickly.',
        },
        {
            icon: <VerifiedUserIcon fontSize="large" color="success" />,
            title: 'Trusted by Thousands',
            desc: 'We’re trusted by thousands of happy customers across the country.',
        },
    ];

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            {/* Header */}
            <Box textAlign="center" mb={6}>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                    About Our Store
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Quality products, unbeatable prices, and a passion for customer satisfaction.
                </Typography>
                <Divider sx={{ width: 100, mx: 'auto', mt: 2, borderColor: theme.palette.primary.main }} />
            </Box>

            {/* Founder Section */}
            <Box
                display="flex"
                flexDirection={{ xs: 'column', md: 'row' }}
                alignItems="center"
                justifyContent="center"
                gap={4}
                mb={8}
            >
                <Avatar
                    src="https://i.pinimg.com/736x/4e/1f/7f/4e1f7f4efc8548810df17d78268df586.jpg"
                    sx={{
                        width: 130,
                        height: 130,
                        border: `3px solid ${theme.palette.primary.main}`,
                        boxShadow: 4,
                    }}
                />
                <Box textAlign={{ xs: 'center', md: 'left' }}>
                    <Typography variant="h5" fontWeight="bold">
                        Harsh Sharma
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Founder & CEO
                    </Typography>
                    <Typography mt={1} color="text.secondary">
                        Our vision is to provide a premium shopping experience, combining quality, affordability,
                        and exceptional service.
                    </Typography>
                </Box>
            </Box>

            {/* Feature Cards */}
            <Grid container spacing={4}>
                {features.map((item, index) => (
                    <Slide direction="up" in={true} timeout={500 + index * 200} key={index}>
                        <Grid sx={{display:'flex'}}>
                            <Card
                                sx={{
                                    p: 3,
                                    textAlign: 'center',
                                    height: '100%',
                                    width:'300px',
                                    borderRadius: 4,
                                    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.05)',
                                    background: 'linear-gradient(135deg, #ffffff, #f8f9fa)',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-8px) scale(1.02)',
                                        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: 60,
                                        height: 60,
                                        mx: 'auto',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #e0f7fa, #e1bee7)',
                                        mb: 2,
                                    }}
                                >
                                    {item.icon}
                                </Box>
                                <Typography variant="h6" fontWeight="bold" mt={1}>
                                    {item.title}
                                </Typography>
                                <Typography color="text.secondary" mt={1}>
                                    {item.desc}
                                </Typography>
                            </Card>

                        </Grid>
                    </Slide>
                ))}
            </Grid>
        </Container>
    );
};

export default AboutPage;
