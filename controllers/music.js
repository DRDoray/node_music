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
  },
  deleteMusic: async(ctx, next) => {
    // 请求url中的查询字符获取id
    let id = ctx.request.query.id // 也可以用ctx.query.id
    // 通过id删除音乐
    let result = await musicModel.deleteMusicById(id)
    if (result.affectedRows === 0) {
      ctx.throw('删除失败：'+result.message)
    }
    // 响应请求
    ctx.body = { code: '001', msg: '删除成功'}
  },
  // 编辑音乐显示页面
  async showEdit(ctx, next) {
    let id = ctx.query.id
    // 通过id查询音乐
    let musics = await musicModel.findMusicById(id)
    // 判断是否有该歌曲
    if (musics.length === 0) {
      ctx.throw('歌曲不存在')
      return
    }
    let music = musics[0]
    // 渲染edit页面
    ctx.render('edit', {
      music: music
    })
  },
  async showIndex(ctx, next) {
    // 根据用户的session中的id来查询数据(目前先写成假的)
    // let uid = 1
    let uid = ctx.session.user.id
    // 根据id查询歌曲
    let musics = await musicModel.findMusicByUid(uid)
    ctx.render('index', {
      musics: musics
    })
  }
}