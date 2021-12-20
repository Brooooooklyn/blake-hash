# `@napi-rs/blake-hash`

![https://github.com/Brooooooklyn/blake-hash/actions](https://github.com/Brooooooklyn/blake-hash/workflows/CI/badge.svg)
![](https://img.shields.io/npm/dm/@napi-rs/blake-hash.svg?sanitize=true)
[![Install size](https://packagephobia.com/badge?p=@napi-rs/blake-hash)](https://packagephobia.com/result?p=@napi-rs/blake-hash)

Node.js binding for https://github.com/BLAKE3-team/BLAKE3. High performance, and no postinstall scripts.

## Support matrix

|                  | node12 | node14 | node16 |
| ---------------- | ------ | ------ | ------ |
| Windows x64      | ✓      | ✓      | ✓      |
| Windows x32      | ✓      | ✓      | ✓      |
| Windows arm64    | ✓      | ✓      | ✓      |
| macOS x64        | ✓      | ✓      | ✓      |
| macOS arm64      | ✓      | ✓      | ✓      |
| Linux x64 gnu    | ✓      | ✓      | ✓      |
| Linux x64 musl   | ✓      | ✓      | ✓      |
| Linux arm gnu    | ✓      | ✓      | ✓      |
| Linux arm64 gnu  | ✓      | ✓      | ✓      |
| Linux arm64 musl | ✓      | ✓      | ✓      |
| Android arm64    | ✓      | ✓      | ✓      |
| Android armv7    | ✓      | ✓      | ✓      |
| FreeBSD x64      | ✓      | ✓      | ✓      |

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

## Blake3

### `Hash`

#### Default hash function

```js
import { blake3 } from '@napi-rs/blake-hash'

blake3('hello') //ea8f163db38682925e4491c5e58d4bb3506ef8c14eb78a86e908c5624a67200f
```

#### Hasher

```js
import { Blake3Hasher } from '@napi-rs/blake-hash'

const hasher = new Blake3Hasher()
hasher.update('hello')
hasher.digest('hex') // ea8f163db38682925e4491c5e58d4bb3506ef8c14eb78a86e908c5624a67200f
```

### `KeyedHash`

> Full documentation: https://docs.rs/blake3/latest/blake3/fn.keyed_hash.html

```js
import { randomBytes } from 'crypto'

import { Blake3Hasher } from '@napi-rs/blake-hash'

const hasher = Blake3Hasher.newKeyed(randomBytes(32)) // The key must be 32 bytes
hasher.update('hello')
hasher.digest('hex') // 9e8e05888735e59036c1ec66938f5bdb2b3933ce647918b739c23b699f1431a3
```

### `DeriveKey`

Full documentation: https://docs.rs/blake3/latest/blake3/fn.derive_key.html

> The key derivation function.
>
> Given cryptographic key material of any length and a context string of any length, this function outputs a 32-byte derived subkey. **The context string should be hardcoded, globally unique, and application-specific.** A good default format for such strings is `"[application] [commit timestamp] [purpose]"`, e.g., `"example.com 2019-12-25 16:18:03 session tokens v1"`.
>
> Key derivation is important when you want to use the same key in multiple algorithms or use cases. Using the same key with different cryptographic algorithms is generally forbidden, and deriving a separate subkey for each use case protects you from bad interactions. Derived keys also mitigate the damage from one part of your application accidentally leaking its key.
>
> As a rare exception to that general rule, however, it is possible to use `derive_key` itself with key material that you are already using with another algorithm. You might need to do this if you're adding features to an existing application, which does not yet use key derivation internally.
>
> However, you still must not share key material with algorithms that forbid key reuse entirely, like a one-time pad. For more on this, see sections 6.2 and 7.8 of the [BLAKE3 paper](https://github.com/BLAKE3-team/BLAKE3-specs/blob/master/blake3.pdf).
>
> Note that BLAKE3 is not a password hash, and **`derive_key` should never be used with passwords.** Instead, use a dedicated password hash like [Argon2]. Password hashes are entirely different from generic hash functions, with opposite design requirements.
>
> [argon2]: https://en.wikipedia.org/wiki/Argon2

```js
import { Blake3Hasher } from '@napi-rs/blake-hash'

const context = 'BLAKE3 2021-11-10 12:13:59 example context'

const hasher = Blake3Hasher.newDeriveKey(context)
hasher.update('hello')
hasher.digest('hex') // e186adf36b0c4e421b2baa881e158a4b3b074626882a6e1dfb231aebb7e149ee
```

## Performance

Compare with [`blake3`](https://github.com/connor4312/blake3) and [`blake2`](https://github.com/vrza/node-blake2).

> Benchmark results were generated from GitHub Codespaces.

```
Running "digest big file blake2b" suite...
Progress: 100%

  blake2b-napi:
    1 251 ops/s, ±0.49%   | fastest

  blake2b-c++:
    626 ops/s, ±2.11%     | slowest, 49.96% slower

Finished 2 cases!
  Fastest: blake2b-napi
  Slowest: blake2b-c++
Running "digest big file blake2s" suite...
Progress: 100%

  blake2s-napi:
    745 ops/s, ±0.47%   | fastest

  blake2s-c++:
    604 ops/s, ±0.56%   | slowest, 18.93% slower

Finished 2 cases!
  Fastest: blake2s-napi
  Slowest: blake2s-c++
Running "digest big file blake3" suite...
Progress: 100%

  blake3-napi:
    6 747 ops/s, ±0.90%   | fastest

  blake3-neon:
    6 669 ops/s, ±1.04%   | slowest, 1.16% slower

Finished 2 cases!
  Fastest: blake3-napi
  Slowest: blake3-neon
```

## Other implementations

- https://github.com/connor4312/blake3
- https://github.com/vrza/node-blake2
