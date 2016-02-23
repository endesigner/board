default: build

fast: FAST = --fast
fast: build

build:
	@date
	browserify -t [ babelify --presets [  es2015 react ] ] $(FAST) ./src/App.js -o ./dist/bundle.js
	@date
