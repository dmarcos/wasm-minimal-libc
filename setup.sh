#!/bin/bash
source ./vars.sh

curl -L https://github.com/WebAssembly/wasi-sdk/releases/download/wasi-sdk-${WASI_VERSION}/${WASI_FILENAME} -o ${WASI_FILENAME}
tar xvf wasi-sdk-${WASI_VERSION_FULL}-macos.tar.gz