import { litCssPlugin } from 'esbuild-plugin-lit-css';
import esbuild from 'esbuild'
import aliasPlugin from 'esbuild-plugin-alias'

import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { rollup } from 'rollup';

import { run } from '../test.js';
import ab2str from 'arraybuffer-to-string';

const dir = dirname(fileURLToPath(import.meta.url));

async function getCode(path, { options, alias } = {}) {
  const additionalPlugins = [...alias ? [
    aliasPlugin(Object.fromEntries(Object.entries(alias).map(([k, v]) => [k, resolve(dir, '..', 'fixtures', 'bare', v)])))
  ] : []]
  const input = resolve(dir, '..', 'fixtures', path);
  const bundle = await esbuild.build({
    entryPoints: [input],
    target: 'es2020',
    format: 'esm',
    external: ['snoot', 'lit', '@microsoft/fast-element'],
    bundle: true,
    write: false,
    plugins: [
      litCssPlugin(options),
      ...additionalPlugins
    ]
  });

  return ab2str(bundle.outputFiles[0].contents);
}

run({ name: 'esbuild-plugin-lit-css', getCode, dir })
