const { postMutation } = require('./util/mutation');
const csv = require('csvtojson');

const categoriesCreateMutation = `
  mutation CreateCategory( $name: String! ) {
    createCategory(data: {
      name: $name
    })
    {
      id
      name
    }
  }
`

const categoriesPublishMutation = `
  mutation PublishCategory( $id: ID ) {
    publishCategory(where: {
      id: $id
    }, to: PUBLISHED)
    {
      id
      name
    }
  }
`

// Upload Data to GraphCMS Project Database
async function uploadCategories(){
  const rows = await csv().fromFile('./data/categories.csv');
  console.log(`Uploading ${rows.length} categories...`);
  rows.map(async row => {
    const createResult = await postMutation(JSON.stringify({
      query: categoriesCreateMutation,
      variables: row
    }))
    const categoryId = createResult.createCategory.id
    const publishResult = await postMutation(JSON.stringify({
      query: categoriesPublishMutation,
      variables: {
        id: categoryId
      }
    }))
    return publishResult
  })
  return true;
}

uploadCategories();

module.exports = {
  uploadCategories
}
