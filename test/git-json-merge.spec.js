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

	describe('selectIndent', function () {
		describeSelectIndentTest(4, 2, 2, 4);
		describeSelectIndentTest(4, 4, 2, 2);
		describeSelectIndentTest(4, 4, 4, 4);
		describeSelectIndentTest(2, 4, 2, 2);
		describeSelectIndentTest(2, 2, 4, 4);
		describeSelectIndentTest(2, 4, 4, 2);
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

function describeSelectIndentTest (ours, base, theirs, expected) {
	var character = ' ';
	ours = repeatCharacter(character, ours);
	base = repeatCharacter(character, base);
	theirs = repeatCharacter(character, theirs);
	expected = repeatCharacter(character, expected);

	describe('given arguments of ' + ours.length + ' as ours, ' + base.length + ' as base and '  + theirs.length + ' as theirs', function () {
		var actual = gitJsonMerge.selectIndent(ours, base, theirs);
		it('should return ' + expected.length, function () {
			expect(actual).to.equal(expected);
		})
	});
}
