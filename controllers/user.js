const userModel = require('../models/user')

module.exports = {
  showRegister: async (ctx, next) => {
    let users = await userModel.getUsers()
    // ctx.render('register')
  },
  // 检查用户名是否存在
  checkUserName: async (ctx, next) => {
    // 处理接受请求的繁琐事务，唯独不crdu
    let { username } = ctx.request.body
    // 查询数据库中是否存在该用户名
    let users = await userModel.findUserByUsername(username)
    // 判断users数组的长度是否为0
    if (users.length === 0) {
      ctx.body = { code: '001', msg: '可以注册'}
      return
    }
    // 否则就存在该用户
    ctx.body = { code: '002', msg: '该用户名已经存在'}
  },
  // 注册
  doRegister: async (ctx, next) => {
    let { username, password, email } = ctx.request.body
    let users = await userModel.findUserByUsername(username)
    // 判断是否存在用户名
    if (users.length !== 0) {
      ctx.body = { code: '002', msg: '该用户名已经存在'}
      return
    }
    // 开始注册(可以做异常捕获)
    try {
      let result = await userModel.registerUser(username, password, email)
      // 判断是否插入成功， 再给与提示
      if (result.affectedRows === 1) {
        ctx.body = { code: '001', msg: '注册成功'}
        return
      }
      // 不等于1可能会发生id冲突，就不插入数据
      ctx.body = { code: '002', msg: result.message}
    }
    catch(e){
      // 判断e的一些code信息，做不同的throw
      ctx.throw('002')
    }
  },
  // 登录
  doLogin: async(ctx, next) => {
    // 1.接收对应的参数
    let { username, password } = ctx.request.body
    // 2.查询用户名相关的用户
    //   2.1：判断是否有用户，没有用户则提示用户名或者密码不正确，避免黑客等试探用户名的情况，一般模糊提示信息
    let users = await userModel.findUserByUsername(username)
    if (users.length === 0) {
      ctx.body = { code: '002', msg: '用户名或密码错误'}
      return
    }
    let user = users[0]
    // 3.对比密码是否一致
    //   3.1： 如果密码正确，认证用户session方属性区分是否登录
    //   3.2: 响应json结果
    // 密码正确
    if (user.password === password) {
      ctx.body = { code: '001', msg: '登录成功'}
      // 挂在session
      ctx.session.user = user
      return
    }
    // 密码不正确
    ctx.body = { code: '002', msg: '用户名或密码不正确'}
  }
}