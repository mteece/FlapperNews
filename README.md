# FlapperNews
Reddit/Hacker News clone using the MEAN stack (MongoDB, Express.js, AngularJS, and Node.js).

## Setup

* Install Node.js
* Install MongoDB via Homebrew

Be sure to run in the project root to install dependencies:

	$ npm install

### Running

MongoDB

	$ mongod -dbpath /Users/<user>/Databases/MongoDB/
	
MongoDB Client

	$ mongo
	
See http://docs.mongodb.org/manual/core/crud-introduction/ for queries, etc.

Express

	$ npm start
	
You should be able to run and view http://localhost:3000/#/home


### Todo

* Break out HTML templates from index.ejs
* Add more UI styles
* Search and filter (local and server)
	