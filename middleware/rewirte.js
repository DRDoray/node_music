module.exports = (rules) => {
  // 1.以/public开头，使用其他部分(可以用正则)
  // 2.精确：以/或者/abc 要替换成/xxx；模糊：/xxx开头， 要替换成/aaa
  return async (ctx, next) => {
    // 一个ctx对应多条规则的匹配
    for (let i = 0; i < rules.length; i++) {
      let rule = rules[i]
      // 判断是否需要正则
      if (rule.regex) {
        let result = rule.regex.exec(ctx.url)
        // result不匹配 null或者匹配
        if (result) {
          // 判断是直接赋值还是取分组的内容
          if (!rule.dist) {
            // 取分组的内容
            ctx.url = result[1]
          } else {
            ctx.url = rule.dist
          }
        }
      }
      // 字符串精确匹配的
      if (rule.src === ctx.url) {
        ctx.url = rule.dist
      }
    }

    // 处理静态资源
    // if (ctx.url.startsWith('/public')) {
    //   // 重写url
    //   ctx.url = ctx.url.replace('/public', '')
    // }
    // // 处理默认定向到首页
    // if (ctx.url === '/') {
    //   ctx.url = '/user/login'
    // }
    // // 放行
    await next()
  }
}