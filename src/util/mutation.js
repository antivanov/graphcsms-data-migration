const { ENDPOINT, headers } = require('../config')
const fetch = require('isomorphic-fetch')

async function postMutation(mutationBody) {
  try{
    const response = await fetch(ENDPOINT, {
      headers,
      method: 'POST',
      body: JSON.stringify(mutationBody)
    })

    const body = await response.json()
    const data = await body.data
    if (body.errors && body.errors.length > 0) {
      console.error('Failed to post mutation', body)
    } else {
      console.log('Successfuly posted mutation', data)
    }
    return data
  } catch (error) {
    console.log("Error!", error)
    process.exit(1)
  }
}

async function fetchByQuery(queryBody) {
  try {
    const response = await fetch(ENDPOINT, {
      headers: headers,
      method: 'POST',
      body: JSON.stringify(queryBody)
    })

    const body = await response.json()
    return await body.data
  } catch (error) {
    console.log("Error!", error)
    process.exit(1)
  }
}

module.exports = {
  postMutation,
  fetchByQuery
}
