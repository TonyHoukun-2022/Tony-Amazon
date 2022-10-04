import { List, ListItem, Typography, TextField, Button, Link } from '@mui/material'
import { styled } from '@mui/material/styles'
import axios from 'axios'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import React, { useContext, useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { Store } from '../utils/store'
import Cookies from 'js-cookie'

const Form = styled('form')(() => ({
  width: '100%',
  maxWidth: 800,
  margin: '0 auto',
}))

const Register = () => {
  const router = useRouter()
  const redirect = router.query
  const { state, dispatch } = useContext(Store)
  const { userInfo } = state

  useEffect(() => {
    if (userInfo) {
      router.push('/')
    }
  }, [])

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const submitHandler = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert(`passwords dont't match`)
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
      alert(error.response.data ? error.response.data.message : error.message)
    }
  }
  return (
    <Layout title='Register'>
      <Form onSubmit={submitHandler}>
        <Typography component='h1' variant='h1'>
          Register
        </Typography>
        <List>
          <ListItem>
            <TextField variant='outlined' fullWidth id='name' label='Name' inputProps={{ type: 'text' }} onChange={(e) => setName(e.target.value)}></TextField>
          </ListItem>
          <ListItem>
            <TextField variant='outlined' fullWidth id='email' label='Email' inputProps={{ type: 'email' }} onChange={(e) => setEmail(e.target.value)}></TextField>
          </ListItem>
          <ListItem>
            <TextField variant='outlined' fullWidth id='password' label='Password' inputProps={{ type: 'password' }} onChange={(e) => setPassword(e.target.value)}></TextField>
          </ListItem>
          <ListItem>
            <TextField variant='outlined' fullWidth id='confirmPassword' label='Confirm Password' inputProps={{ type: 'password' }} onChange={(e) => setConfirmPassword(e.target.value)}></TextField>
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
