class RowsToRecordTransformer {
	constructor(spreadsheetId, range) {}

	/**
	 * @param {Array[Object]} rows The row objects from sheet
	 * @param {function} callback The callback to call with the record.
	 */
	transformToRecord(rows, callback) {
		const record = {
			title: 'N/A',
			data: [],
			total: 'N/A',
			property: 'N/A',
			balance: 'N/A',
		};

		rows.forEach(row => {
			switch (row.fieldType) {
				case 'H':
					record.title = row.name;
					break;
				case 'P':
					record.property = row.balance;
					break;
				case 'T':
					record.total = row.total;
					break;
				case 'B':
					record.balance = row.balance;
					break;
				case 'D':
					if (row.name) {
						record.data.push(this.buildRecordData(row));
					}
					break;
				default:
					break;
			}
		});

		callback(record);
	}

	buildRecordData(row) {
		return {
			name: row.name,
			category: row.category,
			unitPrice: row.unitPrice,
			number: row.number,
			note: row.note,
			total: row.total,
		};
	}
}

exports.RowsToRecordTransformer = RowsToRecordTransformer;
