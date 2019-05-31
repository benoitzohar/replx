# REPLx - A REPL CLI tool on steroids 

[![npm version](https://img.shields.io/npm/v/@benoitzohar/replx.svg)](https://www.npmjs.com/package/@benoitzohar/replx)
[![Build Status](https://travis-ci.org/benoitzohar/replx.svg?branch=master)](https://travis-ci.org/benoitzohar/replx)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/25ca409490cd4caeb25a80fb85cab28f)](https://www.codacy.com/app/benoit.zohar/replx?utm_source=github.com&utm_medium=referral&utm_content=benoitzohar/replx&utm_campaign=Badge_Coverage)

_"Read-Eval-Print-Loop-**times**"_ allows you to run a Javascript code with node and monitor the execution time for as many executions as you want.

## Installation

You may want to install _replx_ globally to be able to use it wherever you want:

```bash
npm i -g @benoitzohar/replx
```

## Usage

`replx [options] <source> [times]`

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
$ replx --watch myfile.js
```

or

```bash
$ replx -w myfile.js
```

### Comparison

To compare multiple functions, you can create a file that **exports** as many function as you'd like and `replx` will compare the time for you. For example:

```js
const base = "Lorem ipsum dolor sit amet, mea dolor placerat consectetuer ut";

module.exports.A = () => {
  const res = [];
  base.split().forEach(c => res.push(c.toUpperCase()));
  return res;
};

module.exports.B = () => {
  const res = base.split().map(c => c.toUpperCase());
  return res;
};
```

### Run multiple times

Of course, one run is not enough to determine which function is faster, so you can easily tell `replx` to run you code multiple time.
For example, here we will run the code for each functions in the file 1000000 times:

```bash
$ replx myfile.js 1000000
```

Note that the returned value of each function will **not** be logged if you run the code multiple times.

### Create

You can create an empty file automatically if it doesn't exist:

```bash
$ replx --create myfile.js
```

or

```bash
$ replx -c myfile.js
```

Since the file will be empty by default, we suggest that you use `-c` along with `-w` so you can use `replx -c -w myfile.js` and start measuring right away.

If you want to make a comparison, you can create a file with 2 exported functions:

```bash
$ replx --comparison myfile.js
```

or

```bash
$ replx -k myfile.js
```

## Example


```bash
$ replx -k -w myfile.js 1000
[B] 0.08004ms
[A] 0.098599ms (1x slower)
---
[A] 0.086088ms
[B] 0.166884ms (2x slower)
```

This command will:

- create the file `myfile.js` with 2 exports functions:

```js
module.exports.A = () => {
  return "A";
};

module.exports.B = () => {
  return "B";
};
```

- open it in your default IDE (based on the file extension)
- run the code 1000 times for each function
- compare the time between the two functions
- watch for file change and re-run, etc.

## Help

Use `replx` or `replx -h` for help.

## Notes

For now, if you use replx as an inline script, be aware that the timing includes the cost of `eval()` at each loop. This means that the _time to run_ displayed is not _exactly_ the time to run your script.  
In the same spirit, if you use a file, the cached cost of `require()` will be included.

However, using `replx` to compare the time-to-run of two different scripts will work as expected since the `require` cost will be the same in all the variants.

The run time can vary greatly between runs, we suggest that you run `replx` more than once to ensure the results are aligned.
