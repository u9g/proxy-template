import { Client } from 'minecraft-protocol'
import { Bot, createBot } from 'mineflayer'
import { ModOptions } from './interfaces'

function createMineflayer (client: Client): Bot {
  const proxy = new Proxy(client, {
    get: (target, prop, receiver) => {
      if (prop === 'write') return () => {}
      return target[prop]
    }
  })
  const bot = createBot({
    client: proxy
  })
  return bot
}

export const makeBlankModOptions = (client: Client): ModOptions => {
  return {
    bot: createMineflayer(client),
    isEnabled: true,
    username: client.username
  }
}
