'use client'
import SvgDefs from "@/assets/icons/icons";
import { pathsToHideFooter } from "@/components/common/json/FooterJson";
import Reduxprovider from "@/redux/ReduxProvider";
import { Box } from "@mui/material";
import { ThemeProvider } from '@mui/material/styles';
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Footer } from "../components/common/commonUi/Footer/Footer";
import { theme } from "../components/common/theme";
import "./globals.css";
// import Head from "next/head";

export default function RootLayout({ children }) {

  const [shouldHideFooter, setShouldHideFooter] = useState(false);
  const params = useParams()

  useEffect(() => {
    UpdatePath()
  }, [params]);

  const UpdatePath = () => {
    const path = window.location.pathname;
    const shouldHide = pathsToHideFooter.some((p) => path.includes(p));
    setShouldHideFooter(shouldHide);
  }

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <SvgDefs />
        <ThemeProvider theme={theme}>
          <Reduxprovider>
            <Box className='mobile-container'>
              <Box className={!shouldHideFooter && 'main-container'} id='mainContainer'>
                {children}
              </Box>
              {!shouldHideFooter && <Footer />}
            </Box>
          </Reduxprovider>
        </ThemeProvider>
      </body>
    </html>
  );
}
