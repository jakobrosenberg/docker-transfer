const { execSync } = require('child_process');
const execa = require('execa');
const { resolve } = require('path');

const log = console.log.bind(console, '[docker-transfer]');

const [red, green, yellow] = [31, 32, 33].map((id) => (str) => `\x1b[${id}m${str}\x1b[0m`);

const gzip = (() => {
    try {
        execSync('gzip', { stdio: 'ignore' });
        return 'gzip';
    } catch (err) {
        return resolve(__dirname, 'bin', 'gzip.exe');
    }
})();

/**
 * @param {string} cmd
 * @param {import('child_process').SpawnOptions=} opts
 */
const spawner = (cmd, opts) => {
    const [_cmd, ...args] = cmd.split(/ +/g);
    log(yellow(_cmd), args.join(' '));
    return execa(_cmd, args, { stdio: 'inherit', ...opts });
};

const verifyConnection = async (host) => {
    try {
        await spawner(`ssh ${host} echo hello`, { stdio: 'ignore' });
    } catch (err) {
        console.error(red(`could not connect to host: ${host}`));
        process.exit(1);
    }
};

/**
 * @param {string} dest
 * @param {string[]} images
 */
const save = (dest, images) => spawner(`docker save -o ${dest} ${images.join(' ')}`);

/**
 * @param {string} source
 * @param {string} dest
 */
const compress = (source, dest) => spawner(`${gzip} ${source}`);

/**
 * @param {string} source
 * @param {string} dest
 */
const copy = (source, dest) => spawner(`scp ${source} ${dest}`);

const load = (host, file) => spawner(`ssh ${host} docker load -i ${file}`);

const cleanRemote = (host, file) => spawner(`ssh ${host} rm ${file}`);

module.exports = { log, red, green, yellow, spawner, copy, save, load, compress, cleanRemote, verifyConnection };
