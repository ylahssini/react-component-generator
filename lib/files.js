const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const handlebars = require('handlebars');
const waterfall = require('async').waterfall;

class FilesManager {
    dist() {
        const dist = process.argv.slice(2);

        if (dist.length === 1) {
            return `./${dist[0]}/`;
        }

        return './';
    }

    getCurrentDirectoryBase() {
        return path.basename(process.cwd());
    }

    directoryExists(filePath) {
        try {
            return fs.statSync(filePath).isDirectory();
        } catch (err) {
            return false;
        }
    }

    combineName(name, combineName) {
        let finalName = name.toLowerCase().trim();

        if (combineName === 'PascalCase') {
            finalName = finalName.replace(/\w+/g, w => (w[0].toUpperCase() + w.slice(1).toLowerCase()));
        } else if (combineName === 'camelCase') {
            finalName = finalName.replace(/\w+/g, w => (w[0] + w.slice(1).toLowerCase()));
        }

        finalName = finalName.replace(/ /g, '');

        return finalName;
    }

    creation({ filename, hbs, params }, callback) {
        const folder = params.folderFiles === 'new folder' ? `${params.name}/` : '';

        const view = fs.readFileSync(`${__dirname}/templates/${hbs}.hbs`).toString('utf-8');
        const compile = handlebars.compile(view);
        const template = compile(params);

        fs.writeFile(`${this.dist()}${folder}${filename}`, template, (err) => {
            if (err) {
                console.log(err);
            } else {
                callback();
            }
        });
    }

    init({
        name,
        combineName,
        folderFiles,
        isConnectedWithRedux,
        hasValidateFunction,
        hasStyledComponent,
    }) {
        const finalName = this.combineName(name, combineName);

        if (!this.directoryExists(`${this.dist()}${finalName}`)) {
            fs.mkdirSync(`${this.dist()}${finalName}`);
        }

        waterfall([
            (callback) => {
                this.creation({
                    filename: 'index.js',
                    hbs: 'index',
                    params: {
                        name: finalName,
                        isConnectedWithRedux,
                        folderFiles,
                    },
                }, () => {
                    console.log(chalk`{bold.green index.js} is created`);
                    callback(null, 'ok');
                });
            },

            (_, callback) => {
                this.creation({
                    filename: `${finalName}.jsx`,
                    hbs: 'jsx',
                    params: {
                        name: finalName,
                        hasStyledComponent,
                        hasValidateFunction,
                        folderFiles,
                    },
                }, () => {
                    console.log(chalk`{bold.green ${finalName}.jsx} is created`);
                    callback(null, 'ok');
                });
            },

            (_, callback) => {
                if (hasStyledComponent) {
                    this.creation({
                        filename: `${finalName}.styled.js`,
                        hbs: 'styled',
                        params: {
                            name: finalName,
                            hasStyledComponent,
                            folderFiles,
                        },
                    }, () => {
                        console.log(chalk`{bold.green ${finalName}.styled.js} is created`);
                        callback(null, 'ok');
                    });
                } else {
                    callback(null, 'ok');
                }
            },

            (_, callback) => {
                if (hasValidateFunction) {
                    this.creation({
                        filename: `${finalName}.validate.js`,
                        hbs: 'validate',
                        params: {
                            name: finalName,
                            hasStyledComponent,
                            folderFiles,
                        },
                    }, () => {
                        console.log(chalk`{bold.green ${finalName}.validate.js} is created`);
                        callback(null, 'ok');
                    });
                } else {
                    callback(null, 'ok');
                }
            },
        ], () => {
            console.log(chalk.green('All files are created \u{1F44C}'));
        });
    }
}

module.exports = FilesManager;
