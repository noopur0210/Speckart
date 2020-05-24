'use strict'

import { client } from '../lib/redis'

export let fetchMessages = () => {
	return new Promise((resolve, reject) => {
		client().then(
			(res) => {
				res.lrangeAsync('messages', 0, -1).then(
					(messages) => {
						console.log('messages', messages)
						resolve(messages)
					},
					(err) => {
						reject(err)
					}
				)
			},
			(err) => {
				reject('Redis connection failed: ' + err)
			}
		)
	})
}
export let addMessage = (message) => {
	return new Promise((resolve, reject) => {
		client().then(
			(res) => {
				res
					.multi()
					.rpush('messages', message)
					.execAsync()
					.then(
						(res) => {
							resolve(res)
						},
						(err) => {
							reject(err)
						}
					)
			},
			(err) => {
				reject('Redis connection failed: ' + err)
			}
		)
	})
}

export let fetchActiveUsers = () => {
	return new Promise((resolve, reject) => {
		client().then(
			(res) => {
				res.smembersAsync('users').then(
					(users) => {
						console.log('Users ', users)
						resolve(users)
					},
					(err) => {
						reject(err)
					}
				)
			},
			(err) => {
				reject('Redis connection failed: ' + err)
			}
		)
	})
}

export let addActiveUser = (user) => {
	return new Promise((resolve, reject) => {
		client().then(
			(res) => {
				res
					.multi()
					.sadd('users', user)
					.execAsync()
					.then(
						(res) => {
							if (res[0] === 1) {
								resolve('User added')
							}

							reject('User already in list')
						},
						(err) => {
							reject(err)
						}
					)
			},
			(err) => {
				reject('Redis connection failed: ' + err)
			}
		)
	})
}

export let removeActiveUser = (user) => {
	return new Promise(async (resolve, reject) => {
		// const res = client()
		// const resp = res.multi().srem('users', user)
		// console.log('Log: removeActiveUser -> resp', resp)
		client().then(
			(res) => {
				res
					.multi()
					.srem('users', user)
					.execAsync()
					.then(
						(res) => {
							console.log('Log: removeActiveUser -> res', res)
							if (res[0] === 1) {
								resolve('User removed')
							}
							reject('User is not in list')
						},
						(err) => {
							reject(err)
						}
					)
			},
			(err) => {
				reject('Redis connection failed: ' + err)
			}
		)
	})
}
