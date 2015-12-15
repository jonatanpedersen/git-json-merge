var fs = require('fs');
var xdiff = require('xdiff');

var oursFileName = process.argv[2];
var baseFileName = process.argv[3];
var theirsFileName = process.argv[4];
var ours = JSON.parse(fs.readFileSync(oursFileName, 'utf-8'));
var base = JSON.parse(fs.readFileSync(baseFileName, 'utf-8'));
var theirs = JSON.parse(fs.readFileSync(theirsFileName, 'utf-8'));
var diff = xdiff.diff3(ours, base, theirs);
var newOurs = xdiff.patch(base, diff);
var newOursJSON = JSON.stringify(newOurs, null, 4);

fs.writeFileSync(oursFileName, newOursJSON, 'utf-8');
