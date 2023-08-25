# Minimal C++ and libC to WebAssembly (or WASM) template

- No build system. Just a bash script.
- No Emscripten. 
- Stripped down to the bare minimum. Every line of code has a purpose.

This repo is Mac only for now.

This builds on a [self-contained minimal WASM template](https://github.com/dmarcos/wasm-minimal) that I recommend to look at if you want to learn how the bare WASM stack works without the additional standard / system library complexity. To use libC from WASM we need to know: 

- **WebAssembly is designed to be cross-platform so there's no platform API to target** to open a file, access the network stack, write on the standard output, environment variables... 
- **[WASI](https://wasi.dev/) is an effort to create a standard system API for WASM** that is platform agnostic. The official [wasi-sdk](https://github.com/WebAssembly/wasi-sdk) includes headers and libraries to compile and link your code against.
- **In order to run WASM + WASI code we also need a platform specific implementation of the WASI API**. Remember that WebAssembly and WASI are platform agnostic and the code totally portable. For the code to ultimately run on a specific platform we need some code that translates WASI calls into the target platform equivalents. We're focusing on the Web as the target and we're using the [WASI JS implementation for the browser that ships with runno](https://github.com/taybenlor/runno/tree/main/packages/wasi).

## Setup

The command below downloads a wasi-sdk release bundle that contains the WASI headers, libraries, compiler (clang) and linker (wasm-ld)

```sh
./setup.sh
```

## Usage

Compiles and links C++ code to WASM

```sh
./build.sh
```

Starts a local Web server so you can run the code. Open in your browser http://localhost:8080 

```sh
./run.sh
```
## Prior work

https://github.com/michaelfranzl/clang-wasm-browser-starterpack/tree/dev/examples/11

https://medium.com/@michaelyuan_88928/running-llama2-c-in-wasmedge-15291795c470

https://stackoverflow.com/a/29694977/717508

https://github.com/taybenlor/runno

## Notes

`/vendor/wasi.js` is built from the [runno wasi js runtime](https://github.com/taybenlor/runno/tree/main/packages/wasi) by running `mpm run build`. There are two small modifications on [9b9dc1f3142c](https://github.com/taybenlor/runno/commit/9b9dc1f3142c) that I might submit upstream:

1. The ability to pass a WebAssembly.Memory object to the runtime. 
2. The ability to pass an object with JS-defined functions that can be invoked from native code.

I included a `wasi.js.original` file as a references for the differences (git diff wasi.js wasi.js.original)

https://github.com/taybenlor/runno/commit/9b9dc1f3142c

