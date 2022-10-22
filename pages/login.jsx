import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import Cookies from 'js-cookie'
import { List, ListItem, Typography, TextField, Button, Link } from '@mui/material'
import { styled } from '@mui/material/styles'
import Layout from '../components/Layout'
import { Store } from '../utils/store'

//use react-hook-form to validate inputs
import { Controller, useForm } from 'react-hook-form'
import { useSnackbar } from 'notistack'
import { getError } from '../utils/error'

const Form = styled('form')(() => ({
  width: '100%',
  maxWidth: 800,
  margin: '0 auto',
}))

const Login = () => {
  //useForm from react-hook-form
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  //useSnackbar from notistack
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const router = useRouter()
  const { redirect } = router.query //login?redirect=/shipping => redirect is /shipping
  const { state, dispatch } = useContext(Store)
  const { userInfo } = state
  //if userInfo being stored in cookie (means user is logged in), dont need login stage, redirect to home
  useEffect(() => {
    if (userInfo) {
      router.push('/')
    }
  }, [])

  /* NOT NEED useState to onChange field if using react-hook-form */
  //   const [email, setEmail] = useState('')
  //   const [psd, setPsd] = useState('')

  const submitHandler = async ({ email, password }) => {
    // e.preventDefault()
    closeSnackbar()
    try {
      const { data: loggedInUser } = await axios.post('/api/users/login', { email, password })
      //save user to context
      dispatch({
        type: 'USER_LOGIN',
        payload: loggedInUser,
      })
      /** userInfo
       * token,
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
       */
      //set loggedInUser to cookie
      Cookies.set('userInfo', JSON.stringify(loggedInUser))
      //if redirect is null, go to home
      //if redirect is /shipping, go to shipping
      router.push(redirect || '/')
    } catch (error) {
      //enqueueSnackbar(message, {opt})
      enqueueSnackbar(getError(error), { variant: 'error' })
    }
  }
  return (
    <Layout title='Login'>
      {/* handleSubmit" will validate your inputs before invoking "onSubmit" */}
      <Form onSubmit={handleSubmit(submitHandler)}>
        <Typography component='h1' variant='h1'>
          Login
        </Typography>
        <List>
          <ListItem>
            <Controller
              name='email'
              control={control}
              defaultValue=''
              rules={{
                required: true,
                pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
              }}
              render={({ field }) => (
                <TextField
                  variant='outlined'
                  fullWidth
                  id='email'
                  label='Email'
                  inputProps={{ type: 'email' }}
                  error={errors.email}
                  //emails.type includes required and pattern which defined in rules of Controller
                  helperText={errors.email ? (errors.email.type === 'pattern' ? 'Email is not valid' : 'Email is required') : ''}
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name='password'
              control={control}
              defaultValue=''
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field }) => (
                <TextField
                  variant='outlined'
                  fullWidth
                  id='password'
                  label='Password'
                  inputProps={{ type: 'password' }}
                  error={errors.password}
                  helperText={errors.password ? (errors.password.type === 'minLength' ? 'Password length should be at least 6' : 'Password is required') : ''}
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Button variant='contained' type='submit' fullWidth color='primary'>
              Login
            </Button>
          </ListItem>
          <ListItem>
            Don&apos;t have an account? &nbsp;
            <NextLink href={`/register?redirect=${redirect || '/'}`} passHref>
              <Link>Register</Link>
            </NextLink>
          </ListItem>
        </List>
      </Form>
    </Layout>
  )
}

export default Login
