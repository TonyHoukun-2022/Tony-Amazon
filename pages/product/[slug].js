// /product/slug
import { useContext, useEffect, useState } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import Image from 'next/image'
import axios from 'axios'
import { styled } from '@mui/material/styles'
import { Grid, Link, List, ListItem, Typography, Card, Button, Box, Rating } from '@mui/material'

import { Store } from '../../utils/store'
import Layout from '../../components/Layout'
import classes from '../../utils/classes'
import { getError } from '../../utils/error'
import ReviewSection from '../../components/ReviewSection'

const StyledTypography = styled(Typography)({
  paddingLeft: '5px',
  fontWeight: 'bold',
})

const Product = ({ product }) => {
  const router = useRouter()
  const { state, dispatch } = useContext(Store)
  const { userInfo } = state
  const { enqueueSnackbar } = useSnackbar()

  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchReviews = async () => {
    try {
      const { data: reviewsOfProduct } = await axios.get(`/api/product/${product._id}/review`)
      setReviews(reviewsOfProduct)
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' })
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [rating, comment])

  //submit to update or create review
  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post(
        `/api/product/${product._id}/review`,
        {
          rating,
          comment,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      )
      setLoading(false)
      enqueueSnackbar('Review submitted successfully', { variant: 'success' })
      //fetch reviews after update or create a new
      fetchReviews()
    } catch (err) {
      setLoading(false)
      enqueueSnackbar(getError(err), { variant: 'error' })
    }
  }

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id)
    const qty = existItem ? existItem.quantity + 1 : 1
    const { data: addedProduct } = await axios.get(`http://localhost:3000/api/product/${product._id}`)
    if (addedProduct.countInStock < qty) {
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
    //redirect to /cart after add item
    router.push('/cart')
  }

  //if doesnt have a product slug in data, display not found
  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <Layout title={product.name} description={product.description}>
      <Box sx={classes.section}>
        <NextLink href='/' passHref>
          <Link>
            <Typography>Back to products</Typography>
          </Link>
        </NextLink>
      </Box>
      <Grid container spacing={1}>
        <Grid item xs={12} md={6}>
          <Image src={product.image} alt={product.name} width={640} height={640} layout='responsive' />
        </Grid>
        <Grid item xs={12} md={3}>
          <List>
            <ListItem>
              {/* varaint h1 => use created theme style defined in layout file */}
              <Typography component='h1' variant='h1'>
                {product.name}
              </Typography>
            </ListItem>
            <ListItem>
              Category:
              <StyledTypography>{product.category}</StyledTypography>
            </ListItem>
            <ListItem>
              Brand:
              <StyledTypography>{product.brand}</StyledTypography>
            </ListItem>
            <ListItem>
              <Rating value={product.rating} />
              <Link href='#reviews'>
                <StyledTypography>({product.numReviews} reviews)</StyledTypography>
              </Link>
            </ListItem>
            <ListItem>
              Description:
              <StyledTypography> {product.description}</StyledTypography>
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <List>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Price</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>${product.price}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Status</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>{product.countInStock > 0 ? 'In stock' : 'Unavailable'}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button fullWidth variant='contained' color='primary' onClick={addToCartHandler}>
                  Add to cart
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
      <ReviewSection reviews={reviews} submit={submitHandler} loading={loading} comment={comment} setComment={setComment} rating={rating} setRating={setRating} product={product} />
    </Layout>
  )
}

export default Product

export const getServerSideProps = async (context) => {
  const {
    params: { slug },
  } = context
  const { data } = await axios.get(`http://localhost:3000/api/products/${slug}`)
  return {
    props: {
      product: data,
    },
  }
}
