const { GoogleSheetRowsLoader } = require('./loaders/google_sheets_loader');
const { RowsToRecordTransformer } = require('./transformers/rows_to_record_transformer');
const { RecordYamlDumper } = require('./dumpers/record_yaml_dumper');

const CREDENTIAL_PATH = 'google-credentials.json';
const TOKEN_PATH = 'google-sheet-token.json';
const SHEET_RANGE = 'Record';

const RECORD_YAML_PATH = '_data/records/_record.yml';


/**
 * Usage:
 *  - Run with args: [GOOGLE_SHEETS_ID]
 * Pre-requirements:
 *  - Google Sheet API credential file (google-credentials.json)
 */
function main() {
	const args = process.argv.slice(2);
	const [spreadsheetId] = args;

	const loader = new GoogleSheetRowsLoader(CREDENTIAL_PATH, TOKEN_PATH, spreadsheetId, SHEET_RANGE);
	const transformer = new RowsToRecordTransformer();
	const dumper = new RecordYamlDumper(RECORD_YAML_PATH);

	loader.loadRows((rows) => {
	    transformer.transformToRecord(rows, (record) => {
		    dumper.dumpRecord(record, () => {
			    console.log('[SAVE]', RECORD_YAML_PATH);
		    });
	    });
	});
}

main();
