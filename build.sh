#!/bin/bash

source ./vars.sh
$CC --target=wasm32-wasi -O3 -flto -fno-exceptions -I. -o hello-world.o -c hello-world.cpp
$LD --export-dynamic --lto-O3 -L${WASI_SDK_PATH}/share/wasi-sysroot/lib/wasm32-wasi -lc -lc++ -lc++abi ${WASI_SDK_PATH}/share/wasi-sysroot/lib/wasm32-wasi/crt1.o --import-memory hello-world.o -o hello-world.wasm