#!/bin/sh

yarn="yarn --non-interactive -s"

mkdir -p dist/

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

deploy() {
	release
	mkdir -p build/
	mv dist/ *.css *.html build/
}

"$@"
