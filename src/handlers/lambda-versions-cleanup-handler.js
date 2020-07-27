const AWS = require('aws-sdk')
const Lambda = new AWS.Lambda()
const CleanupModule = require('../modules/cleanup-module')

const init = () => {

}

const listVersionsToCleanup = () => {

}
module.exports.lambdaVersionsCleanupHandler = async () => {
  const cleanupModule = new CleanupModule(Lambda)
  console.log('Step1/5. Get list of functions:')
  const 

}