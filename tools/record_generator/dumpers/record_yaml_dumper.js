const fs = require('fs');
const yaml = require('js-yaml');


class RecordYamlDumper {
	constructor(yamlPath) {
		this.yamlPath = yamlPath;
	}

	dumpRecord(record, callback) {
		const recordYaml = yaml.safeDump(record, {
			indent: 4
		});

		fs.writeFile(this.yamlPath, `---\n${recordYaml}`, (err) => {
			if (err) return console.log('Error write YAML file:', err);
			callback();
		});
	}
}

exports.RecordYamlDumper = RecordYamlDumper;
