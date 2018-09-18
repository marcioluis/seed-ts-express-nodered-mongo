import express = require('express');

export class HelloWorld {

	private PATH = '/hello';
	private router: express.Router;

	public static getRoutes() {
		const routes = express.Router();

		routes.get('/world', async (rq, rp) => {
			const r = rp;
			r.send({
				message: `Hello World! tsnode`
			});
		});

		const hw = new HelloWorld();
		hw.router.use(hw.PATH, routes);
		return hw.router;
	}

	constructor() {
		this.router = express.Router();
	}
}
