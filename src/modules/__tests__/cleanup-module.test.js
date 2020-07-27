/* globals describe, it */
const sinon = require('sinon')
const chai = require('chai')
const expect = chai.expect

const CleanupModule = require('../cleanup-module')

describe('cleanup-module.js', ()=> {
  describe('listVersionsToBeCleanedByFunctionName()', ()=> {
    it('Should list lambda versions recursively', async ()=> {
      const AWS = require('aws-sdk')
      const Lambda = new AWS.Lambda({
        region: 'us-west-2',
        accessKeyId: 'AKIAIZPC4C6EXOGNDFRQ',
  secretAccessKey: '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'
      })
      const listVersionMock = sinon.stub().resolves({
        NextMarker: '',
        Versions:[
        { LastModified: '2020-06-29T07:39:15.403+0000', Version: '$LATEST' },
        { LastModified: '2020-06-29T07:39:15.403+0000', Version: '48' },
        { LastModified: '2020-06-01T04:51:10.145+0000', Version: '47' },
        { LastModified: '2020-05-26T07:15:27.811+0000', Version: '46' },
        { LastModified: '2020-04-24T00:48:38.467+0000', Version: '45' },
        { LastModified: '2020-03-18T06:58:56.883+0000', Version: '44' },
        { LastModified: '2020-03-18T06:41:47.955+0000', Version: '43' },
        { LastModified: '2020-01-20T01:46:04.924+0000', Version: '42' },
        { LastModified: '2020-01-17T03:04:35.911+0000', Version: '41' },
        { LastModified: '2019-12-31T04:57:06.429+0000', Version: '40' },
        { LastModified: '2019-12-31T03:52:35.920+0000', Version: '39' }
      ]})
      const LambdaMock = {listVersionsByFunction: () => {return {promise: listVersionMock}}}
      const cleanupModule = new CleanupModule(LambdaMock)
      const list = await cleanupModule.listVersionsToBeCleanedByFunctionName('ctp-users-api-development-get-user-by-sub', 3)
      expect(list).to.deep.equal(
        [
          { LastModified: '2020-05-26T07:15:27.811+0000', Version: '46' },
          { LastModified: '2020-04-24T00:48:38.467+0000', Version: '45' },
          { LastModified: '2020-03-18T06:58:56.883+0000', Version: '44' },
          { LastModified: '2020-03-18T06:41:47.955+0000', Version: '43' },
          { LastModified: '2020-01-20T01:46:04.924+0000', Version: '42' },
          { LastModified: '2020-01-17T03:04:35.911+0000', Version: '41' },
          { LastModified: '2019-12-31T04:57:06.429+0000', Version: '40' },
          { LastModified: '2019-12-31T03:52:35.920+0000', Version: '39' }
        ]
      )
    }).timeout(100000)
  })

  describe('listVersionsToBeCleanedByFunctionName()', ()=> {
    it('Should list lambda versions recursively', async ()=> {
      const AWS = require('aws-sdk')
      const Lambda = new AWS.Lambda({
        region: 'us-west-2',
        accessKeyId: 'AKIAIZPC4C6EXOGNDFRQ',
  secretAccessKey: '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'
      })
      const deleteFunctionMock = sinon.stub().resolves({})
      const LambdaMock = {deleteFunction: () => {return {promise: deleteFunctionMock}}}
      const cleanupModule = new CleanupModule(Lambda)
      const list = await cleanupModule.cleanByFunctionNameAndVersion('ctp-users-api-development-get-user-by-sub', [
        { LastModified: '2020-01-17T03:04:35.911+0000', Version: '4' },
        { LastModified: '2019-12-31T04:57:06.429+0000', Version: '3' },
        { LastModified: '2019-12-31T03:52:35.920+0000', Version: '2' }
      ])
      deleteFunctionMock.onSecondCall().rejects(new Error('Test error'))
      // should call even if one of the versions rejected.
      expect(deleteFunctionMock.callCount).to.equal(8)
    }).timeout(100000)
  })
})