import NextLink from 'next/link'
import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Typography } from '@mui/material'

import Layout from '../components/Layout'
import data from '../utils/data'

export default function Home() {
  return (
    <Layout>
      <div>
        <h1>Products</h1>
        <Grid container spacing={3}>
          {data.products.map((product) => (
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
                  <Button size='small' color='primary' style={{ fontWeight: 'bold' }}>
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
