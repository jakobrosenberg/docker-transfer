const { removeSync, ensureDirSync, existsSync } = require('fs-extra');
const { log, green, save, compress, copy, load, cleanRemote, verifyConnection } = require('./utils');

const defaults = { tempDir: `${require('os').tmpdir()}/docker-transfer` }


/**
 * @param {Options} options
 */
const dockerTransfer = async (options) => {
    const { tempDir, images, host, preserveTemp, preserveRemoteTemp } = { ...defaults, ...options };
    const outputFile = `${tempDir}/images.tar`;
    const compressedFile = `${outputFile}.gz`;
    const hostFile = '~/images.tar.gz';

    await verifyConnection(host);

    try {
        if (!preserveTemp) {
            log('remove if exists:', green(tempDir));
            removeSync(tempDir);
        }

        ensureDirSync(tempDir);

        if (!preserveTemp && !existsSync(outputFile)) {
            log('save images to disk');
            await save(outputFile, images);
        }

        if (!preserveTemp && !existsSync(compressedFile)) {
            log('compress images');
            await compress(outputFile, compressedFile);
        }

        log('copy images to host');

        await copy(compressedFile, `${host}:${hostFile}`);

        await load(host, hostFile);
    } finally {
        if (!preserveTemp) removeSync(tempDir);
        if (!preserveRemoteTemp) cleanRemote(host, hostFile);
    }
};

module.exports = { dockerTransfer };
