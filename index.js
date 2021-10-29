const { loadBinding } = require('@node-rs/helper')

const { Blake2BHasher, Blake2SHasher, Blake3Hasher } =
  loadBinding(__dirname, 'blake', '@napi-rs/blake-hash')

module.exports = {
  Blake2BHasher,
  Blake2SHasher,
  Blake3Hasher,
}
