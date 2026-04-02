// In-memory storage for cavaleiros
const cavaleiros = [];

function add(cavaleiro) {
  cavaleiros.push(cavaleiro);
}

function existsById(id) {
  return cavaleiros.some(c => c.id === id);
}

function clear() {
  cavaleiros.length = 0;
}

module.exports = {
  add,
  existsById,
  clear,
  _store: cavaleiros // exported for inspection/testing if needed
};
