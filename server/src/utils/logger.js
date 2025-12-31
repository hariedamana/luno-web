const fs = require('fs');
const path = require('path');

const logFile = 'c:/Users/HARI M J/luno/server/logs.txt';

function log(message) {
    try {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${message}\n`;
        fs.appendFileSync(logFile, logMessage);
    } catch (err) {
        console.error('Logger failed:', err.message);
    }
}

module.exports = log;
