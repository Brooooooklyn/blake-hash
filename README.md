# `@napi-rs/blake-hash`

![https://github.com/Brooooooklyn/blake-hash/actions](https://github.com/Brooooooklyn/blake-hash/workflows/CI/badge.svg)
![](https://img.shields.io/npm/dm/@napi-rs/blake-hash.svg?sanitize=true)
[![Install size](https://packagephobia.com/badge?p=@napi-rs/blake-hash)](https://packagephobia.com/result?p=@napi-rs/blake-hash)

## Performance

Compare with [`blake3`](https://github.com/connor4312/blake3) and [`blake2`](https://github.com/vrza/node-blake2).

```
Running "digest big file blake2b" suite...
Progress: 100%

  blake2b-napi:
    1 560 ops/s, ±0.35%   | fastest

  blake2b-c++:
    1 101 ops/s, ±0.35%   | slowest, 29.42% slower

Finished 2 cases!
  Fastest: blake2b-napi
  Slowest: blake2b-c++
Running "digest big file blake2s" suite...
Progress: 100%

  blake2s-napi:
    934 ops/s, ±0.67%   | fastest

  blake2s-c++:
    846 ops/s, ±0.46%   | slowest, 9.42% slower

Finished 2 cases!
  Fastest: blake2s-napi
  Slowest: blake2s-c++
Running "digest big file blake3" suite...
Progress: 100%

  blake3-napi:
    4 514 ops/s, ±0.99%   | fastest

  blake3-neon:
    669 ops/s, ±0.44%     | slowest, 85.18% slower

Finished 2 cases!
  Fastest: blake3-napi
  Slowest: blake3-neon
```

## Blake2

Support `blake2b` `blake2bp` `blake2s` `blake2sp` algorithm.

### Unkeyed Hash

```js
import { Blake2BHasher } from '@napi-rs/blake-hash'

const hasher = new Blake2BHasher()
hasher.update('content to be hash')
hasher.digest('hex') // could also be `base64` or `url-safe-base64`

```

### Keyed Hash

```js
import { Blake2BHasher, Blake2BParam } from '@napi-rs/blake-hash'

const hashParams = new Blake2BParam()
hashParams.personal('someone@email.com')
const hash = Blake2BHasher.withParams(hashParams)

hash.update('your secret')
hash.digest('hex')
```
