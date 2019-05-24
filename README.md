# REPLx - A REPL CLI tool on steroids

*"Read-Eval-Print-Loop-[times]"* allows you to run a Javascript code with node and monitor the execution time for as executions as you want.

## Installation

You may want to install *replx* globally to be able to use it wherever you want:

```
npm i -g @benoitzohar/replx
```

## Examples

Run an inline script:

```bash
$ replx "console.log('hello')" 3
 > hello
 > hello
 > hello
```

or load a file:

```bash
$ replx myfile.js
 > oh hello
```
