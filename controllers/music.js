const musicModel = require('../models/music')
const path = require('path')
// 没有获取id
function optUpload(ctx) {
  // 接收请求数据
  // ctx.request.files
  // 1.获取字符串数据
  let { title, singer, time } = ctx.request.body
  // 2.获取文件->保存文件的网络路径，更方便/public请求返回（保存文件的绝对路径也可以，但是很麻烦），歌词可选
  let { file, filelrc } = ctx.request.files
  // 歌词有值，就存起来
  let saveSingObj = {
    title,
    singer,
    time
  }
  // 因为歌词不是必填项，为了插入数据库不报错，这里故意处理成“没有歌词”
  saveSingObj.filelrc = 'no filelrc'
  // 处理歌词路径
  if (filelrc) {
    // path.parse解析文件路径  取的base是文件名+后缀
    saveSingObj.filelrc = '/public/files' + path.parse(filelrc.path).base
  }
  if (!file) {
    ctx.throw('歌曲必须上传')
    return
  }
  // 处理歌曲路径
  saveSingObj.file = '/public/files' + path.parse(file.path).base
  // 加入用户id,未来用session
  saveSingObj.uid = 1
  return saveSingObj
}

module.exports = {
  // addMusic: async(ctx, next) => {}
  // 添加音乐
  async addMusic(ctx, next) {
    let saveSingObj = optUpload(ctx)
    // 3.插入数据到数据库
    let result = await musicModel.addMusicByObj(saveSingObj)
    // 4.响应结果给用户
    ctx.body = { 
      code: '001',
      msg: result.message // ajax接收到的状态消息
    }
  },
  async updateMusic(ctx, next) {
    let saveSingObj = optUpload(ctx)
    let { id } = ctx.request.body
    Object.assign(saveSingObj, { id }) // 将id合并到saveSingObj
    // 更新数据
    let result = await musicModel.updateMusic(saveSingObj)
    if (result.affectedRows !== 1) { // 没有更新成功（throw是针对页面的操作,ajax请求，可以响应对应的code）
      // ctx.throw('更新失败')
      ctx.body = { code: '002', msg: result.message}
      return
    }
    ctx.body = { code: '001', msg: '更新成功'}
  }
}