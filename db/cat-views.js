import { db, networkHelpers, stringHelpers } from 'ctzn'
import { getCat, listCats } from '../db/getters.js'

const { fetchUserId } = networkHelpers
const { isHyperUrl, parseEntryUrl } = stringHelpers

export const setup = function setup({define, getDb, getListOpts}) {
  define('my.network/cat-view', async (auth, userId, catKey) => {
    if (!catKey && isHyperUrl(userId)) {
      let {origin, schemaId, key} = parseEntryUrl(userId)
      if (schemaId !== 'my.network/cat') {
        return undefined
      }
      userId = await fetchUserId(origin)
      catKey = key
    } else {
      userId = await fetchUserId(userId)
    }
    const db = getDb(userId)
    return getCat(db, catKey, userId, auth)
  })

  define('my.network/cats-view', async (auth, userId, opts) => {
    userId = await fetchUserId(userId)
    const db = getDb(userId)
    return {cats: await listCats(db, getListOpts(opts), userId, auth)}
  })
}
