import { Box } from '@mui/material'
import HeaderCarousel from './HeaderCarousel'
import Categories from './Categories'
import CategoryWiseProducts from './CategoryWiseProducts'
import SubscriptionSection from './SubscriptionSection '

const Home = () => {
  return (
    <Box sx={{ml:'100px' , mr:'100px' , mt:'50px'}} >
      <HeaderCarousel />
      <Categories />
      <CategoryWiseProducts />
      <SubscriptionSection />
    </Box>
  )
}

export default Home