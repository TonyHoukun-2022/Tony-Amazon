import React, { useContext, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Layout from '../../components/Layout'
import { Store } from '../../utils/store'
import NextLink from 'next/link'
import Image from 'next/image'
import { Grid, TableContainer, Table, Typography, TableHead, TableBody, TableRow, TableCell, Link, CircularProgress, Card, List, ListItem, Box, Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { getError } from '../../utils/error'

// import CheckoutWizard from '../../components/CheckoutWizard'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'

const ErrorTypography = styled(Typography)({
  color: '#f04040',
})

const SectionCard = styled(Card)({
  marginTop: 1,
  marginBottom: 1,
  '& a': {
    textDecoration: 'none',
  },
})

const OrderDetail = ({ params }) => {
  const orderId = params.id
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const [readyRender, setReadyRender] = useState(false)

  const {
    state: {
      userInfo,
      order: { orderInfo, loading, error },
      pay: { paySuccess },
      deliver: { deliverLoading, deliverSuccess },
    },
    dispatch,
  } = useContext(Store)

  const { shippingInfo, paymentMethod, orderItems, itemsPrice, taxPrice, shippingPrice, totalPrice, isPaid, paidAt, isDelivered, deliveredAt } = orderInfo

  //usePaypalScriptReducer
  //isPending => loading paypal script
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer()

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login')
    }
    const getOrder = async () => {
      try {
        dispatch({
          type: 'FETCH_ORDER',
        })
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        })
        dispatch({
          type: 'FETCH_ORDER_SUCCESS',
          payload: data,
        })
        setReadyRender(true)
      } catch (error) {
        setReadyRender(false)
        dispatch({
          type: 'FETCH_ORDER_FAIL',
          payload: getError(error),
        })
      }
    }
    //paySuccess = true => last payment success
    if (!orderInfo._id || (orderInfo._id && orderInfo._id !== orderId) || paySuccess || deliverSuccess) {
      getOrder()
      //reset pay status when last payment is success, then effect code will run, step into loadPaypal script function
      if (paySuccess) {
        dispatch({
          type: 'PAY_RESET',
        })
      }
      if (deliverSuccess) {
        dispatch({ type: 'DELIVER_SUCCESS' })
      }
    } else {
      //orderInfo._id && orderInfo._id === orderId => able to pay
      const loadPaypalScript = async () => {
        //only allow authorized user to get paypal_client_id stored in .env
        const { data: clientId } = await axios.get('/api/keys/paypal', {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        })
        //set client-id and currency
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'AUD',
          },
        })
        //load paypal scripts from website
        paypalDispatch({
          type: 'setLoadingStatus',
          value: 'pending',
        })
      }
      loadPaypalScript()
    }
  }, [orderInfo, paySuccess, deliverSuccess])

  //createOrder, onApprove, onError are handlers for paypal-js
  const createOrderHandler = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID
      })
  }

  const onApproveHandler = (data, actions) => {
    return actions.order.capture().then(async (details) => {
      try {
        dispatch({
          type: 'PAY_REQUEST',
        })
        const { data } = await axios.put(`/api/orders/${orderInfo._id}/pay`, details, {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        })
        dispatch({ type: 'PAY_SUCCESS', payload: data })
        enqueueSnackbar(data.message, { variant: 'success' })
      } catch (error) {
        dispatch({
          type: 'PAY_FAIL',
          payload: getError(error),
        })
        enqueueSnackbar(getError(error), { variant: 'error' })
      }
    })
  }

  const onErrorHandler = (error) => {
    enqueueSnackbar(getError(error), { variant: 'error' })
  }

  const deliverHandler = async () => {
    try {
      dispatch({ type: 'DELIVER_REQUEST' })
      const { data: deliveredOrder } = await axios.put(
        `/api/orders/${orderInfo._id}/deliver`,
        {},
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      )
      dispatch({ type: 'DELIVER_SUCCESS' })
      enqueueSnackbar(deliveredOrder.message, { variant: 'success' })
    } catch (error) {
      dispatch({ type: 'DELIVER_FAIL', payload: getError(error) })
      enqueueSnackbar(getError(error), { variant: 'error' })
    }
  }
  return (
    <Layout title={`Order ${orderId}`}>
      {/* <CheckoutWizard activeStep={3} /> */}
      <Typography component='h1' variant='h1'>
        Order {orderId}
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <ErrorTypography>{error}</ErrorTypography>
      ) : !readyRender ? (
        <div>Not ready to render</div>
      ) : (
        <Grid container spacing={1}>
          <Grid item md={9} xs={12}>
            <SectionCard>
              <List>
                <ListItem>
                  <Typography component='h2' variant='h2'>
                    Shipping Address
                  </Typography>
                </ListItem>
                <ListItem>
                  {shippingInfo.fullName}, {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.postCode}, {shippingInfo.country}
                </ListItem>
                <ListItem>Status: {isDelivered ? `delivered at ${deliveredAt}` : 'not delivered'}</ListItem>
              </List>
            </SectionCard>
            <SectionCard>
              <List>
                <ListItem>
                  <Typography component='h2' variant='h2'>
                    Payment Method
                  </Typography>
                </ListItem>
                <ListItem>{paymentMethod}</ListItem>
                <ListItem>Status: {isPaid ? `paid at ${paidAt}` : 'not paid'}</ListItem>
              </List>
            </SectionCard>
            <SectionCard>
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
                        {orderItems.map((item) => (
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
            </SectionCard>
          </Grid>
          <Grid item md={3} xs={12}>
            <SectionCard>
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
                {!isPaid && (
                  <ListItem>
                    {isPending ? (
                      <CircularProgress />
                    ) : (
                      <Box sx={{ width: '100%' }}>
                        <PayPalButtons createOrder={createOrderHandler} onApprove={onApproveHandler} onError={onErrorHandler} />
                      </Box>
                    )}
                  </ListItem>
                )}
                {userInfo.isAdmin && isPaid && !isDelivered && (
                  <ListItem>
                    {deliverLoading && <CircularProgress />}
                    <Button fullWidth variant='contained' color='primary' onClick={deliverHandler}>
                      Deliver Order
                    </Button>
                  </ListItem>
                )}
              </List>
            </SectionCard>
          </Grid>
        </Grid>
      )}
    </Layout>
  )
}

export async function getServerSideProps({ params }) {
  return { props: { params } }
}

export default dynamic(() => Promise.resolve(OrderDetail), { ssr: false })
