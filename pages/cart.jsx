import React, { useContext } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import { Store } from '../utils/store'
import NextLink from 'next/link'
import Image from 'next/image'
import { Grid, TableContainer, Table, Typography, TableHead, TableBody, TableRow, TableCell, Link, Select, MenuItem, Button, Card, List, ListItem, Box } from '@mui/material'
import axios from 'axios'

const Cart = () => {
  const router = useRouter()
  const { state, dispatch } = useContext(Store)
  const {
    cart: { cartItems },
  } = state

  const updateCartHandler = async (item, quantity) => {
    const { data: product } = await axios.get(`/api/product/${item._id}`)
    //   if product countInStock is less than selected quantity
    if (product.countInStock < quantity) {
      window.alert('Sorry, product is out of stock')
      return
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: {
        ...item,
        quantity,
      },
    })
  }

  const removeItemHandler = (item) => {
    dispatch({
      type: 'CART_REMOVE_ITEM',
      payload: item,
    })
  }

  const checkoutHandler = () => {
    router.push('/shipping')
  }

  return (
    <Layout title='Shopping Cart'>
      <Typography component='h1' variant='h1'>
        Shopping Cart
      </Typography>
      {cartItems.length === 0 ? (
        <Box>
          Cart is empty.{' '}
          <NextLink href='/' passHref>
            <Link color='secondary'>Go shopping</Link>
          </NextLink>
        </Box>
      ) : (
        <Grid container spacing={1}>
          <Grid item md={9} xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align='right'>Quantity</TableCell>
                    <TableCell align='right'>Price</TableCell>
                    <TableCell align='right'>Delete</TableCell>
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
                        <Select value={item.quantity} onChange={(e) => updateCartHandler(item, e.target.value)}>
                          {/* quantity options from 1 to countInStock */}
                          {[...Array(item.countInStock).keys()].map((i) => (
                            <MenuItem key={i + 1} value={i + 1}>
                              {i + 1}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell align='right'>${item.price}</TableCell>
                      <TableCell align='right'>
                        <Button variant='contained' color='secondary' onClick={() => removeItemHandler(item)}>
                          x
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card>
              <List>
                <ListItem>
                  <Typography variant='h2'>
                    Subtotal ({cartItems.reduce((totalCount, item) => totalCount + item.quantity, 0)} items) : ${cartItems.reduce((totalPrice, item) => totalPrice + item.quantity * item.price, 0)}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Button onClick={checkoutHandler} variant='contained' color='primary' fullWidth>
                    Check Out
                  </Button>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  )
}

//disable ssr, not render this page as ssr
export default dynamic(() => Promise.resolve(Cart), { ssr: false })
