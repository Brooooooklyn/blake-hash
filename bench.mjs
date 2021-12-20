import { promises as fs } from 'fs'

import b from 'benny'
import { createHash as createBlake2Hash } from 'blake2'
import { createHash as createBlake3Hash } from 'blake3'

import { Blake2BHasher, Blake2SHasher, Blake3Hasher } from './index.js'

const BIG_IMAGE = await fs.readFile('./anime-girl.png')

await b.suite(
  'digest big file blake2b',
  b.add('blake2b-napi', () => {
    const hash = new Blake2BHasher()
    hash.update(BIG_IMAGE)
    return hash.digest('base64')
  }),
  b.add('blake2b-c++', () => {
    const hash = createBlake2Hash('blake2b')
    hash.update(BIG_IMAGE)
    return hash.digest('base64')
  }),
  b.cycle(),
  b.complete(),
)

await b.suite(
  'digest big file blake2s',
  b.add('blake2s-napi', () => {
    const hash = new Blake2SHasher()
    hash.update(BIG_IMAGE)
    return hash.digest('base64')
  }),
  b.add('blake2s-c++', () => {
    const hash = createBlake2Hash('blake2s')
    hash.update(BIG_IMAGE)
    return hash.digest('base64')
  }),
  b.cycle(),
  b.complete(),
)

await b.suite(
  'digest big file blake3',
  b.add('blake3-napi', () => {
    const hash = new Blake3Hasher()
    hash.update(BIG_IMAGE)
    return hash.digest('base64')
  }),
  b.add('blake3-neon', () => {
    const hash = createBlake3Hash()
    hash.update(BIG_IMAGE)
    return hash.digest('base64')
  }),
  b.cycle(),
  b.complete(),
)
