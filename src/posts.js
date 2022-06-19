const csv = require('csvtojson')
const { postMutation, fetchByQuery } = require('./util/mutation')

const categoriesQuery= `{
  categories {
    id
    name
  }
}`


const postCreateMutation = `
  mutation CreatePost( $title: String!, $content: String!, $slug: String!, $categories: [CategoryWhereUniqueInput!]) {
    createPost(data: {
      title: $title
      content: $content
      slug: $slug
      categories: {
        connect: $categories
      }
    })
    {
      id
      title
    }
  }
`

const postPublishMutation = `
  mutation PublishPost( $id: ID ) {
    publishPost(where: {
      id: $id
    }, to: PUBLISHED)
    {
      id
      title
      content
      slug
      categories {
        id
      }
    }
  }
`

function getCategoryByName(categories, name) {
  return categories.find(category => (category.name === name))
}

async function fetchCategories() {
  return (await fetchByQuery({
    query: categoriesQuery
  })).categories
}

async function uploadPosts() {
  let categories = await fetchCategories();
  const rows = await csv().fromFile('./data/posts.csv')
  console.log(`Uploading ${rows.length} posts...`)
  return Promise.all(rows.map(async row => {
    const rowCats = row.categories.split("|")
    const categoryIds = rowCats.map(categoryName => {
      const id = getCategoryByName(categories, categoryName).id
      return { "id": id}
    })
    const createResult = await postMutation({
      query: postCreateMutation,
      variables: {
        ...row,
        categories: categoryIds
      }
    })
    const postId = createResult.createPost.id
    const publishResult = await postMutation({
      query: postPublishMutation,
      variables: {
        id: postId
      }
    })
    return publishResult
  }))
}

uploadPosts();

module.exports = {
  uploadPosts
}
