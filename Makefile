build:
	browserify -t [ babelify --presets [  es2015 react ] ] ./src/App.js -o ./dist/bundle.js
