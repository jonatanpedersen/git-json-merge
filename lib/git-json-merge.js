var fs = require('fs');
var xdiff = require('xdiff');
var detectIndent = require('detect-indent');

var encoding = 'utf-8';

function mergeJsonFiles (oursFileName, baseFileName, theirsFileName) {
	var oursJson = fs.readFileSync(oursFileName, encoding);
	var baseJson = fs.readFileSync(baseFileName, encoding);
	var theirsJson = fs.readFileSync(theirsFileName, encoding);
	var newOursJson = mergeJson(oursJson, baseJson, theirsJson);
	fs.writeFileSync(oursFileName, newOursJson, encoding);
}

function mergeJson (oursJson, baseJson, theirsJson) {
	var oursIndent = detectIndent(oursJson).indent;
	var baseIndent = detectIndent(baseJson).indent;
	var theirsIndent = detectIndent(theirsJson).indent;
	var newOursIndent = selectIndent(oursIndent, baseIndent, theirsIndent);
	var ours = JSON.parse(oursJson);
	var base = JSON.parse(baseJson);
	var theirs = JSON.parse(theirsJson);
	var newOurs = merge(ours, base, theirs);
	var newOursJson = JSON.stringify(newOurs, null, newOursIndent);

	return newOursJson;
}

function merge (ours, base, theirs) {
	var diff = xdiff.diff3(ours, base, theirs);

	if (diff) {
		return xdiff.patch(base, diff);
	}

	return base;
}

function selectIndent (oursIndent, baseIndent, theirsIndent) {
	return oursIndent !== baseIndent ? oursIndent : theirsIndent !== baseIndent ? theirsIndent : baseIndent;
}

module.exports = {
	mergeJsonFiles: mergeJsonFiles,
	mergeJson: mergeJson,
	merge: merge,
	selectIndent: selectIndent
}
