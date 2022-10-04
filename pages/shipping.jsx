import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Store } from '../utils/store'

const Shipping = () => {
  const router = useRouter()
  const {
    state: { userInfo },
    dispatch,
  } = useContext(Store)
  useEffect(() => {
    if (!userInfo) {
      //如果在shipping页logout (或者userInfo cookie删除), 就会到login page, 然后router.query.redirect就是/shipping。如果这时登陆成功，将重新回到shipping.
      router.push('/login?redirect=/shipping')
    }
  }, [])

  return <div>Shipping</div>
}

export default Shipping
