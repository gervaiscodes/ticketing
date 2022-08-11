import { randomBytes } from 'crypto'
import nats, { Message, Stan } from 'node-nats-streaming'
import { MethodSignature } from 'typescript'

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

abstract class Listener {
  abstract subject: string
  abstract queueGroupName: string
  private client: Stan
  protected ackWait = 5 * 1000 // 5 sec

  constructor(client: Stan) {
    this.client = client
  }

  abstract onMessage(data: any, msg: Message): void

  subscriptionOptions() {
    return this.client.subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName)
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    )

    subscription.on('message', (msg: Message) => {
      console.log(
        `Message received: ${this.subject} / ${this.queueGroupName}`
      )

      const parsedData = this.parseMessage(msg)

      this.onMessage(parsedData, msg)
    })
  }

  parseMessage(msg: Message) {
    const data = msg.getData()

    return (typeof data === 'string') ? JSON.parse(data) : JSON.parse(data.toString('utf8'))
  }
}
