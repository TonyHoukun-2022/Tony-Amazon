import { useContext } from 'react'
import { Grid, List, ListItem, Rating, Typography, TextField, Button, CircularProgress } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Store } from '../utils/store'
import Link from 'next/link'

const ReviewForm = styled('form')({
  maxWidth: 800,
  width: '100%',
})

const ReviewSection = ({ reviews, submit, loading, comment, rating, setComment, setRating, product }) => {
  const { state: userInfo } = useContext(Store)
  return (
    <List>
      <ListItem>
        <Typography name='reviews' id='reviews' variant='h2'>
          Customer Reviews
        </Typography>
      </ListItem>
      {reviews.length === 0 && <ListItem>No review</ListItem>}
      {reviews.map((review) => (
        <ListItem key={review._id}>
          <Grid container>
            <Grid item sx={{ marginRight: '1rem', borderRight: '1px #808080 solid', paddingRight: '1rem' }}>
              <Typography>
                <strong>{review.name}</strong>
              </Typography>
              <Typography>{review.createdAt.substring(0, 10)}</Typography>
            </Grid>
            <Grid item>
              <Rating value={review.rating} readOnly />
              <Typography>{review.comment}</Typography>
            </Grid>
          </Grid>
        </ListItem>
      ))}
      <ListItem>
        {userInfo ? (
          <ReviewForm onSubmit={submit}>
            <List>
              <ListItem>
                <Typography variant='h2'>Leave your review</Typography>
              </ListItem>
              <ListItem>
                <TextField multiline variant='outlined' fullWidth name='review' label='Enter comment' value={comment} onChange={(e) => setComment(e.target.value)} />
              </ListItem>
              <ListItem>
                <Rating name='simple-controlled' value={rating} onChange={(e) => setRating(e.target.value)} />
              </ListItem>
              <ListItem>
                <Button type='submit' fullWidth variant='contained' color='primary'>
                  Submit
                </Button>
                {loading && <CircularProgress />}
              </ListItem>
            </List>
          </ReviewForm>
        ) : (
          <Typography variant='h2'>
            Please <Link href={`/login?redirect=/product/${product.slug}`}>login</Link> to write a review
          </Typography>
        )}
      </ListItem>
    </List>
  )
}

export default ReviewSection
