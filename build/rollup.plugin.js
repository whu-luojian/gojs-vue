import vue from 'rollup-plugin-vue'
import commonjs from 'rollup-plugin-commonjs' // 将commonjs模块转换为ES6
import typescript from 'rollup-plugin-typescript2'
import resolve from '@rollup/plugin-node-resolve' // 让rollup支持nodejs的模块解析机制
import banner from 'rollup-plugin-banner'
import { terser } from 'rollup-plugin-terser'
import { name, version, author } from '../package.json'

const copyright = `${name}\nv${version}\nby ${author}`

const basePlugins = [
  typescript({
    typescript: require('typescript'),
    useTsconfigDeclarationDir: true
  }),
  resolve(),
  commonjs(),
  vue({
    css: true,
    compileTemplate: true
  })
]

export const devPlugins = [
  ...basePlugins,
  banner(copyright)
]
export const prodPlugins = [
  ...basePlugins,
  terser({ output: { comments: false } }),
  banner(copyright)
]
