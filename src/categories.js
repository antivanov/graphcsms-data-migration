const { postMutation } = require('./util/mutation')
const csv = require('csvtojson')

const categoryCreateMutation = `
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

const categoryPublishMutation = `
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

async function uploadCategories(){
  const rows = await csv().fromFile('./data/categories.csv')
  console.log(`Uploading ${rows.length} categories...`)

  return Promise.all(rows.map(async row => {
    const createResult = await postMutation({
      query: categoryCreateMutation,
      variables: row
    })
    const categoryId = createResult.createCategory.id
    const publishResult = await postMutation({
      query: categoryPublishMutation,
      variables: {
        id: categoryId
      }
    })
    return publishResult
  }))
}

uploadCategories();

module.exports = {
  uploadCategories
}
