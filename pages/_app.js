import { StoreProvider } from '../utils/store'
import { SnackbarProvider } from 'notistack'
import '../styles/global.css'

function MyApp({ Component, pageProps }) {
  return (
    <SnackbarProvider maxStack={3} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <StoreProvider>
        <Component {...pageProps} />
      </StoreProvider>
    </SnackbarProvider>
  )
}

export default MyApp
