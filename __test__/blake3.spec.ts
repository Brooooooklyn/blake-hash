import test from 'ava'

import { Blake3Hasher } from '../index'

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
