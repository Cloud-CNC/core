# Core
![status](https://img.shields.io/badge/status-under%20development-yellow)
[![tests](https://img.shields.io/github/workflow/status/Cloud-CNC/core/Tests)](https://github.com/Cloud-CNC/core/actions)
[![issues](https://img.shields.io/github/issues/Cloud-CNC/core)](https://github.com/Cloud-CNC/core/issues)
[![last commit](https://img.shields.io/github/last-commit/Cloud-CNC/core)](https://github.com/Cloud-CNC/core/commits/master)

## Production

View guides, documentation and more at [cloud-cnc.github.io](https://cloud-cnc.github.io)

## Development

*Note: This repository contains all files for running a core server instance. The core server is typically ran on a VPS.*

### Environment Setup
1. Setup a [Mongo](https://www.mongodb.com) database
2. Install Node Gyp (Using [these](https://github.com/nodejs/node-gyp#installation) instructions)
3. Install dependencies via running `npm i`
4. Run `npm run config` to generate some salt, a certificate, and a valid config file
7. Run `npm start` to start the web server

### Recommended IDE Extensions
Name | VS Code | Atom
--- | --- | ---
ESLint | [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) | [ESLint](https://atom.io/packages/eslint)
Spell Checker | [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) (Enable cSpell.allowCompoundWords) | [Spell Check](https://atom.io/packages/spell-check)
Mark code for review, take notes, add todo items, etc. | [Comment Anchors](https://marketplace.visualstudio.com/items?itemName=ExodiusStudios.comment-anchors) | [language-todo-extra-words](https://atom.io/packages/language-todo-extra-words)
Colorize pairs of brackets | [Bracket Colorizer 2](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer-2) | [Bracket Colorizer](https://atom.io/packages/bracket-colorizer)
Help with writing documentation | [GitHub Markdown Preview](https://marketplace.visualstudio.com/items?itemName=bierner.github-markdown-preview) | [Markdown Preview](https://atom.io/packages/markdown-preview)

### NPM Scripts
Name | Description
--- | ---
`config` | Generate some salt, a certificate, and a valid config file
`coverage` | Generate test coverage using Istanbul
`start` | Run server in production mode (PWA and file logging)
`start:development` | Run server in development mode (No PWA)
`start:docker` | Run server in production mode with console logging
`test` | Run all tests