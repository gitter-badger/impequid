var Dispatcher = require('flux').Dispatcher;

module.exports = {
	main: new Dispatcher(),
	index: new Dispatcher(),
	login: new Dispatcher(),
	notification: new Dispatcher()
};