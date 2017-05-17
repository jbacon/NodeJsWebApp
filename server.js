console.log('Starting Node application')

const express = require('express');
const app = express();

app.listen(3000, function() {
	console.log('Listening on 3000');
})

app.get('/', function (request, response) {
	//do something
	response.sendFile(__dirname + '/index.html');
});

app.post('/quotes', (req, res) => {
  console.log('Hellooooooooooooooooo!')
})