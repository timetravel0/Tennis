const { spawn, spawnSync } = require('child_process');
const http = require('http');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function runBuild() {
    const result = spawnSync(npmCommand, ['run', 'build'], {
        cwd: rootDir,
        stdio: 'inherit',
        env: process.env,
    });

    if (result.status !== 0) {
        throw new Error('Build failed');
    }
}

function waitForServerPort(child) {
    return new Promise((resolve, reject) => {
        let stdout = '';
        let stderr = '';

        const timeout = setTimeout(() => {
            child.kill('SIGKILL');
            reject(new Error(`Timed out waiting for server start. stdout=${stdout} stderr=${stderr}`));
        }, 15000);

        child.stdout.on('data', (chunk) => {
            stdout += chunk.toString();
            const match = stdout.match(/listening on \*:(\d+)/);
            if (match) {
                clearTimeout(timeout);
                resolve(Number(match[1]));
            }
        });

        child.stderr.on('data', (chunk) => {
            stderr += chunk.toString();
        });

        child.on('exit', (code) => {
            clearTimeout(timeout);
            reject(new Error(`Server exited before it was ready (code ${code}). stdout=${stdout} stderr=${stderr}`));
        });
    });
}

function requestStatus(port, pathname) {
    return new Promise((resolve, reject) => {
        const req = http.get(
            {
                hostname: '127.0.0.1',
                port,
                path: pathname,
            },
            (res) => {
                res.resume();
                resolve(res.statusCode || 0);
            }
        );

        req.on('error', reject);
        req.setTimeout(2000, () => req.destroy(new Error(`Timeout requesting ${pathname}`)));
    });
}

async function main() {
    runBuild();

    const server = spawn(process.execPath, ['server.js'], {
        cwd: rootDir,
        env: {
            ...process.env,
            PORT: '0',
        },
        stdio: ['ignore', 'pipe', 'pipe'],
    });

    let port;
    try {
        port = await waitForServerPort(server);

        let ready = false;
        for (let attempt = 0; attempt < 30; attempt += 1) {
            try {
                const status = await requestStatus(port, '/');
                if (status === 200) {
                    ready = true;
                    break;
                }
            } catch (error) {
                // Retry until the server is listening.
            }
            await sleep(250);
        }

        if (!ready) {
            throw new Error('Server did not respond with HTTP 200 on /');
        }

        const bundleStatus = await requestStatus(port, '/bundle.js');
        if (bundleStatus !== 200) {
            throw new Error(`Expected bundle.js to be served, got HTTP ${bundleStatus}`);
        }
    } finally {
        if (!server.killed) {
            server.kill('SIGTERM');
            await new Promise((resolve) => {
                const timer = setTimeout(() => {
                    if (!server.killed) {
                        server.kill('SIGKILL');
                    }
                    resolve();
                }, 3000);

                server.on('exit', () => {
                    clearTimeout(timer);
                    resolve();
                });
            });
        }
    }
}

main().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
