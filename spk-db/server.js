'use strict'

import express from 'express'
import bodyParser from 'body-parser'
import socket from 'socket.io'
import path from 'path'
import { client } from './lib/redis'

const PORT = 3000

const app = express()

// view engine setup
app.set('view engine', 'ejs')
app.use(express.static('./public'))
app.options('/*', (req, res) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
	res.header(
		'Access-Control-Allow-Headers',
		'Content-Type, Authorization, Content-Length, X-Requested-With'
	)
	res.sendStatus(200)
})
app.use(bodyParser.json())
app.use('/img', express.static(path.join(__dirname, 'public/uploads')))

// Middleware to parse request body
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
)

client().then(
	(res) => {
		// subscribe to Pub/Sub channels
		res.subscribe('chatMessages')
		res.subscribe('activeUsers')

		// App routes
		app.use('/api', require('./routes/api'))
		//Start the server
		const server = app.listen(PORT, () => {
			console.log('Server Started')
		})

		const io = socket.listen(server)

		//listen and emit messages and user events (leave or join) using socket.io
		io.on('connection', (socket) => {
			console.log(socket.id)
			res.on('message', (channel, message) => {
				if (channel === 'chatMessages') {
					console.log('Socket: message', message)
					socket.emit('message', JSON.parse(message))
				} else {
					console.log('Socket: users', message)
					socket.emit('users', JSON.parse(message))
				}
			})
		})
	},
	(err) => {
		console.log('Redis connection failed: ', err)
	}
)
