# Core
![status](https://img.shields.io/badge/status-under%20development-yellow)
[![tests](https://img.shields.io/github/workflow/status/Cloud-CNC/core/Tests?label=tests)](https://github.com/Cloud-CNC/core/actions)
[![tests](https://img.shields.io/github/workflow/status/Cloud-CNC/core/Docker?label=docker)](https://github.com/Cloud-CNC/core/actions)
[![issues](https://img.shields.io/github/issues/Cloud-CNC/core)](https://github.com/Cloud-CNC/core/issues)
[![last commit](https://img.shields.io/github/last-commit/Cloud-CNC/core)](https://github.com/Cloud-CNC/core/commits/master)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FCloud-CNC%2Fcore.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FCloud-CNC%2Fcore?ref=badge_shield)

## Production

View guides, documentation and more at [cloud-cnc.github.io](https://cloud-cnc.github.io)

## Development

*Note: This repository contains all files for running a core server instance. The core server is typically ran on a VPS.*

### Environment Setup
1. Setup a [Mongo](https://www.mongodb.com) database
2. Install Node Gyp (Using [these](https://github.com/nodejs/node-gyp#installation) instructions)
3. Install dependencies via running `npm i`
4. Generate an X509 certificate (`certificate.cer`) and key (`key.pem`) in the [`config`](./config) directory
7. Run `npm start` to start the API server in production

### NPM Scripts
Name | Description
--- | ---
`coverage` | Run all unit tests and generate coverage reports
`start` | Run the server in production mode
`start:development` | Run the server in development mode
`start:docker` | Run server in production mode - logs to console instead of files (Docker containers don't actually use this command but it uses the exact same environment variables as the Docker containers)
`test` | Run unit + integration tests (E2E tests are ran from the [frontend](https://github.com/cloud-cnc/frontend) repository)

## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FCloud-CNC%2Fcore.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FCloud-CNC%2Fcore?ref=badge_large)