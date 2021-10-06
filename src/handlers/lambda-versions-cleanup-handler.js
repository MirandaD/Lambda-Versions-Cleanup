const AWS = require('aws-sdk')
const Lambda = new AWS.Lambda({
  accessKeyId: '*',
  secretAccessKey: '*',
  region: 'us-west-2'
})
const CleanupModule = require('../modules/cleanup-module')

module.exports.lambdaVersionsCleanupHandler = async (event) => {
  const cleanupModule = new CleanupModule(Lambda)
  // console.log('Step1/5. Get list of functions:')
  // const functionList = cleanupModule.listFunctions()
  // step 1/5: get list of versions:
  const functionVersionList = await cleanupModule.listVersionsToBeCleanedByFunctionName(event.functionName, 3)
  console.log(functionVersionList)
  // step 2/5: cleanup:
  await cleanupModule.cleanByFunctionNameAndVersion(event.functionName, functionVersionList)
}

this.lambdaVersionsCleanupHandler({functionName:'ctp-vehicles-api-production-query-vehicle'})
