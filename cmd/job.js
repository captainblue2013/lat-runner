'use strict';
let config = require('dotenvr').load('./.env');
Object.assign(process.env, config);

const Runner = require('../libs/Runner');

let eventID = process.argv[2];

if (Number.isNaN(eventID * 1)) {
    console.log('Invalid EventID');
    process.exit(0);
}

require('../libs/loadProject')().then((v) => {

    let runner = new Runner(eventID);
    runner.run().then((v) => {
        console.log(v);
        process.exit(0);
    }).catch((v) => {
        console.log(v);
        process.exit(0);
    });
}).catch((e) => {
    console.log('Load Project Error:' + e); process.exit(0);
});


