// 这是项目发布阶段需要用到的bable插件
// 判断是属于发布阶段还是开发阶段
const prodPlugins = []
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console')
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    ...prodPlugins, // 表示为展开运算符
    '@babel/plugin-syntax-dynamic-import'
  ]
}
