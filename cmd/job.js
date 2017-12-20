'use strict';
require('dotenvr').load('./.env');

const Runner = require('../libs/Runner');

let eventID = process.argv[2];

if (Number.isNaN(eventID * 1)) {
    console.log('Invalid EventID');
    process.exit(0);
}
let runner = new Runner(eventID);
runner.run().then((v) => { console.log(v);process.exit(0); }).catch((v) => { console.log(v);process.exit(0); });

