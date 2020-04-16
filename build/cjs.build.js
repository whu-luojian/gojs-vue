import { input, libName, externals } from './config'
import { devPlugins, prodPlugins } from './rollup.plugin'

export default [
  {
    input: input,
    output: [
      {
        file: `lib/cjs/${libName}.js`,
        format: 'cjs'
      }
    ],
    plugins: devPlugins,
    external: externals
  },
  {
    input: input,
    output: [
      {
        file: `lib/cjs/${libName}.min.js`,
        format: 'cjs'
      }
    ],
    plugins: prodPlugins,
    external: externals
  }
]
