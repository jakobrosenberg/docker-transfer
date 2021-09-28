#!/usr/bin/env node

const { tmpdir } = require('os');
const { program } = require('commander');
const { dockerTransfer } = require('.');

const splitByComma = (x) => x.split(',');

program
    .argument('<host>', 'destination')
    .argument('<images>', 'comma separated list', splitByComma)
    .description('Copy local docker images to remote host')
    .option('-t --temp-dir <dir>', 'path for storing temporary files locally', `${tmpdir()}/docker-transfer`)
    .option('-p --preserve-temp', 'don\'t delete or overwrite existing temporary files')
    .option('-r --preserve-remote-temp', 'don\'t delete temporary files on remote')
    .action(async (host, images, options) => {
        const allOptions = { host, images, ...options };
        dockerTransfer(allOptions);
    });

program.parse();
