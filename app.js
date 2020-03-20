const Koa  = require('koa')

// 引入两个router
const userRouter = require('./routers/user')
const musicRouter = require('./routers/music')
// const bodyParser = require('koa-bodyparser') // 替换成koa-formidable，既可以处理字符串又可以处理文件
const forMidable = require('koa-formidable')
let { appPort, viewDir, staticDir, uploadDir } = require('./config')
const session = require('koa-session')
const errorInfo = require('./middleware/error')
const rewirteUrl = require('./middleware/rewirte')

// 创建服务器
let app = new Koa()

// 模板渲染
const render = require('koa-art-template')
render(app, {
  // 开发的配置：debug:true ，为true则不压缩混淆/实时读取文件（静态内容及时得到更新）
  debug: process.env.NODE_ENV !== 'production',
  extname: '.html',
  root: viewDir
})

// 优雅的处理异常
app.use(errorInfo())

// 为static重写url
app.use(rewirteUrl(require('./rewirteConfig')))

// 处理静态资源
app.use(require('koa-static')(staticDir))

let store = {
  storage: {},
  set(key, seesion) { // 存session
    this.storage[key] = seesion
  },
  get(key) { // 取session
    return this.storage[key]
  },
  destroy(key) { // session过期  删除session
    delete this.storage[key]
  },
}
app.keys = ['test'] // 基于test字符串进行签名的运算，目的是保证数据不被串改
// 处理session
app.use(session({ store: store }, app))

// 处理请求体数据，通过ctx.resquest.body获取
// app.use(bodyParser())
// 处理文件及字符串
app.use(forMidable({
  // 设置上传目录
  uploadDir: uploadDir,
  // 默认根据文件算法生成hash字符串（文件名），但是没有后缀
  keepExtensions: true
}))

app.use(userRouter.routes())
app.use(musicRouter.routes())

// 处理405 方法不匹配，和501 方法未找到
app.use(userRouter.allowedMethods())

// 开启服务器
app.listen(appPort, () => {
  console.log(`服务器启动在${appPort}端口`)
})