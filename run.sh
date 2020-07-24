#!/bin/sh

yarn="yarn --non-interactive -s"

clean() {
	rm -rf dist/*
}

gen_js() {
	$yarn bundle | $yarn minify > dist/index.js
}

release() {
	clean
	gen_js
}

"$@"
