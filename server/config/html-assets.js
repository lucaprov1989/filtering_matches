import fs from 'fs';
import { join as pathJoin } from 'path';
import { promisify } from 'util';


const fs_readFile = promisify(fs.readFile);
const fs_stat = promisify(fs.stat);
const filePath = pathJoin(__dirname, '..', '../public', 'dist', 'manifest.json');

/** Assets cache, enabled only in production */
let ASSETS_CACHE = null;

/**
 * Wait for compilation of the manifest.json file
 *
 * @return {Promise}
 */
async function waitForManifest() {
    let stats;
    try {
        stats = await fs_stat(filePath);

    } catch (err) {
        console.log(err);
        if (err.code !== 'ENOENT') throw err;
        await new Promise(resolve => setTimeout(resolve, 500));
        await waitForManifest();
    }

    return stats;
}

/**
 * Push the asset to the correct list
 *
 * @param {Object<ExpressResponse>} res
 * @param {String} asset
 */
function pushAsset(res, asset) {
    if (asset.endsWith('js')) {
        res.locals.htmlAssetsJS.push(`/dist${asset}`);
    }

    if (asset.endsWith('css')) {
        res.locals.htmlAssetsCSS.push(`/dist${asset}`);
    }
}

export default async (req, res, next) => {
    // Wait for the manifest file
    await waitForManifest();
    // Import the manifest.json file with all the compiled assets URLs
    let manifestFile;
    try {
        const contents = await fs_readFile(filePath);
        manifestFile = JSON.parse(contents.toString());
    } catch (err) {
        throw new Error(err);
    }

    // Get the vendor/app assets
    res.locals.htmlAssetsJS = [];
    res.locals.htmlAssetsCSS = [];

    const assets = Object.entries(manifestFile);

    assets.forEach(([asset, actualPath]) => {
        if (asset.startsWith('vendor')) pushAsset(res, actualPath);
    });

    assets.forEach(([asset, actualPath]) => {
        if (asset.startsWith('app')) pushAsset(res, actualPath);
    });

    // Cache the assets, when in production
    if (process.env.NODE_ENV === 'production') {
        ASSETS_CACHE = {
            js: res.locals.htmlAssetsJS,
            css: res.locals.htmlAssetsCSS,
        };
    }

    next();
};
