# Github Ranking
This app is a realtime ranking of commits done on github, built with oAuth and sockets. With it you can check how many commits you did last weeks. Besides that, you can compare this to the commits your friends and colleagues did.

## Demo
[Demo here](https://github-ranking.herokuapp.com/)

## Installation

```
$ git clone https://github.com/Frankwarnaar/minor-realtime-web-oAuth.git
$ npm install
$ npm start
```

## Usage

Login with GitHub. After this, you're redirected to the ranking. Here you can select which ranking table you want to see: 

1. This week
2. Last week
3. The week before last week

In the form on the bottom, you can enter users to the ranking by entering their username in the input field

## Development
When developing on this project, run
```
$ gulp
```
An express server will start running and your files will be watched.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request

## Features
* [x] Connect with github via oAuth
* [x] Receive commits from a user (only on master-branch of own repos) with the github api
* [x] Create a ranking of the number of commits of the users that logged in once
* [x] Update ranking every 10 seconds
* [x] Let the user select the ranking of which week he/she wants to see
* [x] Enter someone in the results with a search bar
* [x] Notify the user when connection is lost or restored with the server
* [x] Notify the user when the connection between the server and GitHub is lost or restored
* [x] Send user the latest ranking when connection is restored

## Wish list
* [ ] Remove users from ranking
* [ ] Store ranking in database

## Tooling
I used gulp to build my javascript and scss. Besides that, I used it to run my server in development.

## Events reference
### Server side
1. `connection`: Push the new socket an array with all open sockets
2. `disconnect`: Splice the socket from the sockets array
3. `publishUser`: Push a user that logged in with GitHub to the users, all clients will be sent an updated version of the ranking, with this user added
4. `publishNewUser`: Push a user that's added via the form to the users, all clients will be sent an updated version of the ranking, with this user added
5. `registerUsers`: A client requests the scores of the users within an other week. These will be sent

### Client side
1. `connect`: Store that the app is connected to the server
2. `disconnect`: Notify the user that the connection with the server is gone
3. `publishUsers`: Update the ranking
4. `publishSourceState`: Notify the user that the connection between the server and GitHub is restored/broken

## Data life
1. A user logs in to GitHub
2. His name and login name are sent to the server
3. For each user, the server receives his/her repos. For all these repos, the server gets the commits from the master-branch. The score gets upped one for each commit.
4. If a user changes which week he/she wants to see, an event is sent to the server with the selected option. The server filters the commits by the selected week and sends that score back to the client.
5. If a client enters a new name in the form, an event will be sent to the server with that name. The server will get the commits done by that user and update all clients with a new ranking including the added person.

## Depencencies
* compression: gzip files sent to the user
* dotenv: Hide 
* ejs: Templating engine
* express-ejs-extend: Makes sure it's possible to extend in ejs
* express-session: Store data of the user during a session
* request: Handle http requests
* static-asset: Fingerprint static files to make sure users don't end up with a cached version, while they need a new one

## Dev dependencies
* babel-preset-es2015-without-strict: Bundle javascript without 'use strict' on global scope
* babelify: Babel preset for browserify
* browser-sync": Display changes on static files immediately while developing
* browserify": Bundle javascript
* express": Framework for node.js
* gulp: Build tool
* gulp-clean: Gulp plugin to empty a directory
* gulp-if: Gulp plugin for condition
* gulp-nodemon: Gulp plugin to run nodemon
* gulp-plumber: Gulp plugin to prevent pipes from breaking on errors
* gulp-sass: Gulp plugin to compile s
* gulp-sourcemaps: Gulp plugin to write sourcemaps on bundled files
* gulp-util: Gulp plugin for readable errors
* gulp-watch": Gulp plugin to watch files and directories for changes
* nodemon": Package to restart app on changes
* run-sequence: Plugin to run tasks in sequence in gulp
* socket.io: Package for websockets
* vinyl-buffer: Gulp plugin to transforms files into streams, used for watchify
* vinyl-source-stream: Makes sure it doesn't matter wheter you're dealing with a buffer or a stream
* watchify: Bundle javascript on changes
* xo: Linting package

