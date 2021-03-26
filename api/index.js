import { setup as setupCats } from './cats.js'

export const apiExtensions = {
  setup: function setup(wsServer, config) {
    setupCats(wsServer, config)
    console.log('[ctzn-server-plugin-example] Extended api websocket server!')
  }
}
