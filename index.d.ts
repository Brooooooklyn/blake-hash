/* eslint-disable */

export class ExternalObject<T> {
  readonly '': {
    readonly '': unique symbol
    [K: symbol]: T
  }
}
export function blake2b(input: string | Buffer): Buffer
export function blake2bp(input: string | Buffer): Buffer
export function blake2s(input: string | Buffer): Buffer
export function blake2sp(input: string | Buffer): Buffer
export function blake3(input: string | Buffer): Buffer
export function blake3UrlSafeBase64(input: string | Buffer): string
export class Blake2BParam {
  constructor()
  /**
   * Use a secret key, so that BLAKE2 acts as a MAC. The maximum key length is `KEYBYTES` (64).
   * An empty key is equivalent to having no key at all.
   */
  key(key: Buffer): void
  /**
   * At most `SALTBYTES` (16). Shorter salts are padded with null bytes. An empty salt is
   * equivalent to having no salt at all.
   */
  salt(salt: Buffer): void
  /**
   * Set the length of the final hash in bytes, from 1 to `OUTBYTES` (64). Apart from
   * controlling the length of the final `Hash`, this is also associated data, and changing it
   * will result in a totally different hash.
   */
  hashLength(length: number): void
  /**
   * At most `PERSONALBYTES` (16). Shorter personalizations are padded with null bytes. An empty
   * personalization is equivalent to having no personalization at all.
   */
  personal(personal: Buffer): void
  fanout(fanout: number): void
  maxDepth(depth: number): void
  maxLeafLength(length: number): void
  /** From 0 (the default, meaning leaf or sequential) to 255. */
  nodeDepth(depth: number): void
  /** From 0 (the default, meaning sequential) to `OUTBYTES` (64). */
  innerHashLength(length: number): void
}
export class Blake2SParam {
  constructor()
  /**
   * Use a secret key, so that BLAKE2 acts as a MAC. The maximum key length is `KEYBYTES` (64).
   * An empty key is equivalent to having no key at all.
   */
  key(key: Buffer): void
  /**
   * At most `SALTBYTES` (16). Shorter salts are padded with null bytes. An empty salt is
   * equivalent to having no salt at all.
   */
  salt(salt: Buffer): void
  /**
   * Set the length of the final hash in bytes, from 1 to `OUTBYTES` (64). Apart from
   * controlling the length of the final `Hash`, this is also associated data, and changing it
   * will result in a totally different hash.
   */
  hashLength(length: number): void
  /**
   * At most `PERSONALBYTES` (16). Shorter personalizations are padded with null bytes. An empty
   * personalization is equivalent to having no personalization at all.
   */
  personal(personal: Buffer): void
  fanout(fanout: number): void
  maxDepth(depth: number): void
  maxLeafLength(length: number): void
  /** From 0 (the default, meaning leaf or sequential) to 255. */
  nodeDepth(depth: number): void
  /** From 0 (the default, meaning sequential) to `OUTBYTES` (64). */
  innerHashLength(length: number): void
}
export class Blake2BpParam {
  constructor()
  key(key: Buffer): void
  hashLength(length: number): void
}
export class Blake2SpParam {
  constructor()
  key(key: Buffer): void
  hashLength(length: number): void
}
export class Blake2BHasher {
  constructor()
  static withParams(params: Blake2BParam): Blake2BHasher
  update(input: string | Buffer | number): this
  digest(format?: string | undefined | null): string
  digestBuffer(): Buffer
}
export class Blake2BpHasher {
  constructor()
  static withParams(params: Blake2BpParam): Blake2BpHasher
  update(input: string | Buffer | number): this
  digest(format?: string | undefined | null): string
  digestBuffer(): Buffer
}
export class Blake2SHasher {
  constructor()
  static withParams(params: Blake2SParam): Blake2SHasher
  update(input: string | Buffer | number): this
  digest(format?: string | undefined | null): string
  digestBuffer(): Buffer
}
export class Blake2SpHasher {
  constructor()
  static withParams(params: Blake2SpParam): Blake2SpHasher
  update(input: string | Buffer | number): this
  digest(format?: string | undefined | null): string
  digestBuffer(): Buffer
}
export class Blake3Hasher {
  static deriveKey(context: string, keyMaterial: Buffer): Buffer
  constructor()
  static newKeyed(key: Buffer): Blake3Hasher
  static newDeriveKey(input: string): Blake3Hasher
  reset(): void
  update(input: string | Buffer | number): this
  digest(format?: string | undefined | null): string
  digestBuffer(): Buffer
}
