const OrderIndex = ({ orders }) => {
  return (
    <div>
      <h1>Order index</h1>
      <ul>
        {
          orders.map(order => {
            return (
              <li key={order.id}>
                {order.ticket.title} - {order.ticket.price} - {order.status}
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/orders')

  return { orders: data }
}

export default OrderIndex
