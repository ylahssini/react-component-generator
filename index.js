#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const inquirer = require('./lib/inquirer');
const FilesManager = require('./lib/files');

clear();
console.log(chalk.yellow(figlet.textSync('React Component Generator', { font: 'Slant' })));
console.log(chalk.italic('Created by Youssef Lahssini'), chalk.underline.blue('https://ylahssini.vercel.app/'));

const run = async () => {
    const answers = await inquirer.ask();
    const files = new FilesManager();
    await files.init(answers);
};

run();
