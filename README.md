# git-json-merge

A git merge driver that use [xdiff](https://github.com/dominictarr/xdiff) to automatically resolve merge conflicts in json files. It also detects indentation automatically. This project was inspired by [git-po-merge](https://github.com/beck/git-po-merge).

[![Build Status](https://travis-ci.org/jonatanpedersen/git-json-merge.svg?branch=master)](https://travis-ci.org/jonatanpedersen/git-json-merge)
[![NPM Version](https://img.shields.io/npm/v/git-json-merge.svg)](https://www.npmjs.com/package/git-json-merge)
[![Greenkeeper badge](https://badges.greenkeeper.io/jonatanpedersen/git-json-merge.svg)](https://greenkeeper.io/)

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


Helpful docs:
* http://git-scm.com/docs/gitattributes#_defining_a_custom_merge_driver
* http://stackoverflow.com/questions/28026767/where-should-i-place-my-global-gitattributes-file

Thanks:
* https://gist.github.com/mezis/1605647
* http://stackoverflow.com/questions/16214067/wheres-the-3-way-git-merge-driver-for-po-gettext-files
