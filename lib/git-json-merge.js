var merge = require('./merge');
var fs = require('fs');

var oursFileName = process.argv[2];
var baseFileName = process.argv[3];
var theirsFileName =process.argv[4];
var ours = JSON.parse(fs.readFileSync(oursFileName, 'utf-8'));
var base = JSON.parse(fs.readFileSync(baseFileName, 'utf-8'));
var theirs = JSON.parse(fs.readFileSync(theirsFileName, 'utf-8'));
var newBase = merge(ours, base, theirs);
var newBaseJSON = JSON.stringify(newBase, true, 4);

console.log(newBaseJSON);

fs.writeFileSync(oursFileName, newBaseJSON, 'utf-8');
