#pragma once

// Macro to make a Javascript defined function callable in C.
#define IMPORT_JS(ret, name, args, ...) extern "C" __attribute__((import_module("JS"), import_name(#name))) ret name args;

// Macro to make a C function callable from JavaScript.
#define EXPORT_C(name) __attribute__((used, visibility("default"), export_name(#name)))
