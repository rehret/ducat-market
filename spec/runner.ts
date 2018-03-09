import * as path from 'path';
const Jasmine = require('jasmine');
import { SpecReporter } from 'jasmine-spec-reporter';

const config = require(path.resolve(__dirname, './support/jasmine.json'));
const runner = new Jasmine();
runner.loadConfig(config);

runner.configureDefaultReporter({
	showColors: true
});

runner.clearReporters();
runner.addReporter(new SpecReporter());

runner.execute();
