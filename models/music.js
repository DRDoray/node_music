const db = require('./db.js')

module.exports = {
  addMusicByObj: async(sing) => {
    let sings = await db.q('insert into music (title, singer, time, filelrc, file, uid) values (?,?,?,?,?,?)', Object.values(sing))
    return sings
  },
  updateMusic: async(music) => {
    let musics = await db.q('update music set title=?, singer=?, time=?, filelrc=?, file=?, uid=? where id=?',Object.values(music))
    return musics
  }
}