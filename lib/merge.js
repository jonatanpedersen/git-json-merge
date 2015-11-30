module.exports = function merge(ours, base, theirs) {
  var theirBaseDelta = delta(base, theirs);
  var ourBaseDelta = delta(base, ours);

  var newBase = theirs;

  Object.keys(ourBaseDelta.created).reduce(function(newBase, key) {
    newBase[key] = ourBaseDelta.created[key];

    return newBase;
  }, newBase);

  Object.keys(ourBaseDelta.updated).reduce(function(newBase, key) {
    newBase[key] = ourBaseDelta.updated[key];

    return newBase;
  }, newBase);

  Object.keys(ourBaseDelta.deleted).reduce(function(newBase, key) {
    delete newBase[key];

    return newBase;
  }, newBase);

  var sortedNewBase = Object.keys(newBase).sort().reduce(function(sortedNewBase, key) {
    sortedNewBase[key] = newBase[key];

    return sortedNewBase;
  }, {});

  return sortedNewBase;
}

function delta(a, b) {
  var created = Object.keys(b).reduce(function(created, key) {
    if (!a[key] && b[key])
      created[key] = b[key];

    return created;
  }, {});

  var deleted = Object.keys(a).reduce(function(deleted, key) {
    if (a[key] && !b[key])
      deleted[key] = a[key];

    return deleted;
  }, {});

  var updated = Object.keys(b).reduce(function(updated, key) {
    if (a[key] && b[key] && a[key] !== b[key])
      updated[key] = b[key];

    return updated;
  }, {});

  return {
    created: created,
    deleted: deleted,
    updated: updated
  }
}
