import { faker } from '@faker-js/faker';

const item = {
    title: faker.random.words(),
    url: faker.internet.url(),
    description: faker.random.words(),
    amount: faker.datatype.number()
}



const allFactories = {
    item

}

export default allFactories;