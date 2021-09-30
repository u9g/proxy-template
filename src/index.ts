/* eslint-disable @typescript-eslint/no-misused-promises, @typescript-eslint/no-floating-promises */
import { install } from 'source-map-support'
import { readFileSync } from 'fs'
import { InstantConnectProxy } from 'prismarine-proxy'
import { serverOptions, clientOptions } from './constants'
import { Bound, ExtendedPacketMeta, ModOptions, Module } from './interfaces'
import { Client, ServerClient } from 'minecraft-protocol'
import { startProgram } from './util'

import hello from './modules/hello'
import { makeBlankModOptions } from './helpers'

install()

// this array is the order that the plugins are called in
const modules: Module[] = [
  hello
]

async function main (): Promise<void> {
  if (!await startProgram()) return
  const logins = JSON.parse(readFileSync('./logins.json', 'utf-8'))
  const proxy = new InstantConnectProxy({
    loginHandler: client => logins[client.username],
    serverOptions,
    clientOptions
  })

  const modOptionsStore = new Map()
  const starting: { [username: string]: boolean } = {}

  proxy.on('start', (toClient, toServer) => {
    const login = logins[toServer.username]
    const hasLogin = login?.username !== undefined && login?.password !== undefined
    if (!hasLogin) throw new Error('Username and Password not setup correctly')
  })

  proxy.on('end', (username) => {
    starting[username] = false
    modOptionsStore.delete(username)
  })

  proxy.on('incoming', async (data, _meta, toClient, toServer) => {
    if (!starting[toServer.username] && modOptionsStore.get(toServer.username) === undefined) {
      ;(async () => {
        starting[toServer.username] = true
        const modOptions: ModOptions = makeBlankModOptions(toServer)
        for (const module of modules) {
          await module.runOnce(toClient, toServer, modOptions)
        }
        modOptionsStore.set(toServer.username, modOptions)
      })()
    }
    await callModule(data, { ..._meta, bound: Bound.toClient, isCancelled: false }, toClient, toServer, Bound.toClient)
  })

  proxy.on('outgoing', async (data, _meta, toClient, toServer) => {
    await callModule(data, { ..._meta, bound: Bound.toServer, isCancelled: false }, toClient, toServer, Bound.toServer)
  })

  async function callModule (data: any, meta: ExtendedPacketMeta, toClient: ServerClient, toServer: Client, bound: Bound): Promise<void> {
    const modOptions = modOptionsStore.get(toServer.username)
    if (modOptions !== undefined && modOptions.listenToChat === true) {
      for (const module of modules) {
        if ((module.packets[bound]).includes(meta.name)) {
          await module.run(data, meta, toClient, toServer, modOptions)
        }
      }
    }
    if (!meta.isCancelled) {
      switch (bound) {
        case Bound.toClient:
          toClient.write(meta.name, data)
          break
        case Bound.toServer:
          toServer.write(meta.name, data)
          break
      }
    }
  }
}

main() // eslint-disable-line
