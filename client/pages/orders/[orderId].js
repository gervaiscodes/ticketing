import { useEffect, useState } from 'react'
import Router from 'next/router'
import StripeCheckout from 'react-stripe-checkout'
import useRequest from '../../hooks/use-request'

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0)
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: (payment) => {
      Router.push('/orders')
    }
  })

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date()
      setTimeLeft(Math.round(msLeft / 1000))
    }

    findTimeLeft()
    const timerId = setInterval(findTimeLeft, 1000)

    return () => {
      clearInterval(timerId)
    }
  }, [])

  if (timeLeft < 0) {
    return (
      <div>Order expired</div>
    )
  }

  return (
    <div>
      {timeLeft} seconds until the order expires
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51LhymVGVK5xAMwPwBm7H1XkNhZMSGPk7ZGSIohGWtW7cttRDR9fCfQ1FMACynVsl4s771WudKSuhfYECOc98MPVM00m0QIptJK"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  )
}

OrderShow.getInitialProps = async (context, client, currentUser) => {
  const { orderId } = context.query
  const { data } = await client.get(`/api/orders/${orderId}`)

  return { order: data }
}

export default OrderShow

