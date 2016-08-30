"use strict";

const generators = require("yeoman-generator");
const promise = require('es6-promise');
const promisifyAll = require('es6-promisify-all');
const fs = promisifyAll(require('fs-extra'));
const path = require('path');
const replace = require("replace");
const formatJson = require('format-json');

const spawnAsPromised = (scope, command, args) =>
{
    return new Promise((resolve, reject) =>
    {
        const ls = scope.spawnCommand(command, args);

        ls.on('close', (code) => {
            code == 0 ? resolve() : reject(code);
        });
    });
};

const gitInit = (scope) =>
{
    return spawnAsPromised(scope, "git", ["init"])
        .then(() => spawnAsPromised(scope, "git", ["remote", "add", "origin", 'git@github.com:mediamonks/seng-boilerplate.git']))
        .then(() => spawnAsPromised(scope, "git", ["pull", "origin", "master"]))
        .then(() => spawnAsPromised(scope, "git", ["remote", "remove", "origin"]))
};

const clean = (path_) =>
{
    return fs.removeAsync(path.resolve(path_));
};

const emptyDir = (path_) =>
{
    return fs.emptyDirAsync(path.resolve(path_));
};

const replaceModuleName = (moduleName) =>
{
    replace({
        regex: /seng\-boilerplate/gi,
        replacement: moduleName,
        paths: ['.'],
        recursive: true,
        silent: true,
        count: true
    });

    const camelCaseName = moduleName.charAt(0).toUpperCase() + moduleName.substr(1).replace(/-(\w)/gi, (match, letter) => letter.toUpperCase());

    replace({
        regex: /SengBoilerplate/gi,
        replacement: camelCaseName,
        paths: ['.'],
        recursive: true,
        silent: true,
        count: true
    });
};

const replaceAuthors = (authorName, authorGithub) =>
{
    replace({
        regex: /Firstname Lastname/gi,
        replacement: authorName,
        paths: ['./AUTHORS.md'],
        recursive: false,
        silent: true,
        count: true
    });

    replace({
        regex: /username/gi,
        replacement: authorGithub,
        paths: ['./AUTHORS.md'],
        recursive: false,
        silent: true,
        count: true
    });
};

const editPackage = (authorName, authorEmail, authorGithub, keywords) =>
{
    if (typeof keywords == 'string') keywords = keywords.replace(/\s/, '').split(',');

    const packagePath = path.resolve('package.json');
    fs.readFileAsync(packagePath, 'utf8')
        .then(content =>
        {
            const json = JSON.parse(content);
            json.version = "1.0.0";
            json.author = authorName + ' <' + authorEmail + '>' + ' (' + authorGithub + ')';
            json.keywords = ['seng', 'mediamonks'].concat(keywords);

            return fs.writeFileAsync(packagePath, formatJson.plain(json), 'utf8');
        });
};

const removeBoilerplateReadme = () =>
{
    const readmePath = path.resolve('README.md');

    fs.readFileAsync(readmePath, 'utf8')
        .then(content =>
        {
            content = content.slice(0, content.indexOf('## About this boilerplate'));

	        return fs.writeFileAsync(readmePath, content, 'utf8');
        });
};

const BootstrapperBase = generators.Base.extend({
    prompting: function ()
    {
        const prompts = [
            {
                type: 'input',
                name: 'moduleName',
                message: "What is your module name (e.g. seng-config)?",
                // store: true // for easy debugging
            },
            {
                type: 'input',
                name: 'keywords',
                message: "Provide keywords for in your package.json (e.g. configuration, settings):",
                // store: true // for easy debugging
            },
            {
                type: 'input',
                name: 'authorName',
                message: "What is your name?",
                store: true
            },
	        {
		        type: 'input',
		        name: 'authorEmail',
		        message: "What is your email address?",
		        store: true
	        },
            {
                type: 'input',
                name: 'authorGithub',
                message: "What is your Github username?",
                store: true
            }];

        return this.prompt(prompts)
            .then((answers) =>
            {
                this.moduleName = answers.moduleName;
                this.keywords = answers.keywords;
                this.authorName = answers.authorName;
                this.authorEmail = answers.authorEmail;
                this.authorGithub = answers.authorGithub;
            });
    },

    writing: function ()
    {
        return Promise.resolve()
        // .then(() => emptyDir('./')) // for easy debugging
            .then(() => gitInit(this))
            .then(() => clean('.git'))
            .then(() => clean('doc'))
            .then(() => clean('dist'))
            .then(() => editPackage(this.authorName, this.authorEmail, this.authorGithub, this.keywords))
            .then(() => removeBoilerplateReadme())
            .then(() =>
            {
                replaceModuleName(this.moduleName);
                replaceAuthors(this.authorName, this.authorGithub)
            })
    }
});

module.exports = BootstrapperBase;
