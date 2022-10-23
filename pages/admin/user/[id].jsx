import axios from 'axios'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import React, { useEffect, useContext, useReducer, useState } from 'react'
import { Grid, List, ListItem, Typography, Card, Button, ListItemText, TextField, CircularProgress, Checkbox, FormControlLabel, ListItemButton } from '@mui/material'
import { styled } from '@mui/material/styles'
import { getError } from '../../../utils/error'
import { Store } from '../../../utils/store'
import Layout from '../../../components/Layout'
import { Controller, useForm } from 'react-hook-form'
import { useSnackbar } from 'notistack'

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

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: '' }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true, errorUpdate: '' }
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false, errorUpdate: '' }
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false, errorUpdate: action.payload }
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' }
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      }
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload }
    default:
      return state
  }
}

const UserEdit = ({ params }) => {
  const [isAdmin, setIsAdmin] = useState(false)

  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const router = useRouter()
  const userId = params.id
  const {
    state: { userInfo },
  } = useContext(Store)

  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    loadingUpdate: false,
    errorUpdate: '',
    loadingUpload: false,
    errorUpload: '',
  })

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm()

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login')
    }
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const { data: user } = await axios.get(`/api/admin/users/${userId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        })
        setIsAdmin(user.isAdmin)
        dispatch({ type: 'FETCH_SUCCESS' })
        setValue('name', user.name)
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
      }
    }
    fetchData()
  }, [])

  const submitHandler = async ({ name }) => {
    closeSnackbar()
    try {
      dispatch({ type: 'UPDATE_REQUEST' })
      await axios.put(
        `/api/admin/users/${userId}`,
        {
          name,
          isAdmin,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      )
      dispatch({ type: 'UPDATE_SUCCESS' })
      enqueueSnackbar('User updated successfully', { variant: 'success' })
      router.push('/admin/users')
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL', payload: getError(err) })
      enqueueSnackbar(getError(err), { variant: 'error' })
    }
  }

  return (
    <Layout title={`Edit User ${userId}`}>
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
                <ListItemButton component='a'>
                  <ListItemText primary='Products'></ListItemText>
                </ListItemButton>
              </NextLink>
              <NextLink href='/admin/users' passHref>
                <ListItemButton selected component='a'>
                  <ListItemText primary='Users'></ListItemText>
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
                  Edit User {userId}
                </Typography>
              </ListItem>
              <ListItem>
                {loading && <CircularProgress />}
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
                      <FormControlLabel
                        label='Is Admin'
                        control={
                          <Checkbox
                            name='isAdmin'
                            onClick={(e) => {
                              //   console.log(e.target.checked)//false or true
                              setIsAdmin(e.target.checked)
                            }}
                            checked={isAdmin}
                          />
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <Button variant='contained' type='submit' fullWidth color='primary'>
                        Update
                      </Button>
                      {loadingUpdate && <CircularProgress />}
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

export async function getServerSideProps({ params }) {
  return {
    props: { params },
  }
}

export default UserEdit
