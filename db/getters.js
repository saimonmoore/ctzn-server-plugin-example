import { db, dbHelpers, stringHelpers, networkHelpers } from 'ctzn'

const { dbGet, fetchAuthor, fetchVotes, fetchReplyCount, fetchReplies, fetchSelfIndexFollowerIds, fetchCommunityIndexesFollowerIds } = dbHelpers
const { fetchUserId, fetchUserInfo } = networkHelpers
const { constructEntryUrl, parseEntryUrl } = stringHelpers
const { publicUserDbs } = db

export async function getCat (db, key, authorId, auth = undefined) {
  const catEntry = await db.cats.get(key)
  if (!catEntry) {
    throw new Error('Cat not found')
  }
  catEntry.url = constructEntryUrl(db.url, 'my.network/cat', catEntry.key)
  catEntry.author = await fetchAuthor(authorId)
  return catEntry
}

export async function listCats (db, opts, authorId, auth = undefined) {
  if (db.dbType === 'ctzn.network/public-citizen-db') {
    const entries = await db.cats.list(opts)
    const authorsCache = {}
    for (let entry of entries) {
      entry.url = constructEntryUrl(db.url, 'my.network/cat', entry.key)
      entry.author = await fetchAuthor(authorId, authorsCache)
    }
    return entries
  }
}
