var chai = require('chai');
var expect = chai.expect;
var gitJsonMerge = require('../lib/git-json-merge');

describe('gitJsonMerge', function () {
	var foo = { foo: 'foo' };
	var bar = { bar: 'bar' };
	var fooBar = { foo: 'foo', bar: 'bar' };

	describe('mergeJson', function () {
		describeMergeJsonTest(foo, foo, foo, foo);
		describeMergeJsonTest(foo, foo, bar, bar);
		describeMergeJsonTest(fooBar, foo, foo, fooBar);
		describeMergeJsonTest(fooBar, foo, bar, bar);
		describeMergeJsonTest(bar, fooBar, bar, bar);
		describeMergeJsonTest(bar, fooBar, fooBar, bar);
	});

	describe('selectVersion', function () {
		describeSelectVersionTest(4, 2, 2, 4);
		describeSelectVersionTest(4, 4, 2, 2);
		describeSelectVersionTest(4, 4, 4, 4);
		describeSelectVersionTest(2, 4, 2, 2);
		describeSelectVersionTest(2, 2, 4, 4);
		describeSelectVersionTest(2, 4, 4, 2);
	});

	describe('stripBom', function () {
		describeStripBomTest('[{"id":1,"field":"Foo"}]', '[{"id":1,"field":"Foo"}]');
		describeStripBomTest('\uFEFF[{"id":1,"field":"Foo"}]', '[{"id":1,"field":"Foo"}]');
		describeStripBomTest('[{"id":1,"field":"Foo"}]\uFEFF', '[{"id":1,"field":"Foo"}]\uFEFF');
		describeStripBomTest('[{"id":1,\uFEFF"field":"Foo"}]', '[{"id":1,\uFEFF"field":"Foo"}]');
		describeStripBomTest('\uFEFF[{"id":1,"field":"Foo"}]\uFEFF', '[{"id":1,"field":"Foo"}]\uFEFF');
	});
});

function toString (object) {
		return JSON.stringify(object);
}

function clone (object) {
		return JSON.parse(JSON.stringify(object));
}

function repeatCharacter (character, count) {
	return new Array(count + 1).join(character);
}

function describeMergeJsonTest (ours, base, theirs, expected) {
	ours = toString(clone(ours));
	base = toString(clone(base));
	theirs = toString(clone(theirs));
	expected = toString(clone(expected));

	describe('given arguments of ' + toString(ours) + ' as ours, ' + toString(base) + ' as base and '  + toString(theirs) + ' as theirs', function () {
		var actual = gitJsonMerge.mergeJson(ours, base, theirs);

		it('should return ' + toString(expected), function () {
			expect(actual).to.deep.equal(expected);
		})
	});
}

function describeSelectVersionTest (ours, base, theirs, expected) {
	var character = ' ';
	ours = repeatCharacter(character, ours);
	base = repeatCharacter(character, base);
	theirs = repeatCharacter(character, theirs);
	expected = repeatCharacter(character, expected);

	describe('given arguments of ' + ours.length + ' as ours, ' + base.length + ' as base and '  + theirs.length + ' as theirs', function () {
		var actual = gitJsonMerge.selectVersion(ours, base, theirs);
		it('should return ' + expected.length, function () {
			expect(actual).to.equal(expected);
		})
	});
}

function describeStripBomTest (str, expected)  {
	describe('given arguments of ' + str.replace('\uFEFF', '<BOM>') + ' as str', function () {
		var actual = gitJsonMerge.stripBom(str);

		it('should return ' + expected.replace('\uFEFF', '<BOM>'), function () {
			expect(actual).to.equal(expected);
		})
	});
}
