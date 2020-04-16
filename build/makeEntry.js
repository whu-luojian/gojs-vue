import { libName } from './config'
const fs = require('fs-extra')
const path = require('path')

const packageJson = require('../package.json')

/**
 * 生成main入口文件 lib/index.js'
 */
const out = path.resolve(fs.realpathSync(process.cwd()), './lib/index.js')
const contents = `'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/${libName}.min.js');
} else {
  module.exports = require('./cjs/${libName}.js');
}
`

fs.writeFile(out, contents)

/**
 * 修改packagejson文件
 */
packageJson.main = 'lib/index.js'
packageJson.module = `lib/esm/${libName}.js`
packageJson.types = 'lib/types/index.d.ts'
fs.writeFile(path.resolve(fs.realpathSync(process.cwd()), './package.json'), JSON.stringify(packageJson, null, 2))
