module.exports = async(ctx, next) => {
  // 判断是否以/user开头，即没有权限时登录注册都可以访问，不能访问其他页面
  if (ctx.url.startsWith('/user')) {
    await next()
    return
  }
  // 这里即为需要验证
  if (!ctx.session.user) {
    // url重写
    // ctx.url = '/user/login'
    ctx.body = `<div>未登录，请前去<a href='/user/login'>登录</a></div>`
    return
  }
  await next()
}