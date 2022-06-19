const { postMutation } = require('./util/mutation')

const deleteAllCommentsMutation = `
  mutation DeleteAllComments {
    deleteManyCommentsConnection()
    {
      edges {
        node {
          id
        }
      }
    }
  }`;

const deleteAllPostsMutation = `
  mutation DeleteAllPosts {
    deleteManyPostsConnection()
    {
      edges {
        node {
          id
        }
      }
    }
  }`;

const deleteAllCategoriesMutation = `
  mutation DeleteAllCategories {
    deleteManyCategoriesConnection()
    {
      edges {
        node {
          id
        }
      }
    }
  }`;

async function reset() {
  await postMutation({
    query: deleteAllCommentsMutation
  })
  await postMutation({
    query: deleteAllPostsMutation
  })
  await postMutation({
    query: deleteAllCategoriesMutation
  })
}

reset()

module.exports = {
  reset
}