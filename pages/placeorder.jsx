import React, { useContext, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Layout from '../components/Layout'
import { Store } from '../utils/store'
import NextLink from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import axios from 'axios'
import Cookies from 'js-cookie'

import { Grid, TableContainer, Table, Typography, TableHead, TableBody, TableRow, TableCell, Link, Button, Card, List, ListItem, CircularProgress } from '@mui/material'
import { styled } from '@mui/material/styles'

import CheckoutWizard from '../components/CheckoutWizard'
import { getError } from '../utils/error'

const StyledCard = styled(Card)(() => ({
  marginTop: 1,
  marginBottom: 1,
  '& a': {
    textDecoration: 'none',
  },
}))

const PlaceOrder = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { state, dispatch } = useContext(Store)
  const {
    userInfo,
    cart: { cartItems, shippingInfo, paymentMethod },
  } = state
  const { closeSnackbar, enqueueSnackbar } = useSnackbar()

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100 //123.456 => 123.46
  const itemsPrice = round2(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0))
  const shippingPrice = itemsPrice > 200 ? 0 : 15
  const taxPrice = round2(itemsPrice * 0.1)
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice)

  useEffect(() => {
    if (!paymentMethod) {
      router.push('/payment')
    }
    if (cartItems.length === 0) {
      router.push('/cart')
    }
  }, [])

  const placeOrderHandler = async () => {
    closeSnackbar()
    try {
      setLoading(true)
      const order = { orderItems: cartItems, shippingInfo, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice }
      const { data } = await axios.post(`/api/orders`, order, {
        headers: {
          authorization: `Bearer ${userInfo.token}`,
        },
      })
      //clear current cart state after place order
      dispatch({
        type: 'CART_CLEAR',
      })
      Cookies.remove('cartItems')
      setLoading(false)
      router.push(`/order/${data._id}`)
    } catch (error) {
      setLoading(false)
      enqueueSnackbar(getError(error), { variant: 'error' })
    }
  }

  return (
    <Layout title='Shopping Cart'>
      <CheckoutWizard activeStep={3} />
      <Typography component='h1' variant='h1'>
        Place Order
      </Typography>
      <Grid container spacing={1}>
        <Grid item md={9} xs={12}>
          <StyledCard>
            <List>
              <ListItem>
                <Typography component='h2' variant='h2'>
                  Shipping Address
                </Typography>
              </ListItem>
              <ListItem>
                {shippingInfo.fullName}, {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.postCode}, {shippingInfo.country}
              </ListItem>
            </List>
          </StyledCard>
          <StyledCard>
            <List>
              <ListItem>
                <Typography component='h2' variant='h2'>
                  Payment Method
                </Typography>
              </ListItem>
              <ListItem>{paymentMethod}</ListItem>
            </List>
          </StyledCard>
          <StyledCard>
            <List>
              <ListItem>
                <Typography component='h2' variant='h2'>
                  Order Items
                </Typography>
              </ListItem>
              <ListItem>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Image</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell align='right'>Quantity</TableCell>
                        <TableCell align='right'>Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cartItems.map((item) => (
                        <TableRow key={item._id}>
                          <TableCell>
                            <NextLink href={`/product/${item.slug}`} passHref>
                              <Link>
                                <Image src={item.image} alt={item.name} width={50} height={50}></Image>
                              </Link>
                            </NextLink>
                          </TableCell>

                          <TableCell>
                            <NextLink href={`/product/${item.slug}`} passHref>
                              <Link>
                                <Typography>{item.name}</Typography>
                              </Link>
                            </NextLink>
                          </TableCell>
                          <TableCell align='right'>
                            <Typography>{item.quantity}</Typography>
                          </TableCell>
                          <TableCell align='right'>
                            <Typography>${item.price}</Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ListItem>
            </List>
          </StyledCard>
        </Grid>
        <Grid item md={3} xs={12}>
          <StyledCard>
            <List>
              <ListItem>
                <Typography variant='h2'>Order Summary</Typography>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Items:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align='right'>${itemsPrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Tax:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align='right'>${taxPrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Shipping:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align='right'>${shippingPrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>
                      <strong>Total:</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align='right'>
                      <strong>${totalPrice}</strong>
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button onClick={placeOrderHandler} variant='contained' color='primary' fullWidth>
                  Place Order
                </Button>
              </ListItem>
              {loading && (
                <ListItem>
                  <CircularProgress />
                </ListItem>
              )}
            </List>
          </StyledCard>
        </Grid>
      </Grid>
    </Layout>
  )
}

export default dynamic(() => Promise.resolve(PlaceOrder), { ssr: false })
