use napi::{bindgen_prelude::*, JsBuffer, JsNumber, JsString, JsUnknown};
use napi_derive::napi;

#[cfg(all(
  not(debug_assertions),
  not(all(target_os = "windows", target_arch = "aarch64")),
  not(all(target_os = "linux", target_arch = "aarch64", target_env = "musl")),
  not(target_arch = "x86_64")
))]
#[global_allocator]
static ALLOC: mimalloc_rust::GlobalMiMalloc = mimalloc_rust::GlobalMiMalloc;

#[cfg(all(not(debug_assertions), target_arch = "x86_64"))]
#[global_allocator]
static ALLOC: snmalloc_rs::SnMalloc = snmalloc_rs::SnMalloc;

#[napi]
#[repr(transparent)]
struct Blake2bHasher(blake2b_simd::State);

#[napi]
impl Blake2bHasher {
  #[napi(constructor)]
  #[inline]
  pub fn new() -> Self {
    Self(blake2b_simd::State::new())
  }

  #[napi]
  #[inline]
  pub fn update(&mut self, input: JsUnknown) -> Result<()> {
    match input.get_type()? {
      ValueType::String => {
        let input_string = unsafe { input.cast::<JsString>() }.into_utf8()?;
        self.0.update(input_string.as_str()?.as_bytes());
      }
      ValueType::Object => {
        let input_buffer = unsafe { input.cast::<JsBuffer>() }.into_value()?;
        self.0.update(input_buffer.as_ref());
      }
      ValueType::Number => {
        let input_number = unsafe { input.cast::<JsNumber>() }.get_double()?;
        let mut buffer = ryu::Buffer::new();
        self.0.update(buffer.format_finite(input_number).as_bytes());
      }
      _ => {
        return Err(Error::new(
          Status::InvalidArg,
          "input must be a string or buffer".to_owned(),
        ));
      }
    }
    Ok(())
  }

  #[napi]
  #[inline]
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
  #[inline]
  pub fn digest_buffer(&mut self) -> Buffer {
    self.0.finalize().as_ref().into()
  }
}

#[napi]
#[repr(transparent)]
struct Blake2sHasher(blake2s_simd::State);

#[napi]
impl Blake2sHasher {
  #[napi(constructor)]
  #[inline]
  pub fn new() -> Self {
    Self(blake2s_simd::State::new())
  }

  #[napi]
  #[inline]
  pub fn update(&mut self, input: JsUnknown) -> Result<()> {
    match input.get_type()? {
      ValueType::String => {
        let input_string = unsafe { input.cast::<JsString>() }.into_utf8()?;
        self.0.update(input_string.as_str()?.as_bytes());
      }
      ValueType::Object => {
        let input_buffer = unsafe { input.cast::<JsBuffer>() }.into_value()?;
        self.0.update(input_buffer.as_ref());
      }
      ValueType::Number => {
        let input_number = unsafe { input.cast::<JsNumber>() }.get_double()?;
        let mut buffer = ryu::Buffer::new();
        self.0.update(buffer.format_finite(input_number).as_bytes());
      }
      _ => {
        return Err(Error::new(
          Status::InvalidArg,
          "input must be a string or buffer".to_owned(),
        ));
      }
    }
    Ok(())
  }

  #[napi]
  #[inline]
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
  #[inline]
  pub fn digest_buffer(&mut self) -> Buffer {
    self.0.finalize().as_ref().into()
  }
}

#[napi]
#[repr(transparent)]
struct Blake3Hasher(blake3::Hasher);

#[napi]
impl Blake3Hasher {
  #[inline]
  #[napi(constructor)]
  pub fn new() -> Self {
    Self(blake3::Hasher::new())
  }

  #[napi]
  #[inline]
  pub fn update(&mut self, input: JsUnknown) -> Result<()> {
    match input.get_type()? {
      ValueType::String => {
        let input_string = unsafe { input.cast::<JsString>() }.into_utf8()?;
        self.0.update(input_string.as_str()?.as_bytes());
      }
      ValueType::Object => {
        let input_buffer = unsafe { input.cast::<JsBuffer>() }.into_value()?;
        self.0.update(input_buffer.as_ref());
      }
      ValueType::Number => {
        let input_number = unsafe { input.cast::<JsNumber>() }.get_double()?;
        let mut buffer = ryu::Buffer::new();
        self.0.update(buffer.format_finite(input_number).as_bytes());
      }
      _ => {
        return Err(Error::new(
          Status::InvalidArg,
          "input must be a string or buffer".to_owned(),
        ));
      }
    }
    Ok(())
  }

  #[napi]
  #[inline]
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
  #[inline]
  pub fn digest_buffer(&mut self) -> Buffer {
    self.0.finalize().as_bytes().to_vec().into()
  }
}
