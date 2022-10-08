import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import { Store } from '../utils/store'

import { Button, FormControl, FormControlLabel, List, ListItem, Radio, RadioGroup, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useSnackbar } from 'notistack'

import Layout from '../components/Layout'
import CheckoutWizard from '../components/CheckoutWizard'

const Form = styled('form')(() => ({
  width: '100%',
  maxWidth: 800,
  margin: '0 auto',
}))

const Payment = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const { state, dispatch } = useContext(Store)
  const {
    cart: { shippingInfo },
  } = state
  const [paymentMethod, setPaymentMethod] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (!shippingInfo.address) {
      router.push('/shipping')
    } else {
      setPaymentMethod(() => {
        if (Cookies.get('paymentMethod')) {
          return JSON.parse(Cookies.get('paymentMethod')).replace(/[^a-z]/gi, '')
        } else {
          return ''
        }
      })
    }
  }, [])

  /** replace non-alphabet with '' */
  //   console.log(paymentMethod.replace(/[^a-z]/gi, ''))

  const submitHandler = (e) => {
    closeSnackbar()
    e.preventDefault()
    if (paymentMethod === '') {
      enqueueSnackbar('Payment method is required', { variant: 'error' })
      return
    }
    //when payment method is not empty
    dispatch({
      type: 'SAVE_PAYMENT_METHOD',
      payload: paymentMethod,
    })
    Cookies.set('paymentMethod', JSON.stringify(paymentMethod))
    router.push('/placeorder')
  }
  return (
    <Layout title='Payment Method'>
      <CheckoutWizard activeStep={2} />
      <Form onSubmit={submitHandler}>
        <Typography component='h1' variant='h1'>
          Payment Method
        </Typography>
        <List>
          <ListItem>
            <FormControl component='fieldset'>
              <RadioGroup aria-label='Payment Method' name='paymentMethod' value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <FormControlLabel label='PayPal' value='PayPal' control={<Radio />} />
                <FormControlLabel label='Stripe' value='Stripe' control={<Radio />} />
                <FormControlLabel label='Cash' value='Cash' control={<Radio />} />
              </RadioGroup>
            </FormControl>
          </ListItem>
          <ListItem>
            <Button fullWidth type='submit' variant='contained' color='primary'>
              Continue
            </Button>
          </ListItem>
          <ListItem>
            <Button fullWidth type='button' variant='contained' color='third' onClick={() => router.push('/shipping')}>
              Back
            </Button>
          </ListItem>
        </List>
      </Form>
    </Layout>
  )
}

export default Payment
