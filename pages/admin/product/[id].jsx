import axios from 'axios'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import React, { useEffect, useContext, useReducer } from 'react'
import { Grid, List, ListItem, Typography, Card, Button, ListItemText, TextField, CircularProgress, ListItemButton } from '@mui/material'
import { styled } from '@mui/material/styles'
import { getError } from '../../../utils/error'
import { Store } from '../../../utils/store'
import Layout from '../../../components/Layout'
import { Controller, useForm } from 'react-hook-form'
import { useSnackbar } from 'notistack'

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: '' }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

const SectionCard = styled(Card)({
  marginTop: 1,
  marginBottom: 1,
  '& a': {
    textDecoration: 'none',
  },
})

const Form = styled('form')(() => ({
  width: '100%',
  maxWidth: 800,
  margin: '0 auto',
}))

const EditProduct = ({ params }) => {
  const productId = params.id

  const {
    state: {
      userInfo,
      productUpdate: { updateLoading, updateError },
    },
    dispatch: storeDispatch,
  } = useContext(Store)

  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const router = useRouter()

  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  })

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm()

  useEffect(() => {
    if (!userInfo) {
      router.push('/login')
    }
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const { data: product } = await axios.get(`/api/admin/products/${productId}`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        })

        dispatch({ type: 'FETCH_SUCCESS' })

        const { name, slug, price, image, category, brand, countInStock, description } = product

        //fill up fields' values for the 1st render
        setValue('name', name)
        setValue('slug', slug)
        setValue('price', price)
        setValue('image', image)
        setValue('category', category)
        setValue('brand', brand)
        setValue('countInStock', countInStock)
        setValue('description', description)
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) })
      }
    }
    fetchData()
  }, [])

  const submitHandler = async ({ name, slug, price, image, category, brand, countInStock, description }) => {
    closeSnackbar()
    //update product detail
    try {
      storeDispatch({ type: 'PRODUCT_UPDATE_REQUEST' })
      const { data } = await axios.put(
        `/api/admin/products/${productId}`,
        {
          name,
          slug,
          price,
          image,
          category,
          brand,
          countInStock,
          description,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      )
      storeDispatch({ type: 'PRODUCT_UPDATE_SUCCESS' })
      enqueueSnackbar(data.message, { variant: 'success' })
      router.push('/admin/products')
    } catch (error) {
      storeDispatch({
        type: 'PRODUCT_UPDATE_FAIL',
        payload: getError(error),
      })
      enqueueSnackbar(getError(error), { variant: 'error' })
    }
  }

  return (
    <Layout title={`Edit Product ${productId}`}>
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <SectionCard>
            <List>
              <NextLink href='/admin/dashboard' passHref>
                <ListItemButton component='a'>
                  <ListItemText primary='Admin Dashboard'></ListItemText>
                </ListItemButton>
              </NextLink>
              <NextLink href='/admin/orders' passHref>
                <ListItemButton component='a'>
                  <ListItemText primary='Orders'></ListItemText>
                </ListItemButton>
              </NextLink>
              <NextLink href='/admin/products' passHref>
                <ListItemButton selected component='a'>
                  <ListItemText primary='Products'></ListItemText>
                </ListItemButton>
              </NextLink>
            </List>
          </SectionCard>
        </Grid>
        <Grid item md={9} xs={12}>
          <SectionCard>
            <List>
              <ListItem>
                <Typography component='h1' variant='h1'>
                  Edit Product {productId}
                </Typography>
              </ListItem>
              <ListItem>
                {loading && <CircularProgress />}
                {/* error from useEffect fetching */}
                {error && <Typography sx={{ color: 'red' }}>{error}</Typography>}
              </ListItem>
              <ListItem>
                <Form onSubmit={handleSubmit(submitHandler)}>
                  <List>
                    <ListItem>
                      <Controller
                        name='name'
                        control={control}
                        defaultValue=''
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField variant='outlined' fullWidth id='name' label='Name' error={Boolean(errors.name)} helperText={errors.name ? 'Name is required' : ''} {...field} />
                        )}
                      />
                    </ListItem>
                    <ListItem>
                      <Controller
                        name='slug'
                        control={control}
                        defaultValue=''
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField variant='outlined' fullWidth id='slug' label='Slug' error={Boolean(errors.slug)} helperText={errors.slug ? 'Slug is required' : ''} {...field} />
                        )}
                      />
                    </ListItem>
                    <ListItem>
                      <Controller
                        name='price'
                        control={control}
                        defaultValue=''
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField variant='outlined' fullWidth id='price' label='Price' error={Boolean(errors.price)} helperText={errors.price ? 'Price is required' : ''} {...field} />
                        )}
                      />
                    </ListItem>
                    <ListItem>
                      <Controller
                        name='image'
                        control={control}
                        defaultValue=''
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField variant='outlined' fullWidth id='image' label='Image' error={Boolean(errors.image)} helperText={errors.image ? 'Image is required' : ''} {...field} />
                        )}
                      />
                    </ListItem>
                    <ListItem>
                      <Controller
                        name='category'
                        control={control}
                        defaultValue=''
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant='outlined'
                            fullWidth
                            id='category'
                            label='Category'
                            error={Boolean(errors.category)}
                            helperText={errors.category ? 'Category is required' : ''}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name='brand'
                        control={control}
                        defaultValue=''
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField variant='outlined' fullWidth id='brand' label='Brand' error={Boolean(errors.brand)} helperText={errors.brand ? 'Brand is required' : ''} {...field}></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name='countInStock'
                        control={control}
                        defaultValue=''
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant='outlined'
                            fullWidth
                            id='countInStock'
                            label='Count in stock'
                            error={Boolean(errors.countInStock)}
                            helperText={errors.countInStock ? 'Count in stock is required' : ''}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <Controller
                        name='description'
                        control={control}
                        defaultValue=''
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant='outlined'
                            fullWidth
                            multiline
                            id='description'
                            label='Description'
                            error={Boolean(errors.description)}
                            helperText={errors.description ? 'Description is required' : ''}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>

                    <ListItem sx={{ flexDirection: 'column' }}>
                      <Button variant='contained' type='submit' fullWidth color='primary'>
                        Update
                      </Button>
                      {updateLoading && <CircularProgress />}
                      {updateError && <div style={{ paddingTop: '1rem' }}>{updateError}</div>}
                    </ListItem>
                  </List>
                </Form>
              </ListItem>
            </List>
          </SectionCard>
        </Grid>
      </Grid>
    </Layout>
  )
}

export const getServerSideProps = async ({ params }) => {
  return {
    props: {
      params,
    },
  }
}

export default EditProduct
