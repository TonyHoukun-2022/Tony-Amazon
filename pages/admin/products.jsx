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

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: action.payload, error: '' }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }
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

const AdminProducts = () => {
  const {
    state: { userInfo },
  } = useContext(Store)
  const router = useRouter()

  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    loading: true,
    products: [],
    error: '',
  })

  useEffect(() => {
    if (!userInfo) {
      router.push('/login')
    }
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const { data } = await axios.get(`/api/admin/products`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        })
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
      }
    }
    fetchData()
  }, [])

  return (
    <Layout title='Products'>
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <SectionCard>
            <List>
              <NextLink href='/admin/dashboard' passHref>
                <ListItemButton button='true' component='a'>
                  <ListItemText primary='Admin Dashboard' />
                </ListItemButton>
              </NextLink>
              <NextLink href='/admin/orders' passHref>
                <ListItemButton button='true' component='a'>
                  <ListItemText primary='Orders' />
                </ListItemButton>
              </NextLink>
              <NextLink href='/admin/products' passHref>
                <ListItemButton selected button='true' component='a'>
                  <ListItemText primary='Products' />
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
                  Products
                </Typography>
              </ListItem>

              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography sx={{ color: 'red' }}>{error}</Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>NAME</TableCell>
                          <TableCell>PRICE</TableCell>
                          <TableCell>CATEGORY</TableCell>
                          <TableCell>COUNT</TableCell>
                          <TableCell>RATING</TableCell>
                          <TableCell>ACTIONS</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product._id}>
                            <TableCell>{product._id.substring(20, 24)}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>${product.price}</TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>{product.countInStock}</TableCell>
                            <TableCell>{product.rating}</TableCell>
                            <TableCell>
                              <NextLink href={`/admin/product/${product._id}`} passHref>
                                <Button size='small' variant='contained'>
                                  Edit
                                </Button>
                              </NextLink>{' '}
                              <Button size='small' variant='contained'>
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

export default dynamic(() => Promise.resolve(AdminProducts), { ssr: false })
