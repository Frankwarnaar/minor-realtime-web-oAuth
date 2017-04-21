# Realtime web - oAuth

In this repo, you can find my work for the course `realtime web` for my minor `everything-web` at the HvA Amsterdam. This repo only contains the code for the classes in which we learned working with `oAuth`.

## Demo
[Demo here](https://github-ranking.herokuapp.com/)

## Installation

```
$ git clone https://github.com/Frankwarnaar/minor-realtime-web-oAuth.git
$ npm install
$ npm start
```

## Usage

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
* [x] Receive commits from a user with the github api
* [x] Create a ranking of the number of commits of the users that logged in once
* [x] Update ranking once in a while
* [ ] Show online users
* [ ] Enter someone in the results with a search bar
