import React from 'react'
import {
  AppBar,
  Box
} from '@mui/material';
import LeftSidebar from './LeftSidebar';
import { Outlet } from 'react-router-dom';

const DashboardPage = () => {
  return (
    <Box sx={{ display: 'flex' }}>
  <Sidebar />
  <Box sx={{ flexGrow: 1, p: 2 }}> {/* Content area */}
    <Outlet /> {/* This is where <Orders /> will be rendered */}
  </Box>
</Box>

  )
}

export default DashboardPage