import test from 'ava'

import {
  Blake2BHasher,
  Blake2BpHasher,
  Blake2SpHasher,
  Blake2SHasher,
} from '../index'

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
