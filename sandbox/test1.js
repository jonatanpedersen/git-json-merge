var path = require('path');

var gitJsonMerge = require('./../lib/git-json-merge.js');

var names = 
  ['ours', 'base', 'theirs']
  .map(i => path.resolve('../puppeteer-sb', i + '.json'))

gitJsonMerge.mergeJsonFiles(names[0], names[1], names[2]);