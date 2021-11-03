export const serverOptions = {
  version: '1.8.9',
  beforePing: (_, client) => ({
    version: { name: 'proxy-template', protocol: 340 }, // name is shown for incompatible servers
    players: { max: 1, online: 0 },
    description: 'My great server!\nGo ahead, join!',
    latency: 1
  })
}

export const clientOptions = {
  version: '1.8.9',
  host: 'mc.hypixel.net'
}
