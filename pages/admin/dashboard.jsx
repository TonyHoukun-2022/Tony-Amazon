import axios from 'axios'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import React, { useEffect, useContext, useReducer } from 'react'
import { CircularProgress, Grid, List, ListItem, Typography, Card, Button, ListItemText, CardContent, CardActions, ListItemButton } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { getError } from '../../utils/error'
import { Store } from '../../utils/store'
import Layout from '../../components/Layout'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, summary: action.payload, error: '' }
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

const AdminDashBoard = () => {
  const {
    state: { userInfo },
  } = useContext(Store)
  const router = useRouter()

  const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
    loading: true,
    summary: {
      salesData: [],
    },
    error: '',
  })

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login')
    }
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const { data } = await axios.get(`/api/admin/summary`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        })
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) })
      }
    }
    fetchData()
  }, [])

  return (
    <Layout title='Admin Dashboard'>
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <SectionCard>
            <List>
              <NextLink href='/admin/dashboard' passHref>
                <ListItemButton selected component='a'>
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
            </List>
          </SectionCard>
        </Grid>
        <Grid item md={9} xs={12}>
          <SectionCard>
            <List>
              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography sx={{ color: '#f04040' }}>{error}</Typography>
                ) : (
                  <Grid container spacing={5}>
                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant='h1'>${summary.totalSalesAmount}</Typography>
                          <Typography>Sales</Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink href='/admin/orders' passHref>
                            <Button size='small' color='primary'>
                              View sales
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant='h1'>{summary.ordersCount}</Typography>
                          <Typography>Orders</Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink href='/admin/orders' passHref>
                            <Button size='small' color='primary'>
                              View orders
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant='h1'>{summary.productsCount}</Typography>
                          <Typography>Products</Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink href='/admin/products' passHref>
                            <Button size='small' color='primary'>
                              View products
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant='h1'>{summary.usersCount}</Typography>
                          <Typography>Users</Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink href='/admin/users' passHref>
                            <Button size='small' color='primary'>
                              View users
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                  </Grid>
                )}
              </ListItem>
              <ListItem>
                <Typography component='h1' variant='h1'>
                  Sales Chart
                </Typography>
              </ListItem>
              <ListItem>
                <Bar
                  data={{
                    labels: summary.salesData.map((x) => x._id),
                    datasets: [
                      {
                        label: 'Sales',
                        backgroundColor: 'rgba(162, 222, 208, 1)',
                        data: summary.salesData.map((x) => x.totalSalesAmountByDay),
                      },
                    ],
                  }}
                  options={{
                    legend: { display: true, position: 'right' },
                  }}
                />
              </ListItem>
            </List>
          </SectionCard>
        </Grid>
      </Grid>
    </Layout>
  )
}

export default AdminDashBoard
