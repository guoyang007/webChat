'use strict';
const koa = require('koa');
const logger = require('koa-logger');
const serve = require('koa-static');
const render = require('koa-ejs');
const IO = require('koa-socket');

const historyFallback = require('koa2-history-api-fallback')
const router = require('./routes.js');
const path = require('path');
const app = module.exports = new koa();
const io = new IO();

// router to front-end
app.use(historyFallback())
// Logger
app.use(logger());


if (process.env.NODE_ENV!=='production') {
	const middleware = require('koa-webpack');
	const Webpack=require('webpack')
	const config = require('./cfg/webpack.dev.js');

	let compiler=Webpack(config)
	app.use(middleware({
		compiler:compiler
	}))
}

render(app, {
    root: process.env.NODE_ENV==='production'? path.join(__dirname, './public') :path.join(__dirname, './src'),
    extname: '.html'
});

app.use(serve(path.join(__dirname, 'public'),{
	maxage:100 * 24 * 60 * 60
}));

app.use(router.routes());
app.use(router.allowedMethods());

io.attach(app);
app.io.on('connection',(ctx,data) => {
	console.log('a user connected');
	console.log('num',app.io.socket.engine.clientsCount)
	app.io.broadcast('join',{
		id:data,
		connectionNum:app.io.socket.engine.clientsCount
	})
})
app.io.on('disconnect',(ctx)=>{
	console.log('ctx',ctx)
	console.log('leave',ctx.socket.id)
	console.log('data',io.connections);
	app.io.broadcast('leave',{
		id: ctx.socket.id,
		connectionNum: app.io.socket.engine.clientsCount
	})
})
app.io.on('ChatMessage',(ctx,data)=>{
	console.log('ChatMessage',data)
	app.io.broadcast('ChatMessage',{
		msg:data
	})
})

if (!module.parent) {
    app.listen(3000);
    console.log('listening on port 3000');
}
