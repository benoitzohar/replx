"use strict";

const path = require("path");

const fs = jest.genMockFromModule("fs");

// This is a custom function that our tests can use during setup to specify
// what the files on the "mock" filesystem should look like when any of the
// `fs` APIs are used.
let mockFiles = Object.create(null);
function __setMockFiles(newMockFiles) {
  mockFiles = Object.create(null);
  for (const file in newMockFiles) {
    const dir = path.dirname(file);

    if (!mockFiles[dir]) {
      mockFiles[dir] = [];
    }
    mockFiles[dir].push({
      name: path.basename(file),
      content: newMockFiles[file]
    });
  }
}

function __getMockFiles() {
  return mockFiles;
}

// A custom version of `readdirSync` that reads from the special mocked out
// file list set via __setMockFiles
function readdirSync(directoryPath) {
  return mockFiles[directoryPath] || [];
}

function existsSync(file) {
  const dir = path.dirname(file);
  return (
    mockFiles[dir] && !!mockFiles[dir].find(f => f.name === path.basename(file))
  );
}

function writeFileSync(file, content) {
  const dir = path.dirname(file);
  if (!mockFiles[dir]) {
    mockFiles[dir] = [];
  }
  mockFiles[dir].push({
    name: path.basename(file),
    content: content
  });
}

fs.__setMockFiles = __setMockFiles;
fs.__getMockFiles = __getMockFiles;
fs.readdirSync = readdirSync;
fs.existsSync = existsSync;
fs.writeFileSync = writeFileSync;

module.exports = fs;
