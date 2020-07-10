# Core
![status](https://img.shields.io/badge/status-under%20development-yellow)
[![tests](https://img.shields.io/github/workflow/status/Cloud-CNC/core/tests)](https://github.com/Cloud-CNC/core/actions)
[![issues](https://img.shields.io/github/issues/Cloud-CNC/core)](https://github.com/Cloud-CNC/core/issues)
[![last commit](https://img.shields.io/github/last-commit/Cloud-CNC/core)](https://github.com/Cloud-CNC/core/commits/master)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FCloud-CNC%2Fcore.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FCloud-CNC%2Fcore?ref=badge_shield)

This repository contains all files for running a core server instance. The core server is typically ran on a VPS.

## Installation
1. Install dependencies via running `npm i`
2. Setup a [Mongo](https://www.mongodb.com) database (Either on the same server of a different one)
3. Install Node Gyp (Using [these](https://github.com/nodejs/node-gyp#installation) instructions)
4. Generate some salt for sessions (>512 bytes long) and place in a folder named `crypto` at the repository's root
5. Generate an SSL certificate and place in the `crypto` folder (Change the certificate and key name in the [config file](config.js))
6. Modify the [config file](config.js) to suit you needs
7. Run `npm start` to start the web server
8. If you need any additional help, feel free to ask in the Discord server 

## Development

### Recommended IDE Extensions
Name | VS Code | Atom
--- | --- | ---
ESLint | [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) | [ESLint](https://atom.io/packages/eslint)
Spell Checker | [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) (Enable cSpell.allowCompoundWords) | [Spell Check](https://atom.io/packages/spell-check)
Mark code for review, take notes, add todo items, etc. | [TODO Highlight](https://marketplace.visualstudio.com/items?itemName=wayou.vscode-todo-highlight) | [language-todo-extra-words](https://atom.io/packages/language-todo-extra-words)
Colorize pairs of brackets | [Bracket Colorizer 2](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer-2) | [Bracket Colorizer](https://atom.io/packages/bracket-colorizer)
Help with writing documentation | [GitHub Markdown Preview](https://marketplace.visualstudio.com/items?itemName=bierner.github-markdown-preview) | [Markdown Preview](https://atom.io/packages/markdown-preview)
Vue tooling | [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur) | [Vue FMT](https://atom.io/packages/vue-fmt)
Vue boilerplate | [Vue VSCode Snippets](https://marketplace.visualstudio.com/items?itemName=sdras.vue-vscode-snippets) | [Vue Snippets](https://atom.io/packages/vue-snippets)

### NPM Scripts
Name | Description
--- | ---
`start` | Run server
`test` | Run all tests

## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FCloud-CNC%2Fcore.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FCloud-CNC%2Fcore?ref=badge_large)