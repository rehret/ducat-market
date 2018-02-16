import { Config, ConfigKeys } from './config/config';
import * as Bunyan from 'bunyan';

export const Log = Bunyan.createLogger({
	level: 'trace',
	name: Config.get(ConfigKeys.AppName),
	src: Config.get(ConfigKeys.LogLineNumbers),
	serializers: Bunyan.stdSerializers,
	streams: []
});

if (Config.get(ConfigKeys.LogToConsole)) {
	Log.addStream({
		stream: process.stdout,
		level: Config.get(ConfigKeys.LogLevel)
	});
}

if (Config.get(ConfigKeys.LogToFile)) {
	Log.addStream({
		type: 'rotating-file',
		path: Config.get(ConfigKeys.LogFilePath),
		level: Config.get(ConfigKeys.LogLevel),
		period: Config.get(ConfigKeys.LogFileRotation),
		count: Config.get(ConfigKeys.LogFileCount)
	});
}
