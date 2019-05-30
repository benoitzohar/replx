const { getFilePath } = require("./program");

test("getFilePath", () => {
  expect(getFilePath("file.js")).toBe(process.cwd() + "/file.js");
});
