use blake2b_simd::{
  blake2bp::Params as Blake2bpParams, blake2bp::State as Blake2bpState, Params as Blake2bParams,
  State as Blake2bState,
};
use blake2s_simd::{
  blake2sp::Params as Blake2spParams, blake2sp::State as Blake2spState, Params as Blake2sParams,
  State as Blake2sState,
};
use napi::bindgen_prelude::*;
use napi_derive::napi;

macro_rules! impl_blake2_params {
  ($name:ident, $params:ident, $state:ident) => {
    #[napi]
    impl $name {
      #[napi(constructor)]
      pub fn new() -> Self {
        Self($params::new())
      }

      #[inline(always)]
      pub(crate) fn to_state(&self) -> $state {
        self.0.to_state()
      }

      #[napi]
      /// Use a secret key, so that BLAKE2 acts as a MAC. The maximum key length is `KEYBYTES` (64).
      /// An empty key is equivalent to having no key at all.
      pub fn key(&mut self, key: Buffer) {
        self.0.key(key.as_ref());
      }

      #[napi]
      /// At most `SALTBYTES` (16). Shorter salts are padded with null bytes. An empty salt is
      /// equivalent to having no salt at all.
      pub fn salt(&mut self, salt: Buffer) {
        self.0.salt(salt.as_ref());
      }

      #[napi]
      /// Set the length of the final hash in bytes, from 1 to `OUTBYTES` (64). Apart from
      /// controlling the length of the final `Hash`, this is also associated data, and changing it
      /// will result in a totally different hash.
      pub fn hash_length(&mut self, length: u32) {
        self.0.hash_length(length as usize);
      }

      #[napi]
      /// At most `PERSONALBYTES` (16). Shorter personalizations are padded with null bytes. An empty
      /// personalization is equivalent to having no personalization at all.
      pub fn personal(&mut self, personal: Buffer) {
        self.0.personal(personal.as_ref());
      }

      #[napi]
      pub fn fanout(&mut self, fanout: u32) {
        self.0.fanout(fanout as u8);
      }

      #[napi]
      pub fn max_depth(&mut self, depth: u32) {
        self.0.max_depth(depth as u8);
      }

      #[napi]
      pub fn max_leaf_length(&mut self, length: u32) {
        self.0.max_leaf_length(length);
      }

      #[napi]
      /// From 0 (the default, meaning leaf or sequential) to 255.
      pub fn node_depth(&mut self, depth: u32) {
        self.0.node_depth(depth as u8);
      }

      #[napi]
      /// From 0 (the default, meaning sequential) to `OUTBYTES` (64).
      pub fn inner_hash_length(&mut self, length: u32) {
        self.0.inner_hash_length(length as usize);
      }
    }
  };
}

#[napi]
#[repr(transparent)]
pub struct Blake2bParam(blake2b_simd::Params);

#[napi]
#[repr(transparent)]
pub struct Blake2sParam(blake2s_simd::Params);

impl_blake2_params!(Blake2bParam, Blake2bParams, Blake2bState);
impl_blake2_params!(Blake2sParam, Blake2sParams, Blake2sState);

#[napi]
#[repr(transparent)]
pub struct Blake2bpParam(Blake2bpParams);

#[napi]
impl Blake2bpParam {
  #[napi(constructor)]
  pub fn new() -> Self {
    Self(Blake2bpParams::new())
  }

  #[napi]
  pub fn key(&mut self, key: Buffer) {
    self.0.key(key.as_ref());
  }

  #[napi]
  pub fn hash_length(&mut self, length: u32) {
    self.0.hash_length(length as usize);
  }

  pub(crate) fn to_state(&self) -> Blake2bpState {
    self.0.to_state()
  }
}

#[napi]
#[repr(transparent)]
pub struct Blake2spParam(Blake2spParams);

#[napi]
impl Blake2spParam {
  #[napi(constructor)]
  pub fn new() -> Self {
    Self(Blake2spParams::new())
  }

  #[napi]
  pub fn key(&mut self, key: Buffer) {
    self.0.key(key.as_ref());
  }

  #[napi]
  pub fn hash_length(&mut self, length: u32) {
    self.0.hash_length(length as usize);
  }

  pub(crate) fn to_state(&self) -> Blake2spState {
    self.0.to_state()
  }
}
