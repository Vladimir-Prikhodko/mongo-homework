const faker = require('faker')

const generateArticle = ({
  name = faker.name.firstName(),
  description = faker.company.catchPhraseDescriptor(),
  type,
  tags = []
} = {}) => ({
  name,
  description,
  type,
  tags
})

module.exports = {
  mapArticle: generateArticle
}
