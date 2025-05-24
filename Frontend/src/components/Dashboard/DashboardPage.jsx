import React from 'react'
import {
  AppBar,
  Box
} from '@mui/material';
import LeftSidebar from './LeftSidebar';
import { Outlet } from 'react-router-dom';

const DashboardPage = () => {
  return (
    <Box sx={{ display: 'flex' }} >
      <Box>
        <LeftSidebar />
      </Box>
      <Box flexGrow={1} p={3}>
        <Outlet />
      </Box>
    </Box>
  )
}

export default DashboardPage