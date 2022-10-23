import axios from 'axios'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import React, { useEffect, useContext, useReducer } from 'react'
import { CircularProgress, Grid, List, ListItem, Typography, Card, Button, ListItemText, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, ListItemButton } from '@mui/material'
import { styled } from '@mui/material/styles'
import { getError } from '../../utils/error'
import { Store } from '../../utils/store'
import Layout from '../../components/Layout'
import { useSnackbar } from 'notistack'

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, users: action.payload, error: '' }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true }
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true }
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false }
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false }
    default:
      state
  }
}

const SectionCard = styled(Card)({
  marginTop: 1,
  marginBottom: 1,
  '& a': {
    textDecoration: 'none',
  },
})

const AdminUsers = () => {
  const router = useRouter()
  const {
    state: { userInfo },
  } = useContext(Store)

  const { enqueueSnackbar } = useSnackbar()

  const [{ loading, error, users, successDelete, loadingDelete }, dispatch] = useReducer(reducer, {
    loading: true,
    users: [],
    error: '',
    successDelete: false,
    loadingDelete: false,
  })

  useEffect(() => {
    if (!userInfo) {
      router.push('/login')
    }
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const { data: users } = await axios.get(`/api/admin/users`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        })
        dispatch({ type: 'FETCH_SUCCESS', payload: users })
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
      }
    }
    //after delete successfully, fetch products again
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' })
    } else {
      fetchData()
    }
  }, [successDelete])

  const deleteHandler = async (userId) => {
    if (!window.confirm('Are you sure?')) {
      return
    }
    try {
      dispatch({ type: 'DELETE_REQUEST' })
      await axios.delete(`/api/admin/users/${userId}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      })
      dispatch({ type: 'DELETE_SUCCESS' })
      enqueueSnackbar('User deleted successfully', { variant: 'success' })
    } catch (err) {
      dispatch({ type: 'DELETE_FAIL' })
      enqueueSnackbar(getError(err), { variant: 'error' })
    }
  }

  return (
    <Layout title='Users'>
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <SectionCard>
            <List>
              <NextLink href='/admin/dashboard' passHref>
                <ListItemButton component='a'>
                  <ListItemText primary='Admin Dashboard' />
                </ListItemButton>
              </NextLink>
              <NextLink href='/admin/orders' passHref>
                <ListItemButton component='a'>
                  <ListItemText primary='Orders' />
                </ListItemButton>
              </NextLink>
              <NextLink href='/admin/products' passHref>
                <ListItemButton component='a'>
                  <ListItemText primary='Products' />
                </ListItemButton>
              </NextLink>
              <NextLink href='/admin/users' passHref>
                <ListItemButton selected component='a'>
                  <ListItemText primary='Users' />
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
                  Users
                </Typography>
                {loadingDelete && <CircularProgress />}
              </ListItem>

              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography className={classes.error}>{error}</Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>NAME</TableCell>
                          <TableCell>EMAIL</TableCell>
                          <TableCell>IsAdmin</TableCell>
                          <TableCell>ACTIONS</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user._id}>
                            <TableCell>{user._id.substring(20, 24)}</TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.isAdmin ? 'YES' : 'NO'}</TableCell>
                            <TableCell>
                              <NextLink href={`/admin/user/${user._id}`} passHref>
                                <Button size='small' variant='contained'>
                                  Edit
                                </Button>
                              </NextLink>{' '}
                              <Button onClick={() => deleteHandler(user._id)} size='small' variant='contained'>
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </ListItem>
            </List>
          </SectionCard>
        </Grid>
      </Grid>
    </Layout>
  )
}

export default dynamic(() => Promise.resolve(AdminUsers), { ssr: false })
