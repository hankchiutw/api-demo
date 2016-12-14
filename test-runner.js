'use strict';

const Mocha = require('mocha');
const mocha = new Mocha({
    bail: false
});

const read = require('fs-readdir-recursive');

addDir('./test');

console.log('****** test-runner.js ******');
mocha.run();

function addDir(dir){
    read(dir)
        .filter(file => file.endsWith('.spec.js'))
        .forEach(file => mocha.addFile(`${dir}/${file}`));
}
