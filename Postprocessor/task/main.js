const fs = require('fs');
const { createHash } = require('crypto');
const inputPath = "database.csv";
const pathToFilteredFile = "filtered_database.csv";
const pathToHashedFile = "hash_database.csv";

function readFileLines(filename) {
    return fs.readFileSync(filename).toString('utf8').split(/\r?\n/);
}

function hashPasswd(row) {
    // id, nickname, password, consent to mailing
    let userData = row.split(/,\s+/);
    if (userData[0] !== "id") {
        userData[2] = hash(userData[2]);
    }
    return userData;
}

function hash(string) {
    return createHash('sha256').update(string).digest('hex');
}

function writeCsv(pathToFile, data) {
    fs.writeFile(pathToFile, data, err => {
        if (err) {
            console.error(err);
        }
        // file written successfully
    });
}

function appendCsv(pathToFile, content) {
    let data = "\n" + content;
    fs.appendFile(pathToFile, data, err => {
        if (err) {
            console.error(err);
        }
        // file written successfully
    });
}

function main() {
    let dataArray = readFileLines(inputPath);
    writeCsv(pathToFilteredFile, dataArray[0]);
    writeCsv(pathToHashedFile, dataArray[0]);
    let userId = 1;
    for (let i = 1; i < dataArray.length; i++) {
        let line = hashPasswd(dataArray[i]);
        if (!dataArray[i].includes("-")) {
            line[0] = userId++;
            appendCsv(pathToFilteredFile, line.join(", "));
        }
        appendCsv(pathToHashedFile, line.join(", "));
    }
}

main();