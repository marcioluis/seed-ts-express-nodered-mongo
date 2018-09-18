/// <reference types="node" />

declare module 'node-red' {

	export function init(server: any, settings: any): void
	export function start(): void;
	export function stop(): void;
	export function version(): string;
	export const httpAdmin: any;
	export const httpNode: any;
	export const server: any;

	export interface NodeRedSettings {
		// Runtime Configuration
		flowFile?: string;
		flowFilePretty?: boolean;
		credentialSecret?: string | boolean;
		userDir?: string;
		nodesDir?: string;
		uiHost?: string;
		uiPort?: string;
		httpAdminRoot?: string;
		/** @deprecated */
		httpAdminAuth?: string;
		httpNodeRoot?: string;
		httpNodeAuth?: string;
		httpRoot?: string;
		https?: any;
		disableEditor?: boolean;
		httpStatic?: string;
		httpStaticAuth?: any;
		httpNodeCors?: any
		httpNodeMiddleware?: (req: any, res: any, next: any) => void
		logging?: { console: NodeRedLogging, [key: string]: NodeRedLogging }
		// Editor Configuration
		adminAuth?: any;
		paletteCategories?: any;
		// Editor Themes
		editorTheme?: object;
		// Dashboard
		ui?: any;
		// Node Configuration
		functionGlobalContext?: any;
	}

	export interface NodeRedLogging {
		level?: string;
		metrics?: boolean;
		audit?: boolean;
		handler?: Function;
	}

}
