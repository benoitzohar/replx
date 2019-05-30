const chalk = require("chalk");

const {
  getTimeInSecond,
  displayTimeSpent,
  displayTimes,
  getTimeSpent,
  getFilePath
} = require("./program");

test("getTimeInSecond", () => {
  expect(getTimeInSecond([0, 1234567])).toBe(0.001234567);
  expect(getTimeInSecond([1, 1234567])).toBe(1.001234567);
});

test("displayTimeSpent", () => {
  let stdout;
  console.info = value => (stdout = value);
  displayTimeSpent("myaction", [0, 1234567]);
  expect(stdout).toBe("[myaction] 1.234567ms");
  displayTimeSpent("myaction", [0, 1234567], 2.2);
  expect(stdout).toBe("[myaction] 1.234567ms (2.2x slower)");
  displayTimeSpent("myaction", [1, 1234567], 2.2);
  expect(stdout).toBe("[myaction] 1s 1.234567ms (2.2x slower)");
  displayTimeSpent("myaction", [0, 1234567], 2.2, val => `WITH_COLOR:${val}`);
  expect(stdout).toBe("WITH_COLOR:[myaction] 1.234567ms (2.2x slower)");
});

test("displayTimes", () => {
  const stdouts = [];
  console.info = value => stdouts.push(value);
  displayTimes([{ file: "myaction", spent: [0, 1234567] }]);
  expect(stdouts).toStrictEqual(["[myaction] 1.234567ms"]);
  displayTimes([
    { file: "myaction", spent: [0, 1234567] },
    { file: "myaction2", spent: [1, 1234567] }
  ]);
  expect(stdouts).toContain(
    chalk.keyword("orange")("[myaction2] 1s 1.234567ms (811x slower)")
  );
});

test("getTimeSpent", () => {
  const hrtime = getTimeSpent(() => "A", 100);
  expect(hrtime.length).toBe(2);
  expect(hrtime[0]).toBe(0);
  expect(typeof hrtime[1]).toBe("number");
});

test("getFilePath", () => {
  expect(getFilePath("file.js")).toBe(process.cwd() + "/file.js");
});
