const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];


class GoogleSheetRowsLoader {
	constructor(credentialPath, tokenPath, spreadsheetId, range) {
		this.credentialPath = credentialPath;
		this.tokenPath = tokenPath
		this.spreadsheetId = spreadsheetId;
		this.range = range;
	}

	loadRows(callback) {
        this.getSheetsApi((sheets) => {
            this.loadSheetRowsWithHeader(sheets, (rows) => {
                callback(rows);
            });
        })
    }

    /**
     * @param {function} callback The callback to call with the sheets API client.
     */
    getSheetsApi(callback) {
        // Load client secrets from a local file.
        fs.readFile(this.credentialPath, (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);

            const credentials = JSON.parse(content);
            // Authorize a client with credentials, then call the Google Sheets API.
            authorize(credentials, this.tokenPath, (auth) => {
                const sheets = google.sheets({
                    version: 'v4',
                    auth
                });
                callback(sheets);
            });
        });
    }

    /**
     * @param {sheets_v4.Sheets} sheets
     * @param {function} callback The callback to call with the row objects.
     */
    loadSheetRowsWithHeader(sheets, callback) {
        sheets.spreadsheets.values.get({
            spreadsheetId: this.spreadsheetId,
            range: this.range,
        }, (err, res) => {
            if (err) return console.log('The API returned an error: ' + err);

            const rows = res.data.values;
            if (!rows.length) return console.log('No data found.');

            const headers = rows[0];
            const rowsWithHeader = rows.slice(1).map(row => {
                const r = Object.assign({}, ...headers.map((h, index) => ({
                    [h]: row[index]
                })));
                return r;
            })

            callback(rowsWithHeader);
        });
    }
}


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {string} tokenPath
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, tokenPath, callback) {
    const {
        client_secret,
        client_id,
        redirect_uris
    } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(tokenPath, (err, token) => {
        if (err) return getNewToken(oAuth2Client, tokenPath, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {string} tokenPath
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, tokenPath, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });

    console.log();
    console.log('----------------------------------------');
    console.log('Authorize this app by visiting this url:');
    console.log();
    console.log(authUrl);
    console.log();

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error while trying to retrieve access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(tokenPath, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', tokenPath);
                console.log('----------------------------------------');
            });
            callback(oAuth2Client);
        });
    });
}


exports.GoogleSheetRowsLoader = GoogleSheetRowsLoader;
