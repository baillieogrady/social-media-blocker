const groups = Object.keys(globalThis.BLOCKED_SITES.groups);
document.getElementById('count').textContent = `${groups.length} network groups blocked`;
for (const name of groups) {
  const item = document.createElement('li');
  item.textContent = name;
  document.getElementById('sites').append(item);
}
