import { StoreProvider } from '../utils/store'
import { SnackbarProvider } from 'notistack'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import '../styles/global.css'

function MyApp({ Component, pageProps }) {
  return (
    <SnackbarProvider maxStack={3} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <StoreProvider>
        <PayPalScriptProvider deferLoading={true}>
          <Component {...pageProps} />
        </PayPalScriptProvider>
      </StoreProvider>
    </SnackbarProvider>
  )
}

export default MyApp
