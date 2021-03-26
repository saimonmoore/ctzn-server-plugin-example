import test from 'ava'
import { createServer, TestFramework } from './_util.js'

let close
let api
let sim = new TestFramework()

test.before(async () => {
  let inst = await createServer()
  close = inst.close
  api = inst.api

  await sim.createCitizen(inst, 'bob')
  const {bob, catLovers } = sim.users
  await bob.login()
})

test.after.always(async t => {
	await close()
})

test('single user creating cats', async t => {
  const bob = sim.users.bob
  await bob.createCat({ name: 'Fuffly' })
  await bob.createCat({ name: 'Wuffly' })
  await bob.createCat({ name: 'Ruffly' })

  let catEntries = (await api.view.get('my.network/cats-view', bob.userId)).cats
  sim.testCatFeed(t, catEntries, [
    [bob, 'Fuffly'],
    [bob, 'Wuffly'],
    [bob, 'Ruffly']
  ])

  catEntries = (await api.view.get('my.network/cats-view', bob.userId, {reverse: true})).cats
  sim.testCatFeed(t, catEntries, [
    [bob, 'Ruffly'],
    [bob, 'Wuffly'],
    [bob, 'Fuffly']
  ])

  catEntries = (await api.view.get('my.network/cats-view', bob.userId, {limit: 2})).cats
  sim.testCatFeed(t, catEntries, [
    [bob, 'Fuffly'],
    [bob, 'Wuffly'],
  ])

  await api.table.update(
    bob.userId,
    'my.network/cat',
    bob.cats[0].key,
    Object.assign({}, bob.cats[0].value, {name: 'Buffly'})
  )
  let editedCat = await api.view.get('my.network/cat-view', bob.userId, bob.cats[0].key)

  sim.testCat(t, editedCat, [bob, 'Buffly'])

  await api.table.delete(bob.userId, 'my.network/cat', bob.cats[0].key)
  await t.throwsAsync(() => api.view.get('my.network/cat-view', bob.userId, bob.cats[0].key))
  catEntries = (await api.view.get('my.network/cats-view', bob.userId, {limit: 2})).cats

  sim.testCatFeed(t, catEntries, [
    [bob, 'Wuffly'],
    [bob, 'Ruffly']
  ])
})
