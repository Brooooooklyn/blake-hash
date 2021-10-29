import { createHash } from 'crypto'
import { promises as fs } from 'fs'

import b from 'benny'

import { Blake2BHasher, Blake2SHasher, Blake3Hasher } from './index.js'

const FIXTURE = [3, 'http://abc.xyz/logo.webp', 256, 0.9, 'image/webp', Buffer.from('abcdefghijklmnopqrstuvwxyz0123456789')]
const BIG_IMAGE = await fs.readFile('./anime-girl.png')

function getURLSafeHashSha256(items) {
  const hash = createHash('sha256')
  items.forEach((item) => {
    if (typeof item === 'number') {
      hash.update(String(item))
    } else {
      hash.update(item)
    }
  })
  // See https://en.wikipedia.org/wiki/Base64#Filenames
  return hash.digest('base64').replace(/\//g, '-')
}

function getURLSafeHashBlake2B(items) {
  const hash = new Blake2BHasher()
  items.forEach((item) => {
    hash.update(item)
  })
  return hash.digest('base64-url-safe')
}

function getURLSafeHashBlake2S(items) {
  const hash = new Blake2SHasher()
  items.forEach((item) => {
    hash.update(item)
  })
  return hash.digest('base64-url-safe')
}

function getURLSafeHashBlake3(items) {
  const hash = new Blake3Hasher()
  items.forEach((item) => {
    hash.update(item)
  })
  return hash.digest('base64-url-safe')
}

await b.suite('digest big file',
  b.add('blake3', () => {
    const hash = new Blake3Hasher()
    hash.update(BIG_IMAGE)
    return hash.digest('base64-url-safe')
  }),
  b.add('blake2b', () => {
    const hash = new Blake2BHasher()
    hash.update(BIG_IMAGE)
    return hash.digest('base64-url-safe')
  }),
  b.add('blake2s', () => {
    const hash = new Blake2SHasher()
    hash.update(BIG_IMAGE)
    return hash.digest('base64-url-safe')
  }),
  b.add('sha256', () => {
    const hash = createHash('sha256')
    hash.update(BIG_IMAGE)
    return hash.digest('base64').replace(/\//g, '-')
  }),
  b.cycle(),
  b.complete(),
)

await b.suite('digest hash into url-safe-base64',
  b.add('blake3', () => {
    getURLSafeHashBlake3(FIXTURE)
  }),
  b.add('blake2b', () => {
    getURLSafeHashBlake2B(FIXTURE)
  }),
  b.add('blake2s', () => {
    getURLSafeHashBlake2S(FIXTURE)
  }),
  b.add('sha256', () => {
    getURLSafeHashSha256(FIXTURE)
  }),
  b.cycle(),
  b.complete(),
)
