const SpecKart = artifacts.require('SpecKart')
const SpecToken = artifacts.require('SpecToken')
const Dispute = artifacts.require('DisputeContract')
let SpecTokenInstance, DisputeInstance

const admins = ['0xb685645C8C9aDC21179100A62a11836aFE8937A8',
	'0x7B82ec94064E7FDF44322D5Fd869F45688d055F6',
	'0xf003d5575dc35Be27dF8865c7Ca30644958D0ed8']

module.exports = async function (deployer) {
	deployer.deploy(SpecToken).then(instance => {
		SpecTokenInstance = instance
		return deployer.deploy(Dispute,
			admins,
			SpecTokenInstance.address)
	})
		.then(instance => {
			DisputeInstance = instance
			return deployer.deploy(SpecKart, SpecTokenInstance.address, DisputeInstance.address)
		})
}

