"use strict";

const child_process = jest.genMockFromModule("child_process");

let commands = [];
function __resetExecutedCommands() {
  commands = [];
}
function __getExecutedCommands() {
  return commands;
}

function exec(cmd) {
  commands.push(cmd);
}

child_process.__resetExecutedCommands = __resetExecutedCommands;
child_process.__getExecutedCommands = __getExecutedCommands;
child_process.exec = exec;

module.exports = child_process;
