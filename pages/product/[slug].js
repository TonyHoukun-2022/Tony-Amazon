// /product/slug
import NextLink from 'next/link'
import Image from 'next/image'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { Grid, Link, List, ListItem, Typography, Card, Button, Box } from '@mui/material'

import Layout from '../../components/Layout'
import data from '../../utils/data'
import classes from '../../utils/classes'

const StyledTypography = styled(Typography)`
  padding-left: 5px;
  font-weight: bold;
`

const Product = () => {
  const router = useRouter()
  const { slug } = router.query
  const product = data.products.find((product) => product.slug === slug)

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
        <Grid item md={3} xs={12}>
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
              Rating:
              <StyledTypography>{`${product.rating} stars (${product.numReviews} reviews)`}</StyledTypography>
            </ListItem>
            <ListItem>
              Description:
              <StyledTypography> {product.description}</StyledTypography>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={3} xs={12}>
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
                <Button
                  fullWidth
                  variant='contained'
                  color='primary'
                  // onClick={addToCartHandler}
                >
                  Add to cart
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  )
}

export default Product
