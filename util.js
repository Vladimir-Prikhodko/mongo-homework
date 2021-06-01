const faker = require('faker')

const generateUser = ({
  firstName = faker.name.firstName(),
  lastName = faker.name.lastName(),
  department,
  createdAt = new Date()
} = {}) => ({
  firstName,
  lastName,
  department,
  createdAt
})

module.exports = {
  mapUser: generateUser,
  getRandomFirstName: () => faker.name.firstName()
}
