# MineSweeper in browser

## Features include:
Customizable size and number of mines

First step guaranteed never hit a mine

Game statistics (will reset when changing size/# of mines)

Mark mines and quick stepping

Displays hit/hidden mines and correct/incorrect mine-markings at end of game


## Running

You must have [npm](https://www.npmjs.org/) installed on your computer.
From the root project directory run these commands from the command line:

    npm install

This will install all dependencies.

To build the project, first run this command:

    npm start

This will perform an initial build and start a watcher process that will update build.js with any changes you wish to make.  This watcher is based on [Browserify](http://browserify.org/) and [Watchify](https://github.com/substack/watchify), and it transforms React's JSX syntax into standard JavaScript with [Reactify](https://github.com/andreypopp/reactify).

To run the app, simply open the index.html file in a browser.
