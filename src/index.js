// @ts-check

const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

function displayTimeSpent(action, hrtime, diff = "", colorFn = null) {
  const message = `[${action}] ${hrtime[0] ? `${hrtime[0]}s ` : ""}${hrtime[1] /
    1000000}ms`;
  if (colorFn) {
    console.info(colorFn(message));
  } else {
    console.info(message);
  }
}

function displayTimes(times) {
  times.forEach(time => {
    displayTimeSpent(time.file, time.spent);
  });
}

//
// Measure time spent on a specific function
//
function getTimeSpent(fn, loops) {
  const startTime = process.hrtime();
  for (let i = 0; i < loops; i++) {
    fn();
  }
  return process.hrtime(startTime);
}

function runEval(source, loops) {
  const spent = getTimeSpent(function() {
    eval(source);
  }, loops);
  displayTimes([{ file: "Inline code", spent }]);
}

function runFile(file, loops) {
  try {
    // require first outside of the loop to be able to leverage require's cache
    const filePath = require.resolve(file);
    const fileBasename = path.basename(file);
    delete require.cache[filePath];
    const content = require(file);

    const actions = Object.keys(content);
    if (actions.length) {
      const times = actions.map(action => {
        const spent = getTimeSpent(() => {
          const res = content[action]();
          if (loops === 1 && res) {
            console.info(res);
          }
        }, loops);
        return { file: action, spent };
      });

      displayTimes(times);
    } else {
      const spent = getTimeSpent(() => {
        delete require.cache[filePath];
        require(file);
      }, loops);
      displayTimes([{ file: fileBasename, spent }]);
    }
  } catch (err) {
    console.error(err);
  }
}

function run(source, loops, watchMode) {
  const file = process.cwd() + "/" + source;
  if (fs.existsSync(file)) {
    runFile(file, loops);
    if (watchMode) {
      fs.watchFile(file, () => {
        console.info("---");
        runFile(file, loops);
      });
    }
  } else {
    runEval(source, loops);
  }
}
module.exports = run;

const source = process.argv[2] || "";
const loops = parseInt(process.argv[3], 10) || 1;
const watchMode = process.argv.find(arg => arg === "--watch" || arg === "-w");

run(source, loops, watchMode);
