const { ENDPOINT, headers } = require('../config');
const fetch = require('isomorphic-fetch');

async function postMutation(mutationBody) {
  try{
    const response = await fetch(ENDPOINT, {
      headers,
      method: 'POST',
      body: mutationBody
    });

    // Parse the response to verify success
    const body = await response.json()
    const data = await body.data
    if (body.errors && body.errors.length > 0) {
      console.error('Failed to post mutation', body)
    } else {
      console.log('Successfuly posted mutation', data);
    }
    return data;
  } catch (error) {
    console.log("Error!", error);
    process.exit(1);
  }
}

module.exports = {
  postMutation
}
