
# generator-seng-module

A [Yeoman](http://yeoman.io/) generator for the [seng-boilerplate](https://github.com/mediamonks/seng-boilerplate).
It clones the repository and replaces all occurrences of the boilerplate
name, author name, email and github, and npm keywords based on the
provided input.


## Installation

First, you need to have [Yeoman](https://www.npmjs.com/package/yo)
installed globally:

```sh
npm i -g yo
```

Then, install this generator globally:

```sh
npm i -g generator-seng-module
```

For more information about using generators, check the [generator guide](http://yeoman.io/learning/index.html)
on the Yeoman website.

## Usage

The generator should be run in an empty directory in which you would
like to start the new module.

```sh
mkdir seng-foobar
cd seng-foobar
yo seng-module
```

When running, the generator asks the following questions:

```
What is your module name (e.g. seng-config)?
```

The value provided here will replace `seng-boilerplate` in all files
present in the boilerplate checkout. It should be the name or the Github
repository and your npm module.

```
Provide keywords for in your package.json (e.g. configuration):
```

The value provided here will be added to the `package.json`. The values
`mediamonks` and `seng` will be added automatically. You can add multiple
values by seperating them by a comma.

```
What is your name?
What is your email address?
What is your Github username?
```

The values provided here will be added to the `package.json` author
field and the `AUTHORS.md`. The generator will store these values for
future use.


## Changelog

View [CHANGELOG.md](./CHANGELOG.md)


## Authors

View [AUTHORS.md](./AUTHORS.md)


## LICENSE

[MIT](./LICENSE) © MediaMonks


