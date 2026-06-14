import { Readable } from 'node:stream'

import test from 'ava'

import { Blake3Hasher, blake3 } from '../index'

test('blake3', (t) => {
  const hasher = new Blake3Hasher()
  t.is(
    hasher.update('hello world').digest('hex'),
    'd74981efa70a0c880b8d8c1985d075dbcbf679b99a5f9914e5aaf96b831a9e24',
  )
})

test('blake3 keyed', (t) => {
  const derivedKey = Blake3Hasher.deriveKey('secret', Buffer.from('salt'))
  const hasher = Blake3Hasher.newKeyed(derivedKey)
  t.is(
    hasher.update('hello world').digest('hex'),
    'e654a33cb9b9573b8cf9f4a3c5c8bc19dbfeb6362584ee55b1545e98492650f0',
  )
})

test('blake3 digestStream', async (t) => {
  const buf = Buffer.from('hello world stream test')
  const web = () => Readable.toWeb(Readable.from(buf))
  t.is(
    await new Blake3Hasher().digestStream(web()),
    blake3(buf).toString('hex'),
  )
})

test('blake3 digestStreamBuffer', async (t) => {
  const buf = Buffer.from('hello world stream test')
  const web = () => Readable.toWeb(Readable.from(buf))
  t.deepEqual(await new Blake3Hasher().digestStreamBuffer(web()), blake3(buf))
})

test('blake3 digestStream composition and non-mutation', async (t) => {
  const buf = Buffer.from('hello world stream test')
  const web = () => Readable.toWeb(Readable.from(buf))

  const h = new Blake3Hasher()
  h.update('prefix')
  const streamed = await h.digestStream(web())

  const expected = new Blake3Hasher().update('prefix').update(buf).digest('hex')
  t.is(streamed, expected)

  // digestStream took &self (snapshot via clone), so `h` is NOT consumed.
  // It still only holds 'prefix' and can be reused.
  const streamedAgain = await h.digestStream(web())
  t.is(streamedAgain, expected)

  // And digest('hex') reflects only 'prefix' (stream input was not merged in).
  t.is(h.digest('hex'), new Blake3Hasher().update('prefix').digest('hex'))
})

test('blake3 digestStream format base64', async (t) => {
  const buf = Buffer.from('hello world stream test')
  const web = () => Readable.toWeb(Readable.from(buf))
  t.is(
    await new Blake3Hasher().digestStream(web(), 'base64'),
    new Blake3Hasher().update(buf).digest('base64'),
  )
})
