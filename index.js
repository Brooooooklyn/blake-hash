const { existsSync, readFileSync } = require('fs')
const { join } = require('path')

const { platform, arch } = process

let nativeBinding = null
let localFileExisted = false
let isMusl = false
let loadError = null

switch (platform) {
  case 'android':
    if (arch !== 'arm64') {
      throw new Error(`Unsupported architecture on Android ${arch}`)
    }
    localFileExisted = existsSync(join(__dirname, 'blake.android-arm64.node'))
    try {
      if (localFileExisted) {
        nativeBinding = require('./blake.android-arm64.node')
      } else {
        nativeBinding = require('@napi-rs/blake-hash-android-arm64')
      }
    } catch (e) {
      loadError = e
    }
    break
  case 'win32':
    switch (arch) {
      case 'x64':
        localFileExisted = existsSync(
          join(__dirname, 'blake.win32-x64-msvc.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./blake.win32-x64-msvc.node')
          } else {
            nativeBinding = require('@napi-rs/blake-hash-win32-x64-msvc')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'ia32':
        localFileExisted = existsSync(
          join(__dirname, 'blake.win32-ia32-msvc.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./blake.win32-ia32-msvc.node')
          } else {
            nativeBinding = require('@napi-rs/blake-hash-win32-ia32-msvc')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'arm64':
        localFileExisted = existsSync(
          join(__dirname, 'blake.win32-arm64-msvc.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./blake.win32-arm64-msvc.node')
          } else {
            nativeBinding = require('@napi-rs/blake-hash-win32-arm64-msvc')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on Windows: ${arch}`)
    }
    break
  case 'darwin':
    switch (arch) {
      case 'x64':
        localFileExisted = existsSync(join(__dirname, 'blake.darwin-x64.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./blake.darwin-x64.node')
          } else {
            nativeBinding = require('@napi-rs/blake-hash-darwin-x64')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'arm64':
        localFileExisted = existsSync(
          join(__dirname, 'blake.darwin-arm64.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./blake.darwin-arm64.node')
          } else {
            nativeBinding = require('@napi-rs/blake-hash-darwin-arm64')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on macOS: ${arch}`)
    }
    break
  case 'freebsd':
    if (arch !== 'x64') {
      throw new Error(`Unsupported architecture on FreeBSD: ${arch}`)
    }
    localFileExisted = existsSync(join(__dirname, 'blake.freebsd-x64.node'))
    try {
      if (localFileExisted) {
        nativeBinding = require('./blake.freebsd-x64.node')
      } else {
        nativeBinding = require('@napi-rs/blake-hash-freebsd-x64')
      }
    } catch (e) {
      loadError = e
    }
    break
  case 'linux':
    switch (arch) {
      case 'x64':
        isMusl = readFileSync('/usr/bin/ldd', 'utf8').includes('musl')
        if (isMusl) {
          localFileExisted = existsSync(
            join(__dirname, 'blake.linux-x64-musl.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./blake.linux-x64-musl.node')
            } else {
              nativeBinding = require('@napi-rs/blake-hash-linux-x64-musl')
            }
          } catch (e) {
            loadError = e
          }
        } else {
          localFileExisted = existsSync(
            join(__dirname, 'blake.linux-x64-gnu.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./blake.linux-x64-gnu.node')
            } else {
              nativeBinding = require('@napi-rs/blake-hash-linux-x64-gnu')
            }
          } catch (e) {
            loadError = e
          }
        }
        break
      case 'arm64':
        isMusl = readFileSync('/usr/bin/ldd', 'utf8').includes('musl')
        if (isMusl) {
          localFileExisted = existsSync(
            join(__dirname, 'blake.linux-arm64-musl.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./blake.linux-arm64-musl.node')
            } else {
              nativeBinding = require('@napi-rs/blake-hash-linux-arm64-musl')
            }
          } catch (e) {
            loadError = e
          }
        } else {
          localFileExisted = existsSync(
            join(__dirname, 'blake.linux-arm64-gnu.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./blake.linux-arm64-gnu.node')
            } else {
              nativeBinding = require('@napi-rs/blake-hash-linux-arm64-gnu')
            }
          } catch (e) {
            loadError = e
          }
        }
        break
      case 'arm':
        localFileExisted = existsSync(
          join(__dirname, 'blake.linux-arm-gnueabihf.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./blake.linux-arm-gnueabihf.node')
          } else {
            nativeBinding = require('@napi-rs/blake-hash-linux-arm-gnueabihf')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on Linux: ${arch}`)
    }
    break
  default:
    throw new Error(`Unsupported OS: ${platform}, architecture: ${arch}`)
}

if (!nativeBinding) {
  if (loadError) {
    throw loadError
  }
  throw new Error(`Failed to load native binding`)
}

const { Blake2BParam, Blake2SParam, Blake2BpParam, Blake2SpParam, Blake2BHasher, Blake2BpHasher, Blake2SHasher, Blake2SpHasher, Blake3Hasher, blake2b, blake2bp, blake2s, blake2sp, blake3, blake3UrlSafeBase64 } = nativeBinding

module.exports.Blake2BParam = Blake2BParam
module.exports.Blake2SParam = Blake2SParam
module.exports.Blake2BpParam = Blake2BpParam
module.exports.Blake2SpParam = Blake2SpParam
module.exports.Blake2BHasher = Blake2BHasher
module.exports.Blake2BpHasher = Blake2BpHasher
module.exports.Blake2SHasher = Blake2SHasher
module.exports.Blake2SpHasher = Blake2SpHasher
module.exports.Blake3Hasher = Blake3Hasher
module.exports.blake2b = blake2b
module.exports.blake2bp = blake2bp
module.exports.blake2s = blake2s
module.exports.blake2sp = blake2sp
module.exports.blake3 = blake3
module.exports.blake3UrlSafeBase64 = blake3UrlSafeBase64