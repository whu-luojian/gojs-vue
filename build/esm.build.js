import { input, libName, externals } from './config'
import { devPlugins } from './rollup.plugin'

export default [
  {
    input: input,
    output: [
      {
        file: `lib/esm/${libName}.js`,
        format: 'esm'
      }
    ],
    plugins: devPlugins,
    external: externals
  }
]
