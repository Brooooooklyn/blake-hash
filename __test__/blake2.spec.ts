import { Readable } from 'node:stream'

import test from 'ava'

import {
  Blake2BHasher,
  Blake2BpHasher,
  Blake2SpHasher,
  Blake2SHasher,
  blake2b,
} from '../index'

function streamOf(chunks: Buffer[]): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(c) {
      for (const ch of chunks) c.enqueue(new Uint8Array(ch))
      c.close()
    },
  })
}

test('blake2b', (t) => {
  const hasher = new Blake2BHasher()
  t.is(
    hasher.update('hello').digest('hex'),
    'e4cfa39a3d37be31c59609e807970799caa68a19bfaa15135f165085e01d41a65ba1e1b146aeb6bd0092b49eac214c103ccfa3a365954bbbe52f74a2b3620c94',
  )
})

test('blake2bp', (t) => {
  const hasher = new Blake2BpHasher()
  t.is(
    hasher.update('hello').digest('hex'),
    '3d9b524855d3675f3ccbe8e189b3f00a2712ba7301f9b88a7e31aad4916777459953a70f9c98869bc39872591c30e6dfa5b5decbfcf977c909db9f9f7e4441d1',
  )
})

test('blake2s', (t) => {
  const hasher = new Blake2SHasher()
  t.is(
    hasher.update('hello').digest('hex'),
    '19213bacc58dee6dbde3ceb9a47cbb330b3d86f8cca8997eb00be456f140ca25',
  )
})

test('blake2sp', (t) => {
  const hasher = new Blake2SpHasher()
  t.is(
    hasher.update('hello').digest('hex'),
    '223dfe42565ddf97210b34a384860b603717d5c63c1872c9fc99f1b15de6631b',
  )
})

test('blake2b digestStream', async (t) => {
  const buf = Buffer.from('hello world stream test')
  const web = () => Readable.toWeb(Readable.from(buf))
  t.is(
    await new Blake2BHasher().digestStream(web()),
    blake2b(buf).toString('hex'),
  )
})

test('blake2b digestStreamBuffer', async (t) => {
  const buf = Buffer.from('hello world stream test')
  const web = () => Readable.toWeb(Readable.from(buf))
  t.deepEqual(await new Blake2BHasher().digestStreamBuffer(web()), blake2b(buf))
})

test('blake2b digestStream multi-chunk correctness', async (t) => {
  const chunks: Buffer[] = []
  for (let i = 0; i < 64; i++) {
    chunks.push(Buffer.from([i & 0xff, (i * 7) & 0xff, (i * 13) & 0xff]))
  }
  const concat = Buffer.concat(chunks)
  const expected = blake2b(concat).toString('hex')
  for (let attempt = 0; attempt < 5; attempt++) {
    t.is(await new Blake2BHasher().digestStream(streamOf(chunks)), expected)
  }
  t.deepEqual(
    await new Blake2BHasher().digestStreamBuffer(streamOf(chunks)),
    blake2b(concat),
  )
})

test('blake2b digestStream errored stream rejects without crashing', async (t) => {
  const errored = new ReadableStream({
    start(c) {
      c.enqueue(new Uint8Array([1, 2, 3]))
      c.error(new Error('boom'))
    },
  })
  await t.throwsAsync(() => new Blake2BHasher().digestStream(errored))
})

test('blake2b digestStream invalid format rejects', (t) => {
  // Format is now validated synchronously up front (before consuming the
  // stream), so a bad format throws synchronously rather than returning a
  // rejected Promise.
  t.throws(() =>
    new Blake2BHasher().digestStream(streamOf([Buffer.from('x')]), 'bogus'),
  )
})
