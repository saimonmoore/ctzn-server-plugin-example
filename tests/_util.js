import { Client as WsClient } from 'rpc-websockets'
import tmp from 'tmp-promise'
import { stringHelpers } from 'ctzn'
import { spawn } from 'child_process'
import * as path from 'path'
import { fileURLToPath } from 'url'

const { parseEntryUrl, DEBUG_MODE_PORTS_MAP } = stringHelpers
const INSPECTOR_ENABLED = false

let nServer = 1
export async function createServer (extensions = 'dbrain-core,ctzn-server-plugin-example') {
  const tmpdir = await tmp.dir({unsafeCleanup: true})
  const domain = `dev${nServer++}.localhost`
  const port = DEBUG_MODE_PORTS_MAP[domain]
  console.log('Storing config in', tmpdir.path)

  const binPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'bin.js')
  const serverProcess = spawn(
    'node',
    [binPath, 'start-test', '--configDir', tmpdir.path, '--domain', domain, '--extensions', extensions || ''],
    {
      stdio: [process.stdin, process.stdout, process.stderr],
      env: INSPECTOR_ENABLED ? Object.assign({}, process.env, {NODE_OPTIONS: `--inspect=localhost:${5555+nServer}`}) : undefined
    }
  )

  const client = new WsClient(`ws://localhost:${port}/`)
  const api = await createRpcApi(client)
  await api.debug.whenServerReady()

  return {
    url: `http://localhost:${port}/`,
    domain,
    client,
    api,
    process: serverProcess,
    close: async () => {
      const p = new Promise(r => {
        if (serverProcess.exitCode !== null) r()
        serverProcess.on('exit', r)
      })
      serverProcess.kill()
      await p
      await tmpdir.cleanup()
    }
  }
}

async function createRpcApi (ws) {
  await new Promise(resolve => ws.on('open', resolve))

  return new Proxy({url: ws.address}, {
    get (target, prop) {
      // generate rpc calls as needed
      if (!(prop in target)) {
        target[prop] = new Proxy({}, {
          get (target, prop2) {
            if (!(prop2 in target)) {
              target[prop2] = async (...params) => {
                try {
                  return await ws.call(`${prop}.${prop2}`, params)
                } catch (e) {
                  throw new Error(e.data || e.message)
                }
              }
            }
            return target[prop2]
          }
        })
      }

      return target[prop]
    }
  })
}

export class TestFramework {
  constructor () {
    this.users = {}
  }

  async createCitizen (inst, username) {
    const user = new TestCitizen(inst, username)
    await user.setup()
    this.users[username] = user
    return user
  }

  async createCommunity (inst, username) {
    const user = new TestCommunity(inst, username)
    await user.setup()
    this.users[username] = user
    return user
  }

  async dbmethod (inst, database, method, args) {
    var res = await inst.api.dbmethod.call({database, method, args})
    if (res.result.code !== 'success') {
      throw new Error(res.result.details?.message || res.result.code)
    }
    return res
  }

  testCatFeed (t, entries, desc) {
    t.is(entries.length, desc.length)
    for (let i = 0; i < desc.length; i++) {
      this.testCat(t, entries[i], desc[i])
    }
  }

  testCat (t, entry, desc) {
    const user = desc[0]
    t.truthy(entry.url.startsWith(user.profile.dbUrl))
    t.is(entry.author.userId, user.userId)
    t.is(entry.value.name, desc[1])
  }
}

class TestCitizen {
  constructor (inst, username) {
    this.inst = inst
    this.username = username
    this.userId = undefined
    this.dbUrl = undefined
    this.cats = []
  }

  async setup () {
    const {userId} = await this.inst.api.debug.createUser({
      type: 'citizen',
      username: this.username,
      email: `${this.username}@email.com`,
      password: 'password',
      profile: {
        displayName: this.username.slice(0, 1).toUpperCase() + this.username.slice(1)
      }
    })
    this.userId = userId
    this.profile = await this.inst.api.view.get('ctzn.network/profile-view', userId)
  }

  async login () {
    await this.inst.api.accounts.login({username: this.username, password: 'password'})
  }

  async createCat ({ name }) {
    await this.login()
    const {url} = await this.inst.api.table.create(
      this.userId,
      'my.network/cat',
      {name, createdAt: (new Date()).toISOString(), updatedAt: (new Date()).toISOString()}
    )
    this.cats.push(await this.inst.api.view.get('my.network/cat-view', url))
    return this.cats[this.cats.length - 1]
  }
}

class TestCommunity {
  constructor (inst, username) {
    this.inst = inst
    this.username = username
    this.userId = undefined
    this.members = {}
  }

  async setup () {
    const {userId} = await this.inst.api.communities.create({
      username: this.username,
      displayName: this.username.slice(0, 1).toUpperCase() + this.username.slice(1)
    })
    this.userId = userId
    this.profile = await this.inst.api.view.get('ctzn.network/profile-view', userId)
  }
}
