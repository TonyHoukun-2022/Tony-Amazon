import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import Cookies from 'js-cookie'
import { List, ListItem, Typography, TextField, Button, Link } from '@mui/material'
import { styled } from '@mui/material/styles'
import Layout from '../components/Layout'
import { Store } from '../utils/store'

const Form = styled('form')(() => ({
  width: '100%',
  maxWidth: 800,
  margin: '0 auto',
}))

const Login = () => {
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

  const [email, setEmail] = useState('')
  const [psd, setPsd] = useState('')

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      const { data: loggedInUser } = await axios.post('/api/users/login', { email, psd })
      //save user to context
      dispatch({
        type: 'USER_LOGIN',
        payload: loggedInUser,
      })
      //set loggedInUser to cookie
      Cookies.set('userInfo', JSON.stringify(loggedInUser))
      //if redirect is null, go to home
      //if redirect is /shipping, go to shipping
      router.push(redirect || '/')
    } catch (error) {
      alert(error.response.data ? error.response.data.message : error.message)
    }
  }
  return (
    <Layout title='Login'>
      <Form onSubmit={submitHandler}>
        <Typography component='h1' variant='h1'>
          Login
        </Typography>
        <List>
          <ListItem>
            <TextField variant='outlined' fullWidth id='email' label='Email' inputProps={{ type: 'email' }} onChange={(e) => setEmail(e.target.value)} />
          </ListItem>
          <ListItem>
            <TextField variant='outlined' fullWidth id='password' label='Password' inputProps={{ type: 'password' }} onChange={(e) => setPsd(e.target.value)} />
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
