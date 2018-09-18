import express = require('express');
import http = require('http');
import RED = require('node-red');
import { find } from '../adapters/mongodb';
import { ESB_ENVIRONMENT, PORT } from '../utils/constants';
import { Logger } from '../utils/logger';

const RED_SETINGS: RED.NodeRedSettings = {
	httpAdminRoot: '/red',
	httpNodeRoot: '/api/v1',
	userDir: './.nodered/',
	nodesDir: './.nodered/nodes',
	flowFile: 'flows.json',
	flowFilePretty: true,
	credentialSecret: false,
	functionGlobalContext: {
	},
	logging: {
		console: {
			level: 'off'
		},
		logger: {
			level: Logger.level,
			metrics: false,
			audit: false,
			handler: (settings: any) => {
				Logger.debug(settings);
				return (log: any) => {
					Logger.log(settings.level, `NODERED ${log.msg}`);
				};
			}
		}
	}
};

export function configureNodeRed(server: http.Server, app: express.Express) {
	/** Configuração do node RED */
	RED.init(server, RED_SETINGS);

	if (ESB_ENVIRONMENT === 'HOMOLOGACAO') {
		app.use(RED_SETINGS.httpAdminRoot, RED.httpAdmin);
		Logger.info(`NODE RED ADMIN listening on ${':' + PORT + RED_SETINGS.httpAdminRoot}`);
	}

	app.use(RED_SETINGS.httpNodeRoot, RED.httpNode);
	// starting
	RED.start();
	Logger.info(`NODE RED listening on ${':' + PORT + RED_SETINGS.httpNodeRoot}`);

}
