const Router = require('koa-router')
let musicRouter = new Router();
const musicController = require('../controllers/music')

musicRouter
.post('/music/add-music', musicController.addMusic)
.put('/music/update-music', musicController.updateMusic)
.delete('/music/delete-music', musicController.deleteMusic)
.get('/music/edit-music', musicController.showEdit)
.get('/music/index', musicController.showIndex)
.get('/music/add', async ctx => {
  ctx.render('add')
})


module.exports = musicRouter