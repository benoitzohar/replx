// @ts-check

const commander = require("commander");

const npmPackage = require("../package.json");
const { run, createFile } = require("./program");

commander
  .version(npmPackage.version)
  .arguments("<source> [times]")
  .option("-w, --watch", "Watch file for change")
  .option("-c, --create", "Create an empty file and open it")
  .option(
    "-k, --comparison",
    "Create a new file with 2 exported functions. Use it to compare speed."
  )
  .action(function(source, times, cmd) {
    if (cmd.create || cmd.comparison) {
      createFile(source, cmd.comparison);
    }
    const loops = parseInt(times, 10) || 1;
    run(source, loops, cmd.watch);
  })
  .parse(process.argv);

if (commander.args.length === 0) {
  commander.help();
}
