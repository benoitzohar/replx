// @ts-check

const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const { exec } = require("child_process");

function displayTimeSpent(action, hrtime, diff = "", colorFn = null) {
  const message = `[${action}] ${hrtime[0] ? `${hrtime[0]}s ` : ""}${hrtime[1] /
    1000000}ms ${diff}`;
  if (colorFn) {
    console.info(colorFn(message));
  } else {
    console.info(message);
  }
}

function getTimeInSecond(hrtime) {
  return (hrtime[0] || 0) + hrtime[1] / 1000000000;
}

function displayTimes(times) {
  times = times.map(time => {
    time.spentInSeconds = getTimeInSecond(time.spent);
    return time;
  });
  times.sort((a, b) => {
    if (a.spentInSeconds > b.spentInSeconds) return 1;
    else if (a.spentInSeconds < b.spentInSeconds) return -1;
    return 0;
  });

  const baseTime = times[0].spentInSeconds;

  times.forEach((time, index) => {
    const diff =
      index > 0
        ? `(${parseInt((time.spentInSeconds / baseTime) * 10, 10) /
            10}x slower)`
        : "";
    const colorFn =
      times.length > 1
        ? index > 0
          ? chalk.keyword("orange")
          : chalk.green
        : null;
    displayTimeSpent(time.file, time.spent, diff, colorFn);
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

function getFilePath(source) {
  return path.resolve(process.cwd(), source);
}

function createFile(source, comparison) {
  const file = getFilePath(source);
  if (!fs.existsSync(file)) {
    const content = comparison
      ? 'module.exports.A = () => {\n  return "A";\n};\n\nmodule.exports.B = () => {\n  return "B";\n};\n'
      : "";
    try {
      fs.writeFileSync(file, content);
      exec(`open ${file}`);
    } catch (err) {
      console.error(chalk.red(`Could not create a file in ${file}.`));
      throw err;
    }
  } else {
    throw new Error(`The file ${file} already exists.`);
  }
}

function run(source, loops, watchMode) {
  const file = getFilePath(source);
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

module.exports = {
  displayTimeSpent,
  getTimeInSecond,
  displayTimes,
  getTimeSpent,
  runEval,
  runFile,
  getFilePath,
  createFile,
  run
};
