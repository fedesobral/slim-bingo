import balls from './_balls.js';

const contents = JSON.stringify(balls.map(({dataSet, ...b}) => b));

export function get(req, res) {
	res.writeHead(200, {
		'Content-Type': 'application/json'
	});

	res.end(contents);
}