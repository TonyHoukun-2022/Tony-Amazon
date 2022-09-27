import { useContext } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Typography } from '@mui/material'

import Layout from '../components/Layout'
import { Store } from '../utils/store'
// import data from '../utils/data'
import axios from 'axios'
//DON'T import model in react comp file
// import Product from '../models/Product'

export default function Home({ products }) {
  const router = useRouter()
  const { state, dispatch } = useContext(Store)
  const addToCartHandler = async (product) => {
    const existedItem = state.cart.cartItems.find((item) => item._id === product._id)
    //setting the qty of the selected product
    const qty = existedItem ? existedItem.quantity + 1 : 1
    const { data: productBeforeUpdate } = await axios.get(`/api/product/${product._id}`)
    if (productBeforeUpdate.countInStock < qty) {
      window.alert('Sorry, this product is out of stock')
      return
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: {
        ...product,
        quantity: qty,
      },
    })
    router.push('/cart')
  }
  return (
    <Layout>
      <div>
        <h1>Products</h1>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.name}>
              <Card>
                {/* click product image => product page */}
                <NextLink href={`/product/${product.slug}`} passHref>
                  {/* nextLink will make the child cardActionArea to be an a tag, passHref attribute to pass href from nextlink to its immediate child */}
                  {/* clickable area in card */}
                  <CardActionArea>
                    <CardMedia component='img' image={product.image} title={product.name}></CardMedia>
                    <CardContent>
                      <Typography>{product.name}</Typography>
                    </CardContent>
                  </CardActionArea>
                </NextLink>
                <CardActions>
                  <Typography>${product.price}</Typography>
                  <Button size='small' color='primary' style={{ fontWeight: 'bold' }} onClick={() => addToCartHandler(product)}>
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </Layout>
  )
}

export async function getServerSideProps() {
  const { data } = await axios.get('http://localhost:3000/api/products')
  return {
    props: {
      products: data,
    },
  }
}
