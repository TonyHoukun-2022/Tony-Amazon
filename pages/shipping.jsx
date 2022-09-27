import { useRouter } from 'next/router'

const Shipping = () => {
  const router = useRouter()
  router.push('/login')
  return <div>Shipping</div>
}

export default Shipping
