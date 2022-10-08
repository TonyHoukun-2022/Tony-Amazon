import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Store } from '../utils/store'
import Cookies from 'js-cookie'
import { Controller, useForm } from 'react-hook-form'

import { List, ListItem, Typography, TextField, Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import Layout from '../components/Layout'
import CheckoutWizard from '../components/CheckoutWizard'

const Form = styled('form')(() => ({
  width: '100%',
  maxWidth: 800,
  margin: '0 auto',
}))

const Shipping = () => {
  //useForm from react-hook-form
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm()

  const router = useRouter()
  const {
    state: {
      userInfo,
      cart: { shippingInfo },
    },
    dispatch,
  } = useContext(Store)

  useEffect(() => {
    if (!userInfo) {
      //如果在shipping页logout (或者userInfo cookie删除), 就会到login page, 然后router.query.redirect就是/shipping。如果这时登陆成功，将重新回到shipping.
      router.push('/login?redirect=/shipping')
    }
  }, [])

  //populate form fields with shippingInfo from state by using react-hook-form
  useEffect(() => {
    setValue('fullName', shippingInfo.fullName)
    setValue('address', shippingInfo.address)
    setValue('city', shippingInfo.city)
    setValue('postCode', shippingInfo.postCode)
    setValue('country', shippingInfo.country)
  }, [])

  const submitHandler = ({ fullName, address, city, postCode, country }) => {
    const shippingInfo = { fullName, address, city, postCode, country }
    dispatch({
      type: 'SAVE_SHIPPING_INFO',
      payload: shippingInfo,
    })
    Cookies.set('shippingInfo', JSON.stringify(shippingInfo))
    //direct to payment after finshi shipping section
    router.push('/payment')
  }

  return (
    <Layout title='Shipping Address'>
      <CheckoutWizard activeStep={1} />
      <Form onSubmit={handleSubmit(submitHandler)}>
        <Typography component='h1' variant='h1'>
          Shipping Address
        </Typography>
        <List>
          <ListItem>
            <Controller
              name='fullName'
              control={control}
              defaultValue=''
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  variant='outlined'
                  fullWidth
                  id='fullName'
                  label='Full Name'
                  error={errors.fullName}
                  helperText={errors.fullName ? (errors.fullName.type === 'minLength' ? 'Full Name should be at least 2 letters long' : 'Full Name is required') : ''}
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name='address'
              control={control}
              defaultValue=''
              rules={{
                required: true,
                minLength: 4,
              }}
              render={({ field }) => (
                <TextField
                  variant='outlined'
                  fullWidth
                  id='address'
                  label='Address'
                  error={errors.address}
                  helperText={errors.address ? (errors.address.type === 'minLength' ? 'Address should be at least 4 letters long' : 'Address is required') : ''}
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name='city'
              control={control}
              defaultValue=''
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  variant='outlined'
                  fullWidth
                  id='city'
                  label='City'
                  inputProps={{ type: 'text' }}
                  error={errors.city}
                  helperText={errors.city ? (errors.city.type === 'minLength' ? 'City should be at least 2 letters long' : 'City is required') : ''}
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name='postCode'
              control={control}
              defaultValue=''
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  variant='outlined'
                  fullWidth
                  id='postCode'
                  label='Post Code'
                  inputProps={{ type: 'text' }}
                  error={errors.postCode}
                  helperText={errors.postCode ? (errors.postCode.type === 'minLength' ? 'Post Code should be at least 2 letters long' : 'Post Code is required') : ''}
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name='country'
              control={control}
              defaultValue=''
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  variant='outlined'
                  fullWidth
                  id='country'
                  label='Country'
                  inputProps={{ type: 'text' }}
                  error={errors.country}
                  helperText={errors.country ? (errors.country.type === 'minLength' ? 'Country should be at least 2 letters long' : 'Country is required') : ''}
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Button variant='contained' type='submit' fullWidth color='primary'>
              Continue
            </Button>
          </ListItem>
        </List>
      </Form>
    </Layout>
  )
}

export default Shipping
