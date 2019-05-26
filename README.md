# REPLx - A REPL CLI tool on steroids

_"Read-Eval-Print-Loop-[times]"_ allows you to run a Javascript code with node and monitor the execution time for as many executions as you want.

## Installation

You may want to install _replx_ globally to be able to use it wherever you want:

```
npm i -g @benoitzohar/replx
```

## Usage

Run an inline script:

```bash
$ replx "console.log('hello')" 3
 hello
 hello
 hello
 [Inline code] 1.312974ms
```

or load a file:

```bash
$ replx myfile.js
 oh hello
 [myfile.js] 1.3433752ms
```

You can watch for file changes and rerun replx everytime:

```bash
$ replx myfile.js --watch
```

or

```bash
$ replx myfile.js -w
```

## Notes

For now, if you use replx as an inline script, be aware that the timing includes the cost of `eval()` at each loop. This means that the _time to run_ displayed is not _exactly_ the time to run your script.  
In the same spirit, if you use a file, the cached cost of `require()` will be included.

However, using `replx` to compare the time-to-run of two different scripts will work as expected since the `require` cost will be the same in all the variants.
