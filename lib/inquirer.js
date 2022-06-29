const inquirer = require('inquirer');

module.exports = {
    ask: () => {
        const questions = [
            {
                name: 'name',
                type: 'input',
                message: 'Enter your component name:',
                validate(value) {
                    if (value.length === 0) {
                        return 'Please enter your component name';
                    }

                    return true;
                },
            },
            {
                name: 'combineName',
                type: 'list',
                message: 'Which the combinaision name you want to use?',
                choices: ['PascalCase', 'camelCase'],
                default: 'PascalCase',
            },
            {
                name: 'folderFiles',
                type: 'list',
                message: 'You place the generated files in:',
                choices: ['new folder', 'current folder'],
                default: 'new folder',
            },
            {
                name: 'isConnectedWithRedux',
                type: 'confirm',
                message: 'Is this component connected to Redux?',
            },
            {
                name: 'hasValidateFunction',
                type: 'confirm',
                message: 'Are you want to implement redux-form configuration?',
            },
            {
                name: 'hasStyledComponent',
                type: 'confirm',
                message: 'Are you want to create styled component?',
            },
        ];

        return inquirer.prompt(questions);
    },
};
