const db = require('./db.js')

// 写sql语句
module.exports = {
  getUsers: async () => {
    let users = await db.q('select * from user', [])
    return users
  },
  findUserByUsername: async (username) => {
    let usernames = await db.q('select * from user where username=?', username)
    return usernames
  },
  // 插入数据
  registerUser: async (...user) => {
    let users = await db.q('insert into user (username, password, email) values (?,?,?)',user)
    return users
  }
}