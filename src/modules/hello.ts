import { Client, ServerClient } from 'minecraft-protocol'
import { Bound, ExtendedPacketMeta, ModOptions } from '../interfaces'

export default {
  packets: {
    [Bound.toClient]: [],
    [Bound.toServer]: [
      'chat'
    ]
  },
  run: async (data: any, meta: ExtendedPacketMeta, toClient: ServerClient, toServer: Client, modOptions: ModOptions): Promise<void> => {
    const message = data.message as string
    if (message === 'hi') {
      meta.isCancelled = true
      toClient.write('chat', { message: '{"text":"hello"}', position: 0 })
    }
  },
  runOnce: async (toClient: ServerClient, toServer: Client, modOptions: ModOptions): Promise<void> => {

  }
}
