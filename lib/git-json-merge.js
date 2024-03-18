var fs = require('fs');
var xdiff = require('xdiff');
var detectIndent = require('detect-indent');

var encoding = 'utf-8';

function detectTrailingNewline (str) {
	if (str.endsWith('\r\n')) {
		return '\r\n';
	} else if (str.endsWith('\n')) {
		return '\n';
	} else {
		return '';
	}
}

function mergeJsonFiles (oursFileName, baseFileName, theirsFileName) {
	var oursJson = stripBom(fs.readFileSync(oursFileName, encoding));
	var baseJson = stripBom(fs.readFileSync(baseFileName, encoding));
	var theirsJson = stripBom(fs.readFileSync(theirsFileName, encoding));
	var newOursJson = mergeJson(oursJson, baseJson, theirsJson);
	fs.writeFileSync(oursFileName, newOursJson, encoding);
}

function mergeJson (oursJson, baseJson, theirsJson) {
	var indent = mapAndSelect((str) => detectIndent(str).indent, oursJson, baseJson, theirsJson);
	var trailingNewline = mapAndSelect(detectTrailingNewline, oursJson, baseJson, theirsJson);
	var ours = JSON.parse(oursJson);
	var base = JSON.parse(baseJson);
	var theirs = JSON.parse(theirsJson);
	var newOurs = merge(ours, base, theirs);
	var newOursJson = JSON.stringify(newOurs, null, indent) + trailingNewline;

	return newOursJson;
}

function merge (ours, base, theirs) {
	var diff = xdiff.diff3(ours, base, theirs);

	if (diff) {
		return xdiff.patch(base, diff);
	}

	return base;
}

function selectVersion (ours, base, theirs) {
	return ours !== base ? ours : theirs !== base ? theirs : base;
}

function mapAndSelect (fn, ours, base, theirs) {
	return selectVersion(fn(ours), fn(base), fn(theirs));
}

function stripBom (str) {
	return str[0] === '\uFEFF' ? str.slice(1) : str;
}

module.exports = {
	detectTrailingNewline: detectTrailingNewline,
	mergeJsonFiles: mergeJsonFiles,
	mergeJson: mergeJson,
	merge: merge,
	selectVersion: selectVersion,
	mapAndSelect: mapAndSelect,
	stripBom: stripBom
}
