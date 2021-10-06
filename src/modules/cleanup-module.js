const _ = require('lodash')
class CleanupModule {
  constructor(Lambda) {
    this.Lambda = Lambda
  }

  async listVersionsToBeCleanedByFunctionName(functionName, latestNVersionsToKeep = 5) {
    let versionList = [] // save version names only
    let versionsToDel = []
    let marker = 'beginning'
    while (marker) {
      const params = marker !== 'beginning' ? { FunctionName: functionName, Marker: marker } : { FunctionName: functionName }
      const versionsRes = await this.Lambda.listVersionsByFunction(params).promise()
      const versionArray = _.get(versionsRes, 'Versions', [])
      versionList = versionList.concat(_.map(versionArray, (singleVersionInfo) => {
        return {
          LastModified: singleVersionInfo.LastModified,
          Version: singleVersionInfo.Version
        }
      }))
      marker = _.get(versionsRes, 'NextMarker')
    }
    // exclude $LATEST and the lastN
    const orderedList = _.orderBy(versionList, ['LastModified'], ['desc'])
    // console.log(orderedList)
    _.forEach(orderedList, (singleVersion, index) => {
      if (singleVersion.Version != '$LATEST' && index + 1 > latestNVersionsToKeep) {
        versionsToDel.push(singleVersion)
      }
    })
    return versionsToDel
  }

  async cleanByFunctionNameAndVersion(functionName, versionList) {
    for (const singleVersion of versionList) {
      try {
        const params = {
          FunctionName: functionName,
          Qualifier: singleVersion.Version
        }
        await this.Lambda.deleteFunction(params).promise()
      } catch (error) {
        console.log('Error deleting function', functionName, singleVersion.Version, error)
        // swallow error to try next
      }
    }
  }

  async listFunctions() {
    const functionList = await this.Lambda.listFunctions({}).promise()
    let functionNameList = []
    let marker = 'beginning'
    while (marker) {
      const params = marker !== 'beginning' ? { Marker: marker } : {}
      const functionListRes = await this.Lambda.listFunctions(params).promise()
      const functionArray = _.get(functionListRes, 'Functions', [])
      functionNameList = functionNameList.concat(_.map(functionArray, (singleFunctionInfo) => {
        return {
          FunctionName: singleFunctionInfo.FunctionName
        }
      }))
      marker = _.get(functionListRes, 'NextMarker')
    }
    return functionNameList
  }
}

module.exports = CleanupModule