const { loadBinding } = require('@node-rs/helper')

const {
  Blake2BHasher,
  Blake2SHasher,
  Blake3Hasher,
  Blake2BpHasher,
  Blake2SpHasher,
  Blake2BParam,
  Blake2SParam,
  Blake2SpParam,
} = loadBinding(__dirname, 'blake', '@napi-rs/blake-hash')

module.exports = {
  Blake2BHasher,
  Blake2SHasher,
  Blake3Hasher,
  Blake2BpHasher,
  Blake2SpHasher,
  Blake2BParam,
  Blake2SParam,
  Blake2SpParam,
}
