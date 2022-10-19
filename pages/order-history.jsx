import { useEffect, useContext, useReducer } from 'react'
import axios from 'axios'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import NexLink from 'next/link'
import { CircularProgress, Grid, List, ListItem, TableContainer, Typography, Card, Table, TableHead, TableRow, TableCell, TableBody, Button, ListItemText, ListItemButton } from '@mui/material'
import { styled } from '@mui/material/styles'
import { getError } from '../utils/error'
import { Store } from '../utils/store'

import Layout from '../components/Layout'

const SectionCard = styled(Card)({
  marginTop: 1,
  marginBottom: 1,
  '& a': {
    textDecoration: 'none',
  },
})

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: '' }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }
    default:
      state
  }
}

const OrderHistory = () => {
  const {
    state: { userInfo },
  } = useContext(Store)
  const router = useRouter()

  //local reducer
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  })

  useEffect(() => {
    if (!userInfo) {
      router.push('/login')
    }
    const fetchOrders = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const {
          data: { message, orders },
        } = await axios.get(`/api/orders/history`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        })
        dispatch({ type: 'FETCH_SUCCESS', payload: orders })
      } catch (err) {
        console.log(err, 'err')
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
      }
    }
    fetchOrders()
  }, [])

  return (
    <Layout title='Order History'>
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <SectionCard>
            <List>
              <NexLink href='/profile' passHref>
                <ListItemButton component='a'>
                  <ListItemText primary='User Profile' />
                </ListItemButton>
              </NexLink>
              <NexLink href='/order-history' passHref>
                <ListItemButton selected component='a'>
                  <ListItemText primary='Order History' />
                </ListItemButton>
              </NexLink>
            </List>
          </SectionCard>
        </Grid>
        <Grid item md={9} xs={12}>
          <SectionCard>
            <List>
              <ListItem>
                <Typography component='h1' variant='h1'>
                  Order History
                </Typography>
              </ListItem>
              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography sx={{ color: '#f04040' }}>{error}</Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>DATE</TableCell>
                          <TableCell>TOTAL</TableCell>
                          <TableCell>PAID</TableCell>
                          <TableCell>DELIVERED</TableCell>
                          <TableCell>ACTION</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell>{order._id.substring(20, 24)}</TableCell>
                            <TableCell>{order.createdAt}</TableCell>
                            <TableCell>${order.totalPrice}</TableCell>
                            <TableCell>{order.isPaid ? `paid at ${order.paidAt}` : 'not paid'}</TableCell>
                            <TableCell>{order.isDelivered ? `delivered at ${order.deliveredAt}` : 'not delivered'}</TableCell>
                            <TableCell>
                              <NexLink href={`/order/${order._id}`} passHref>
                                <Button variant='contained'>Details</Button>
                              </NexLink>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </ListItem>
            </List>
          </SectionCard>
        </Grid>
      </Grid>
    </Layout>
  )
}

export default dynamic(() => Promise.resolve(OrderHistory), { ssr: false })
