#!/usr/bin/env node

// index.js
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');

const startServer = require('./server');
const startClient = require('./client');

yargs(hideBin(process.argv))
  .command(
    'start',
    'Start the broadcast server',
    (y) =>
      y.option('port', {
        alias: 'p',
        type: 'number',
        default: 8080,
        describe: 'Port to run the server on',
      }),
    (argv) => {
      startServer(argv.port);
    }
  )
  .command(
    'connect',
    'Connect to the broadcast server as a client',
    (y) =>
      y
        .option('host', {
          alias: 'h',
          type: 'string',
          default: 'localhost',
          describe: 'Server host',
        })
        .option('port', {
          alias: 'p',
          type: 'number',
          default: 8080,
          describe: 'Server port',
        }),
    (argv) => {
      startClient(argv.host, argv.port);
    }
  )
  .demandCommand(1, 'You need to specify a command: start or connect')
  .help()
  .strict()
  .parse();