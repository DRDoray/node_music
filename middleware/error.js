module.exports = () => {
  return async(ctx, next) => {
    // 先放行
    try {
      await next()
    } catch (e) {
      // 根据throw的来判断
      // 比如判断e.code==='002'
      ctx.render('error', {msg: '002状态码错误，原因是xxx'})
    }
  }
}