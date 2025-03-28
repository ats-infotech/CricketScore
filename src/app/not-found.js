'use client'
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";

const Custom404 = () => {
  const router = useRouter()
    return(
      <Box className='notFound'>
        <div className="child-text">
            <h1>404</h1>
            <h3>Page Not Found</h3>
            <a onClick={() => router.push('/')}>Go to Home Page</a>
        </div>
      </Box>
    )
  };
  export default Custom404;