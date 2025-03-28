import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    components: {
      MuiButton: {
        defaultProps: {
          disableRipple: true,
        },
      },
      MuiTab: {
        defaultProps: {
          disableRipple: true,
        },
      },
      MuiListItemButton: {
        defaultProps: {
          disableRipple: true,
        },
      },
      MuiIconButton: {
        defaultProps: {
          disableRipple: true,
        },
      },
      MuiFab: {
        defaultProps: {
          disableRipple: true,
        },
      },
      MuiCardActionArea: {
        defaultProps: {
          disableRipple: true,
        },
      },
      MuiCheckbox: {
        defaultProps: {
          disableRipple: true,
        },
      },
      MuiRadio: {
        defaultProps: {
          disableRipple: true,
        },
      },
      MuiSwitch: {
        defaultProps: {
          disableRipple: true,
        },
      },
    },
  });