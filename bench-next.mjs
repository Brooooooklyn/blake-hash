import { createHash } from 'crypto'
import { promises as fs } from 'fs'

import xxhash from '@node-rs/xxhash'
import b from 'benny'

import {
  Blake2BHasher,
  Blake2BpHasher,
  Blake2SpHasher,
  Blake2SHasher,
  Blake3Hasher,
  blake3UrlSafeBase64,
} from './index.js'

const FIXTURE = [3, 'http://abc.xyz/logo.webp', 256, 0.9, 'image/webp']
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

function getURLSafeHashBlake2b512(items) {
  const hash = createHash('blake2b512')
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
  return blake3UrlSafeBase64(items.join(''))
}

function bigIntToBase64UrlSafe(bigInt) {
  return Buffer.from(bigInt.toString(16), 'hex')
    .toString('base64')
    .replace(/\//g, '-')
}

await b.suite(
  'digest hash into url-safe-base64',
  b.add('blake3', () => {
    getURLSafeHashBlake3(FIXTURE)
  }),
  b.add('blake2b', () => {
    getURLSafeHashBlake2B(FIXTURE)
  }),
  b.add('blake2s', () => {
    getURLSafeHashBlake2S(FIXTURE)
  }),
  b.add('node:sha256', () => {
    getURLSafeHashSha256(FIXTURE)
  }),
  b.add('node:blake2b512', () => {
    getURLSafeHashBlake2b512(FIXTURE)
  }),
  b.add('xxh3', () => {
    bigIntToBase64UrlSafe(xxhash.xxh3.xxh64(FIXTURE.join('')))
  }),
  b.add('xxh64', () => {
    bigIntToBase64UrlSafe(xxhash.xxh64(FIXTURE.join('')))
  }),
  b.cycle(),
  b.complete(),
)

await b.suite(
  'digest big file',
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
  b.add('blake2bp', () => {
    const hash = new Blake2BpHasher()
    hash.update(BIG_IMAGE)
    return hash.digest('base64-url-safe')
  }),
  b.add('blake2s', () => {
    const hash = new Blake2SHasher()
    hash.update(BIG_IMAGE)
    return hash.digest('base64-url-safe')
  }),
  b.add('blake2sp', () => {
    const hash = new Blake2SpHasher()
    hash.update(BIG_IMAGE)
    return hash.digest('base64-url-safe')
  }),
  b.add('node:sha256', () => {
    const hash = createHash('sha256')
    hash.update(BIG_IMAGE)
    return hash.digest('base64').replace(/\//g, '-')
  }),
  b.add('node:blake2b512', () => {
    const hash = createHash('blake2b512')
    hash.update(BIG_IMAGE)
    return hash.digest('base64').replace(/\//g, '-')
  }),
  b.add('xxh64', () => {
    return bigIntToBase64UrlSafe(xxhash.xxh64(BIG_IMAGE))
  }),
  b.add('xxh3', () => {
    return bigIntToBase64UrlSafe(xxhash.xxh3.xxh64(BIG_IMAGE))
  }),
  b.cycle(),
  b.complete(),
)
