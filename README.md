# git-json-merge
A git merge driver that use [xdiff](https://github.com/dominictarr/xdiff) to automatically resolve merge conflicts in json files. This project was inspired by [git-po-merge](https://github.com/beck/git-po-merge).

## Install
This can be done one of two ways, globally or per-project/directory:

### Globally
Install:
```sh
npm install --global git-json-merge
```

Add to `~/.gitconfig`:
```ini
[core]
    attributesfile = ~/.gitattributes
[merge "json"]
    name = custom merge driver for json files
    driver = git-json-merge %A %O %B
```

Create `~/.gitattributes`:
```ini
*.json merge=json
```

### Single project / directory

Install:
```sh
npm install git-json-merge --save-dev
```

Update git config:
```sh
git config merge.json.driver "$(npm bin)/git-json-merge %A %O %B"
git config merge.json.name "custom merge driver for json files"
```

Add the same `.gitattributes` where desired and commit.  
Note `.gitattributes` is only used after committed.

### driver code
```js
var fs = require('fs');
var xdiff = require('xdiff');

var oursFileName = process.argv[2];
var baseFileName = process.argv[3];
var theirsFileName = process.argv[4];
var ours = JSON.parse(fs.readFileSync(oursFileName, 'utf-8'));
var base = JSON.parse(fs.readFileSync(baseFileName, 'utf-8'));
var theirs = JSON.parse(fs.readFileSync(theirsFileName, 'utf-8'));
var diff = xdiff.diff3(theirs, base, ours);
var newOurs = xdiff.patch(base, diff);
var newOursJSON = JSON.stringify(newOurs, true, 4);

fs.writeFileSync(oursFileName, newOursJSON, 'utf-8');
```

Helpful docs:
* http://git-scm.com/docs/gitattributes#_defining_a_custom_merge_driver
* http://stackoverflow.com/questions/28026767/where-should-i-place-my-global-gitattributes-file

Thanks:
* https://gist.github.com/mezis/1605647
* http://stackoverflow.com/questions/16214067/wheres-the-3-way-git-merge-driver-for-po-gettext-files
