'use client'
import { Box } from "@mui/material";
import Link from "next/link";

const NotFound = () => {
  return (
    <Box className='notFound'>
      <div className="child-text">
        <h1>404</h1>
        <h3>Page Not Found</h3>
        <Link href={'/'}>Go to Home Page</Link>
      </div>
    </Box>
  )
};
export default NotFound;