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
  }
}