#include <wasm.h>
#include <stdio.h>
#include <string.h>

// Define functions in Javascript that can be called from C.
IMPORT_JS(void, printString, (char const* str))
IMPORT_JS(void, addNumbers, (int a, int b))

// This function is called at startup
EXPORT_C(sayHello) void sayHello()
{
	char const *str = "HELLO WORLD\0";
	printString(str);
	addNumbers(30, 12);
}

// Define a C function that can be called from JavaScript.
EXPORT_C(add) int add(int a, int b)
{
	return a + b;
}

int main (int argc, const char * argv[]) {
	int const strLength = 445;
	char str[strLength];
	memset(str, '\0', sizeof(str));

	if (argc != 1) { fprintf(stderr, "Program only accepts one argument\n"); }

	FILE *file = fopen(argv[0], "rb");
	if (!file) {
	  printf("Unable to open file!!!!\n");
	  return -1;
	}

	if(fread((void*) str, sizeof(char), strLength, file) != 1) {
		printf("%s\n", str);
	} else {
		printf("File read\n");
	}

}
