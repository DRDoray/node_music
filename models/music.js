const db = require('./db.js')

module.exports = {
  // 添加音乐
  addMusicByObj: async(sing) => {
    let sings = await db.q('insert into music (title, singer, time, filelrc, file, uid) values (?,?,?,?,?,?)', Object.values(sing))
    return sings
  },
  // 编辑音乐
  updateMusic: async(music) => {
    let musics = await db.q('update music set title=?, singer=?, time=?, filelrc=?, file=?, uid=? where id=?',Object.values(music))
    return musics
  },
  // 删除音乐
  deleteMusicById: async(id) => {
    let musics = await db.q('delete from music where id = ?',[id])
    return musics
  },
  // 查询音乐
  findMusicById: async(id) => {
    let musics = await db.q('select * from music where id = ?', [id])
    return musics
  },
  // 首页查询显示音乐
  findMusicByUid: async(uid) => {
    let musics = await db.q('select * from music where uid = ?', [uid])
    return musics
  }
}