export function blake2b(input: string | Buffer): Buffer
export function blake2bp(input: string | Buffer): Buffer
export function blake2s(input: string | Buffer): Buffer
export function blake2sp(input: string | Buffer): Buffer
export function blake3(input: string | Buffer): Buffer
export function blake3UrlSafeBase64(input: string | Buffer): string
export class Blake2BParam {
  
  constructor()
  key(key: Buffer): void
  salt(salt: Buffer): void
  hashLength(length: number): void
  personal(personal: Buffer): void
  fanout(fanout: number): void
  maxDepth(depth: number): void
  maxLeafLength(length: number): void
  nodeDepth(depth: number): void
  innerHashLength(length: number): void
}
export class Blake2SParam {
  
  constructor()
  key(key: Buffer): void
  salt(salt: Buffer): void
  hashLength(length: number): void
  personal(personal: Buffer): void
  fanout(fanout: number): void
  maxDepth(depth: number): void
  maxLeafLength(length: number): void
  nodeDepth(depth: number): void
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
  update(input: string | Buffer | number): void
  digest(format: string | null): string
  digestBuffer(): Buffer
}
export class Blake2BpHasher {
  
  constructor()
  static withParams(params: Blake2BpParam): Blake2BpHasher
  update(input: string | Buffer | number): void
  digest(format: string | null): string
  digestBuffer(): Buffer
}
export class Blake2SHasher {
  
  constructor()
  static withParams(params: Blake2SParam): Blake2SHasher
  update(input: string | Buffer | number): void
  digest(format: string | null): string
  digestBuffer(): Buffer
}
export class Blake2SpHasher {
  
  constructor()
  static withParams(params: Blake2SpParam): Blake2SpHasher
  update(input: string | Buffer | number): void
  digest(format: string | null): string
  digestBuffer(): Buffer
}
export class Blake3Hasher {
  
  static deriveKey(context: string, keyMaterial: Buffer): Buffer
  constructor()
  static newKeyed(key: Buffer): Blake3Hasher
  static newDeriveKey(input: string): Blake3Hasher
  reset(): void
  update(input: string | Buffer | number): void
  digest(format: string | null): string
  digestBuffer(): Buffer
}
