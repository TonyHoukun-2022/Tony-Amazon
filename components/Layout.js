import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import { AppBar, Toolbar, Typography, Container, Link, Switch, Badge, Button, Menu, MenuItem, Box, IconButton, Drawer, List, ListItem, Divider, ListItemText, InputBase } from '@mui/material'
import { styled } from '@mui/material/styles'
import classes from '../utils/classes'
import MenuIcon from '@mui/icons-material/Menu'
import { useContext, useEffect, useState } from 'react'
import { Store } from '../utils/store'
import Cookies from 'js-cookie'

const NavBarBtn = styled(Button)(() => ({
  color: '#fff',
  textTransform: 'initial',
}))

export default function Layout({ children, title, description }) {
  const router = useRouter()
  const { state, dispatch } = useContext(Store)
  const { darkMode, cart, userInfo } = state
  const [mode, setMode] = useState(false)
  useEffect(() => setMode(darkMode), [darkMode])
  //mui theme
  const theme = createTheme({
    typography: {
      h1: {
        fontSize: '1.6rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
      h2: {
        fontSize: '1.4rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
    },
    //define colors
    palette: {
      //component background (for mui comp that not have specified bg style)
      mode: mode ? 'dark' : 'light',
      primary: {
        main: '#f0c000',
      },
      secondary: {
        main: '#208080',
      },
      third: {
        main: 'rgba(0,0,0,0.38)',
      },
    },
  })

  const darkModeHandler = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' })
    //store darkmode to cookie, then darkmode will not change after page refresh
    const currentDarkMode = !darkMode //darkMode is from last state
    Cookies.set('darkMode', currentDarkMode ? 'ON' : 'OFF')
  }

  //setups for mui menu
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const loginClickHandler = (e) => {
    setAnchorEl(e.currentTarget)
  }
  const loginMenuCloseHandler = () => {
    setAnchorEl(null)
  }
  const logoutClickHandler = () => {
    setAnchorEl(null)
    dispatch({ type: 'USER_LOGOUT' })
    Cookies.remove('userInfo')
    Cookies.remove('cartItems')
    router.push('/')
  }

  return (
    <>
      <Head>
        <title>{title ? `${title} - Next Amazon` : `Next Amazon`}</title>
        {description && <meta name='description' content={description}></meta>}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position='static' sx={classes.appbar}>
          <Toolbar sx={classes.toolbar}>
            <Box display='flex' alignItems='center'>
              <IconButton
                edge='start'
                aria-label='open drawer'
                // onClick={sidebarOpenHandler}
                sx={classes.menuButton}
              >
                <MenuIcon sx={classes.navbarButton} />
              </IconButton>
              <NextLink href='/' passHref>
                <Link>
                  <Typography sx={classes.brand}>amazona</Typography>
                </Link>
              </NextLink>
            </Box>
            <Box display='flex' alignItems='center'>
              <Switch checked={darkMode} onChange={darkModeHandler} color='secondary'></Switch>
              <NextLink href='/cart' passHref>
                <Link>
                  {cart.cartItems.length > 0 ? (
                    <Badge color='secondary' badgeContent={cart.cartItems.length}>
                      Cart
                    </Badge>
                  ) : (
                    'Cart'
                  )}
                </Link>
              </NextLink>
              {userInfo ? (
                <>
                  <NavBarBtn id='basic-button' aria-controls={open ? 'basic-menu' : undefined} aria-haspopup='true' aria-expanded={open ? 'true' : undefined} onClick={loginClickHandler}>
                    {userInfo.name}
                  </NavBarBtn>
                  <Menu
                    id='basic-menu'
                    anchorEl={anchorEl}
                    keepMounted
                    open={open}
                    onClose={loginMenuCloseHandler}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >
                    <MenuItem onClick={loginMenuCloseHandler}>Profile</MenuItem>
                    <MenuItem onClick={loginMenuCloseHandler}>My account</MenuItem>
                    <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <NextLink href='/login' passHref>
                  <Link>Login</Link>
                </NextLink>
              )}
            </Box>
          </Toolbar>
        </AppBar>
        <Container sx={classes.main}>{children}</Container>
        <footer style={classes.footer}>
          <Typography>All rights reserved. Next Amazona.</Typography>
        </footer>
      </ThemeProvider>
    </>
  )
}
