'use strict'

const { mapUser, getRandomFirstName } = require('./util')
const { mapArticle } = require('./article')

// db connection and settings
const connection = require('./config/connection')
let userCollection
let articleCollection
run()

async function run () {
  await connection.connect()
  // await connection.get().createCollection('users')
  await connection.get().dropCollection('users')
  userCollection = connection.get().collection('users')
  // await connection.get().createCollection('articles')
  await connection.get().dropCollection('articles')
  articleCollection = connection.get().collection('articles')

  await example1()
  await example2()
  await example3()
  await example4()
  await example5()
  await example6()
  await example7()
  await example8()
  await example9()
  await connection.close()
}

// #### Users

// - Create 2 users per department (a, b, c)
async function example1 () {
  try {
    const departments = ['a', 'a', 'b', 'b', 'c', 'c']
    const users = departments.map(d => ({ department: d })).map(mapUser)
    try {
      const { result } = await userCollection.insertMany(users)
      console.log(`Added ${result.n} users`)
    } catch (err) {
      console.error(err)
    }
  } catch (err) {
    console.error(err)
  }
}

// - Delete 1 user from department (a)

async function example2 () {
  try {
    const { result } = await userCollection.deleteOne({ department: 'a' })
    console.log(`Removed ${result.n} user`)
  } catch (err) {
    console.error(err)
  }
}

// - Update firstName for users from department (b)

async function example3 () {
  try {
    const usersB = await userCollection.find({ department: 'b' }).toArray()
    const bulkWrite = usersB.map(user => ({
      updateOne: {
        filter: { _id: user._id },
        update: { $set: { firstName: getRandomFirstName() } }
      }
    }))
    const { result } = await userCollection.bulkWrite(bulkWrite)
    console.log(`Updated ${result.nModified} users`)
  } catch (err) {
    console.error(err)
  }
}

// - Find all users from department (c)
async function example4 () {
  try {
    const departmentC = await userCollection.find({ department: 'c' }).toArray()
    const [...names] = departmentC.map(item => item.firstName)
    console.log(`Users from C department are ${names}`)
  } catch (err) {
    console.error(err)
  }
}

// Articles

// Create 5 articles per each type (a, b, c)

async function example5 () {
  try {
    const articles = ['a', 'a', 'a', 'a', 'a', 'b', 'b', 'b', 'b', 'b', 'c', 'c', 'c', 'c', 'c']
    const art = articles.map(item => ({ type: item })).map(mapArticle)
    try {
      const { result } = await articleCollection.insertMany(art)
      console.log(`Added ${result.n} articles`)
    } catch (err) {
      console.error(err)
    }
  } catch (err) {
    console.error(err)
  }
}

// Find articles with type a, and update tag list with next value [‘tag1-a’, ‘tag2-a’, ‘tag3’]

async function example6 () {
  try {
    await articleCollection.updateMany(
      { type: { $eq: 'a' } },
      { $push: { tags: { $each: ['tag1-a', 'tag2-a', 'tag3'] } } }
    )
  } catch (err) {
    console.error(err)
  }
}

// Add tags [‘tag2’, ‘tag3’, ‘super’] to other articles except articles from type a

async function example7 () {
  try {
    await articleCollection.updateMany(
      { tags: { $nin: ['tag1-a', 'tag2-a', 'tag3'] } },
      { $push: { tags: { $each: ['tag2', 'tag3', 'super'] } } }
    )
  } catch (err) {
    console.error(err)
  }
}

// Find all articles that contains tags [tag2, tag1-a]

async function example8 () {
  try {
    const filteredArray = await articleCollection.find({ tags: { $in: ['tag2', 'tag1-a'] } }).toArray()
    console.log(filteredArray)
  } catch (err) {
    console.error(err)
  }
}

// Pull [tag2, tag1-a] from all articles

async function example9 () {
  try {
    await articleCollection.updateMany({}, { $pull: { tags: { $in: ['tag2', 'tag1-a'] } } })
  } catch (err) {
    console.error(err)
  }
}
