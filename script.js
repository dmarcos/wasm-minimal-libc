import { WASI as WASIJS, WASIContext } from "./vendor/wasi.js";

var context;
var wasmExports;
var result;

var Uint8WASMMemoryView;
// Reads a string from the wasm memory heap to JavaScript (decoded as UTF8)
var getStringfromWASMHeap = function (ptr, length)
{
  if (length === 0 || !ptr) { return ''; };
  // If length not passed looks for the null character '\0' used to terminate
  // C / C++ strings.
  if (!length) { 
    for (length = 0; length != ptr + Uint8WASMMemoryView.length && Uint8WASMMemoryView[ptr+length]; length++); 
  }
  return new TextDecoder().decode(Uint8WASMMemoryView.subarray(ptr, ptr+length));
};

window.onload = async function () {
  
  // Initialize WASM memory.
  var wasmMemory = new WebAssembly.Memory({initial:32, maximum: 1000});
  // Unsigned byte view of the WASM memory. Used to extract strings.  
  Uint8WASMMemoryView = new Uint8Array(wasmMemory['buffer']);

  // Object to pass JS functions to C / C++.
  var JS =
  {
    printString: (str) => { console.log('Print String (JS code called from C): ' + getStringfromWASMHeap(str)); },
    addNumbers: function(a, b) { console.log('Add numbers (JS code called from C): ' + a + ' + ' + b + ' Result: ' + (a + b)); }
  };
  
  var wasmImports = {
    JS: JS,
    env: {memory: wasmMemory, table: new WebAssembly.Table({initial: 2, element: 'anyfunc' })},
  };

  // Initializing file system.
  var fileName = 'lorem-ipsum.txt';
  var fileRequest = await fetch(fileName);
  var files = {};
  var fileContent = await fileRequest.arrayBuffer();

  // Fetch a file over the network and add it to the virtual file system.
  files['/lorem-ipsum.txt'] = {
    path: fileName,
    timestamps: {
      change: new Date(fileRequest.headers.get('Last-Modified')),
      access: new Date(fileRequest.headers.get('Last-Modified')),
      modification: new Date(fileRequest.headers.get('Last-Modified')),
    },
    mode: 'binary',
    content: new Uint8Array(fileContent),
  };

  // Define files inline in JS for testing purposes.
  files['/test.txt'] = {
    path: 'test.txt',
    timestamps: {
      change: new Date(),
      access: new Date(),
      modification: new Date(),
    },
    mode: 'string',
    content: 'Some content for the file.',
  };

  context = new WASIContext({
    args: ['lorem-ipsum.txt'],
    stdout: function (out) { console.log("STDOUT:", out) },
    stderr: function (err) { console.error("STDERR:", err) },
    stdin: () => prompt("STDIN:"),
    fs: files
  });

  result = await WASIJS.start(fetch('hello-world.wasm'), context, wasmImports);
  wasmExports = result.instance.exports;

  var a = 3;
  var b = 4; 
  console.log('Add numbers (C code called from JS): ' + a + ' + ' + b + ' Result: ' + wasmExports.add(3, 4));
  wasmExports.sayHello();
}
