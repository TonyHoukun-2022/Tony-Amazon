import { List, ListItem, Typography, TextField, Button, Link } from '@mui/material'
import { styled } from '@mui/material/styles'
import axios from 'axios'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import React, { useContext, useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { Store } from '../utils/store'
import Cookies from 'js-cookie'

import { Controller, useForm } from 'react-hook-form'
import { useSnackbar } from 'notistack'
import { getError } from '../utils/error'

const Form = styled('form')(() => ({
  width: '100%',
  maxWidth: 800,
  margin: '0 auto',
}))

const Register = () => {
  //useForm from react-hook-form
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const router = useRouter()
  const redirect = router.query
  const { state, dispatch } = useContext(Store)
  const { userInfo } = state

  useEffect(() => {
    if (userInfo) {
      router.push('/')
    }
  }, [])

  //   const [name, setName] = useState('')
  //   const [email, setEmail] = useState('')
  //   const [password, setPassword] = useState('')
  //   const [confirmPassword, setConfirmPassword] = useState('')

  const submitHandler = async ({ name, email, password, confirmPassword }) => {
    // e.preventDefault()
    closeSnackbar()
    if (password !== confirmPassword) {
      enqueueSnackbar(`Password don't match`, { variant: 'error' })
      return
    }
    //passwords match
    try {
      const { data: newUser } = await axios.post('api/users/register', { name, email, password })
      //login directly after register
      dispatch({
        type: 'USER_LOGIN',
        payload: newUser,
      })
      router.push(redirect || '/')
      //set cookie
      Cookies.set('userInfo', JSON.stringify(newUser))
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: 'error' })
    }
  }
  return (
    <Layout title='Register'>
      <Form onSubmit={handleSubmit(submitHandler)}>
        <Typography component='h1' variant='h1'>
          Register
        </Typography>
        <List>
          <ListItem>
            <Controller
              name='name'
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
                  id='name'
                  label='Name'
                  inputProps={{ type: 'text' }}
                  error={errors.name}
                  helperText={errors.name ? (errors.name.type === 'minLength' ? 'Name should be at least 2 letters long' : 'Name is required') : ''}
                  {...field}
                />
              )}
            />
          </ListItem>
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
                  helperText={errors.email ? (errors.email.type === 'pattern' ? 'Email format is invalid' : 'Email is required') : ''}
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
                  helperText={errors.password ? (errors.password.type === 'minLength' ? 'Password should be at least 6 characters' : 'Password is required') : ''}
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Controller
              name='confirmPassword'
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
                  id='confirmPassword'
                  label='Confirm Password'
                  inputProps={{ type: 'password' }}
                  error={errors.confirmPassword}
                  helperText={errors.confirmPassword ? (errors.confirmPassword.type === 'minLength' ? 'Confirm password should be at least 6 characters' : 'Confirm psd is required') : ''}
                  {...field}
                />
              )}
            />
          </ListItem>
          <ListItem>
            <Button variant='contained' type='submit' fullWidth color='primary'>
              Register
            </Button>
          </ListItem>
          <ListItem>
            Already have an account? &nbsp;
            <NextLink href={`/login?redirect=${redirect || '/'}`} passHref>
              <Link>Login</Link>
            </NextLink>
          </ListItem>
        </List>
      </Form>
    </Layout>
  )
}

export default Register
