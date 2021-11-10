use napi::bindgen_prelude::*;
use napi_derive::napi;

#[cfg(all(
  not(debug_assertions),
  not(all(target_os = "windows", target_arch = "aarch64")),
  not(all(target_os = "linux", target_arch = "aarch64", target_env = "musl")),
))]
#[global_allocator]
static ALLOC: mimalloc_rust::GlobalMiMalloc = mimalloc_rust::GlobalMiMalloc;

mod blake2_params;

use blake2_params::{Blake2bParam, Blake2bpParam, Blake2sParam, Blake2spParam};

macro_rules! impl_hasher {
  ($name:ident, $algorithm:expr, $params:ident) => {
    #[napi]
    impl $name {
      #[napi(constructor)]
      pub fn new() -> Self {
        Self($algorithm)
      }

      #[napi(factory)]
      pub fn with_params(params: &$params) -> $name {
        Self(params.to_state())
      }

      #[napi]
      pub fn update(&mut self, input: Either3<String, Buffer, f64>) -> Result<()> {
        match input {
          Either3::A(a) => {
            self.0.update(a.as_bytes());
          }
          Either3::B(b) => {
            self.0.update(b.as_ref());
          }
          Either3::C(c) => {
            let mut buffer = ryu::Buffer::new();
            self.0.update(buffer.format_finite(c).as_bytes());
          }
        }
        Ok(())
      }

      #[napi]
      pub fn digest(&mut self, format: Option<String>) -> Result<String> {
        match format.unwrap_or_else(|| "hex".to_owned()).as_str() {
          "hex" => Ok(self.0.finalize().to_hex().to_string()),
          "base64" => Ok(base64::encode(self.0.finalize().as_ref())),
          "base64-url-safe" => Ok(base64::encode_config(
            self.0.finalize().as_ref(),
            base64::URL_SAFE,
          )),
          _ => Err(Error::new(Status::InvalidArg, "Invalid format".to_owned())),
        }
      }

      #[napi]
      pub fn digest_buffer(&mut self) -> Buffer {
        self.0.finalize().as_ref().into()
      }
    }
  };
}

#[napi]
#[repr(transparent)]
struct Blake2bHasher(blake2b_simd::State);

#[napi]
#[repr(transparent)]
struct Blake2bpHasher(blake2b_simd::blake2bp::State);

#[napi]
#[repr(transparent)]
struct Blake2sHasher(blake2s_simd::State);

#[napi]
#[repr(transparent)]
struct Blake2spHasher(blake2s_simd::blake2sp::State);

impl_hasher!(Blake2bHasher, blake2b_simd::State::new(), Blake2bParam);
impl_hasher!(
  Blake2bpHasher,
  blake2b_simd::blake2bp::State::new(),
  Blake2bpParam
);
impl_hasher!(Blake2sHasher, blake2s_simd::State::new(), Blake2sParam);
impl_hasher!(
  Blake2spHasher,
  blake2s_simd::blake2sp::State::new(),
  Blake2spParam
);

#[napi]
#[repr(transparent)]
struct Blake3Hasher(blake3::Hasher);

#[napi]
impl Blake3Hasher {
  #[napi]
  pub fn derive_key(context: String, key_material: Buffer) -> Buffer {
    blake3::derive_key(context.as_str(), key_material.as_ref())
      .as_ref()
      .into()
  }

  #[napi(constructor)]
  pub fn new() -> Self {
    Self(blake3::Hasher::new())
  }

  #[napi(factory)]
  pub fn new_keyed(key: Buffer) -> Self {
    debug_assert!(key.len() == blake3::KEY_LEN);
    let mut target_key = [0; blake3::KEY_LEN];
    target_key.copy_from_slice(key.as_ref());
    Self(blake3::Hasher::new_keyed(&target_key))
  }

  #[napi(factory)]
  pub fn new_derive_key(input: String) -> Self {
    Self(blake3::Hasher::new_derive_key(input.as_str()))
  }

  #[napi]
  pub fn reset(&mut self) {
    self.0.reset();
  }

  #[napi]
  pub fn update(&mut self, input: Either3<String, Buffer, f64>) -> Result<()> {
    match input {
      Either3::A(a) => {
        self.0.update(a.as_bytes());
      }
      Either3::B(b) => {
        self.0.update(b.as_ref());
      }
      Either3::C(c) => {
        let mut buffer = ryu::Buffer::new();
        self.0.update(buffer.format_finite(c).as_bytes());
      }
    }
    Ok(())
  }

  #[napi]
  pub fn digest(&mut self, format: Option<String>) -> Result<String> {
    match format.unwrap_or_else(|| "hex".to_owned()).as_str() {
      "hex" => Ok(self.0.finalize().to_hex().to_string()),
      "base64" => Ok(base64::encode(self.0.finalize().as_bytes())),
      "base64-url-safe" => Ok(base64::encode_config(
        self.0.finalize().as_bytes(),
        base64::URL_SAFE,
      )),
      _ => Err(Error::new(Status::InvalidArg, "Invalid format".to_owned())),
    }
  }

  #[napi]
  pub fn digest_buffer(&mut self) -> Buffer {
    self.0.finalize().as_bytes().to_vec().into()
  }
}

#[napi(js_name = "blake2b")]
pub fn blake2b(input: Either<String, Buffer>) -> Buffer {
  match input {
    Either::A(a) => blake2b_simd::blake2b(a.as_bytes()).as_ref().into(),
    Either::B(b) => blake2b_simd::blake2b(b.as_ref()).as_ref().into(),
  }
}

#[napi(js_name = "blake2bp")]
pub fn blake2bp(input: Either<String, Buffer>) -> Buffer {
  match input {
    Either::A(a) => blake2b_simd::blake2bp::blake2bp(a.as_bytes())
      .as_ref()
      .into(),
    Either::B(b) => blake2b_simd::blake2bp::blake2bp(b.as_ref()).as_ref().into(),
  }
}

#[napi(js_name = "blake2s")]
pub fn blake2s(input: Either<String, Buffer>) -> Buffer {
  match input {
    Either::A(a) => blake2s_simd::blake2s(a.as_bytes()).as_ref().into(),
    Either::B(b) => blake2s_simd::blake2s(b.as_ref()).as_ref().into(),
  }
}

#[napi(js_name = "blake2sp")]
pub fn blake2sp(input: Either<String, Buffer>) -> Buffer {
  match input {
    Either::A(a) => blake2s_simd::blake2sp::blake2sp(a.as_bytes())
      .as_ref()
      .into(),
    Either::B(b) => blake2s_simd::blake2sp::blake2sp(b.as_ref()).as_ref().into(),
  }
}

#[napi]
fn blake3(input: Either<String, Buffer>) -> Buffer {
  match input {
    Either::A(a) => blake3::hash(a.as_bytes()).as_bytes().as_ref().into(),
    Either::B(b) => blake3::hash(b.as_ref()).as_bytes().as_ref().into(),
  }
}

#[napi]
fn blake3_url_safe_base64(input: Either<String, Buffer>) -> String {
  let o = match input {
    Either::A(a) => blake3::hash(a.as_bytes()),
    Either::B(b) => blake3::hash(b.as_ref()),
  };
  base64::encode_config(o.as_bytes(), base64::URL_SAFE)
}
