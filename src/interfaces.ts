import { Client, PacketMeta, ServerClient } from 'minecraft-protocol'
import { Bot } from 'mineflayer'

export interface ModOptions {
  username: string
  bot: Bot
  isEnabled: boolean
}

export enum Bound {
  toServer = 'toServer',
  toClient = 'toClient'
}

export interface ExtendedPacketMeta extends PacketMeta {
  bound: Bound.toServer | Bound.toClient
  isCancelled: boolean
}

async function run (data: any, meta: ExtendedPacketMeta, toClient: ServerClient, toServer: Client, modOptions: ModOptions): Promise<void> {}
async function runOnce  (toClient: ServerClient, toServer: Client, modOptions: ModOptions): Promise<void> {}

export interface Module {
    packets: {
        [Bound.toClient]: string[]
        [Bound.toServer]: string[]
    },
    run: typeof run,
    runOnce: typeof runOnce
}