import { randomBytes } from 'crypto'
import nats, { Message } from 'node-nats-streaming'

console.clear()

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222'
})

stan.on('connect', () => {
  console.log('Listener connected to NATS')

  stan.on('close', () => {
    console.log('NATS connection closed')
    process.exit()
  })

  const options = stan.subscriptionOptions()
                      .setManualAckMode(true)
                      .setDeliverAllAvailable() // Deliver all previous events when we start the listener
                      .setDurableName('orders-service') // Store the fact that this listener has processed the event or not, so redeliver does not deliver same event again

  const subscription = stan.subscribe(
    'ticket:created',
    'listener-queue-group', // Used to not dump the durable subscription history if the listener disconnects. If removed the listened will get all events despites "setDurableName"
    options                    // Also used to make sure that the event goes to only one listener even if we have multuiple instances of the listener
    )

  subscription.on('message', (msg: Message) => {
    const data = msg.getData()

    if (typeof data === 'string') {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`)
    }

    msg.ack()
  })
})

process.on('SIGINT', () => stan.close())
process.on('SIGTERM', () => stan.close())
