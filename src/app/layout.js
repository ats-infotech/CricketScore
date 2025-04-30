'use client'
import SvgDefs from "@/assets/icons/icons";
import Reduxprovider from "@/redux/ReduxProvider";
import { persistor, store } from "@/redux/store";
import { Box } from "@mui/material";
import { ThemeProvider } from '@mui/material/styles';
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Footer } from "../components/common/commonUi/Footer/Footer";
import { theme } from "../components/common/theme";
import "./globals.css";

export default function RootLayout({ children }) {

  const [shouldHideFooter, setShouldHideFooter] = useState(false);
  const [shouldHide, setShouldHide] = useState(false);
  const params = useParams()

  useEffect(() => {
    UpdatePath()
  }, [params]);


  const UpdatePath = () => {
    const path = window.location.pathname;
    const pathsToHideFooter = ['/toss', '/player11', '/scoreboard', '/playerboard', '/players/', '/creatematch', '/automatchschedule', '/registeredTornaments', '/edit-match', '/edit-tournament', '/teams/', '/login', '/create-auction-player', '/live-auction/', '/live-auction-view/'];
    const pathsForHide = ['/mytournament', '/tournament'];
    const shouldHide = pathsToHideFooter.some((p) => path.includes(p));
    const shouldHidePad = pathsForHide.some((p) => path.includes(p));
    setShouldHide(shouldHidePad)
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
          <Reduxprovider store={store} persistor={persistor}>
            <Box sx={{
              background: 'var(--background-forever) !important',
              color: 'var(--primary-color)',
              minHeight: '100vh',
              maxWidth: 'var(--screen-max-width)',
              margin: '0 auto'
            }}>
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
