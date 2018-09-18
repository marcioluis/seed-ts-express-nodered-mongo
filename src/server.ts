import bodyParser = require('body-parser');
import cors = require('cors');
import express = require('express');
import http = require('http');

import { configureNodeRed } from './middleware/node-red';
import { PORT } from './utils/constants';

import { HelloWorld } from './routes/HelloWorld';
import { Logger } from './utils/logger';

export class ServerApp {
	private app: express.Express;
	private server: http.Server;

	public start() {

		this.app = express();
		this.app.use(bodyParser.urlencoded({ extended: true }));
		this.app.use(bodyParser.json());

		const corsOpt: cors.CorsOptions = { exposedHeaders: 'app-error-type' };
		this.app.use(cors(corsOpt));

		this.server = http.createServer(this.app);

		/* Rotas */
		// root
		this.app.use('/', express.static(`${__dirname}/public`));
		// node red
		configureNodeRed(this.server, this.app);
		// servicos/rotas
		const API_ROOT = '/api';
		this.app.use(API_ROOT,
			HelloWorld.getRoutes());

		// error handlers
		this.app.use(errorHandler);

		this.server.listen(PORT, () => {
			Logger.info(`Server listening on port ${PORT}!`);
		});
	}
}

const errorHandler: express.ErrorRequestHandler = (err, rq, res, next) => {
	if (res.headersSent) {
		return next(err);
	}
	console.error(err.stack);
	res.status(500).send('Something broke!');
};
