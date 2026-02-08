export type HealthResponse = {
	status: "ok";
	version: string;
	commit: string;
	buildTime: string;
	uptime: number;
};

const APP_START_TIME = Date.now();

export function getUptime(): number {
	return Math.floor((Date.now() - APP_START_TIME) / 1000);
}

export function buildHealthResponse(): HealthResponse {
	return {
		status: "ok",
		version: __APP_VERSION__,
		commit: __BUILD_COMMIT__,
		buildTime: __BUILD_TIME__,
		uptime: getUptime(),
	};
}
