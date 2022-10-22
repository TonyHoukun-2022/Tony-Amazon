import axios from 'axios'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
import NexLink from 'next/link'
import React, { useEffect, useContext } from 'react'
import { Grid, List, ListItem, ListItemButton, Typography, Card, Button, ListItemText, TextField } from '@mui/material'
import { getError } from '../utils/error'
import { Store } from '../utils/store'
import Layout from '../components/Layout'
import { Controller, useForm } from 'react-hook-form'
import { useSnackbar } from 'notistack'
import Cookies from 'js-cookie'

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

const Profile = () => {
  const {
    state: { userInfo },
    dispatch,
  } = useContext(Store)
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const router = useRouter()

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login')
    }
    setValue('name', userInfo.name)
    setValue('email', userInfo.email)
  }, [])

  const submitHandler = async ({ name, email, password, confirmPassword }) => {
    closeSnackbar()
    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords don't match", { variant: 'error' })
      return
    }
    try {
      const { data: updatedUser } = await axios.put(
        'api/users/profile',
        {
          name,
          email,
          password,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      )
      dispatch({
        type: 'USER_LOGIN',
        payload: updatedUser,
      })
      Cookies.set('userInfo', JSON.stringify(updatedUser))
      enqueueSnackbar('Profile updated successfully', { variant: 'success' })
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: 'error' })
    }
  }

  return (
    <Layout title='Profile'>
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <SectionCard>
            <List>
              <NexLink href='/profile' passHref>
                <ListItemButton selected component='a'>
                  <ListItemText primary='User Profile' />
                </ListItemButton>
              </NexLink>
              <NexLink href='/order-history' passHref>
                <ListItemButton component='a'>
                  <ListItemText primary='Order History' />
                </ListItemButton>
              </NexLink>
            </List>
          </SectionCard>
        </Grid>
        <Grid item md={9} xs={12}>
          <SectionCard>
            <List>
              <ListItem>
                <Typography component='h1' variant='h1'>
                  Profile
                </Typography>
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
                          minLength: 2,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant='outlined'
                            fullWidth
                            id='name'
                            label='Name'
                            inputProps={{ type: 'name' }}
                            error={Boolean(errors.name)}
                            helperText={errors.name ? (errors.name.type === 'minLength' ? 'Name length is at least 2' : 'Name is required') : ''}
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
                            error={Boolean(errors.email)}
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
                        //validate value should be empty (not reset, use old) or the length at least 6, otherwise raise error
                        rules={{
                          validate: (value) => value === '' || value.length > 5 || 'Password length should be at least 6',
                        }}
                        render={({ field }) => (
                          <TextField
                            variant='outlined'
                            fullWidth
                            id='password'
                            label='Password'
                            inputProps={{ type: 'password' }}
                            error={Boolean(errors.password)}
                            helperText={errors.password ? 'Password length should be at least 6' : ''}
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
                          validate: (value) => value === '' || value.length > 5 || 'Confirm Password length should be at least 6',
                        }}
                        render={({ field }) => (
                          <TextField
                            variant='outlined'
                            fullWidth
                            id='confirmPassword'
                            label='Confirm Password'
                            inputProps={{ type: 'password' }}
                            error={Boolean(errors.confirmPassword)}
                            helperText={errors.password ? 'Confirm Password length should be at least 6' : ''}
                            {...field}
                          />
                        )}
                      />
                    </ListItem>
                    <ListItem>
                      <Button variant='contained' type='submit' fullWidth color='primary'>
                        Update
                      </Button>
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

export default dynamic(() => Promise.resolve(Profile), { ssr: false })
