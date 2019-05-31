const chalk = require("chalk");

jest.mock("fs");
jest.mock("child_process");

const {
  getTimeInSecond,
  displayTimeSpent,
  displayTimes,
  getTimeSpent,
  runEval,
  getFilePath,
  createFile
} = require("../program");

describe("replx", () => {
  const MOCK_FILE_INFO = {
    "/path/to/file1.js": 'console.log("file1 contents");'
  };

  beforeEach(() => {
    require("fs").__setMockFiles(MOCK_FILE_INFO);
    require("child_process").__resetExecutedCommands();
    process.cwd = () => "/path/to";
  });

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

  test("runEval", () => {
    let stdout;
    console.info = value => (stdout = value);
    runEval("const A='hello'", 100);
    expect(stdout).toMatch(/\[Inline code\] 0\.[0-9]{1,6}ms/);
  });

  test("getFilePath", () => {
    expect(getFilePath("file.js")).toBe("/path/to/file.js");
  });

  test("createFile with simple file", () => {
    createFile("file.js", false);
    const files = require("fs").__getMockFiles();
    expect(Object.keys(files[process.cwd()]).length).toBe(2);
    expect(files[process.cwd()][1].name).toBe("file.js");
    expect(files[process.cwd()][1].content).toBe("");
  });

  test("createFile with comparison file", () => {
    createFile("file-compare.js", true);
    const files = require("fs").__getMockFiles();
    expect(Object.keys(files[process.cwd()]).length).toBe(2);
    expect(files[process.cwd()][1].name).toBe("file-compare.js");
    expect(files[process.cwd()][1].content).not.toBe("");
    expect(files[process.cwd()][1].content).toHaveLength(89);
  });

  test("createFile with existing file", () => {
    expect(() => {
      createFile("file1.js", false);
    }).toThrow();
  });

  test("createFile should open the file", () => {
    createFile("file.js", false);
    const commands = require("child_process").__getExecutedCommands();
    expect(commands.length).toBe(1);
    expect(commands[0]).toBe("open /path/to/file.js");
  });
});
