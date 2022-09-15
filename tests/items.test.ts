import supertest from 'supertest'
import app from '../src/app'
import allFactories from './Fractories/fractory'
import { prisma } from '../src/database';

beforeAll(() => {
  prisma.$executeRaw`
  TRUNCATE TABLE items;
  `
})

describe('Testa POST /items ', () => {
  it('Deve retornar 201, se cadastrado um item no formato correto', async () => {
    const item = allFactories.item;
    const result = await supertest(app).post('/items').send(item)
    const status = result.status
    expect(status).toEqual(201)
  });

  it('Deve retornar 409, ao tentar cadastrar um item que exista', async () => {
    const item = allFactories.item;
    await supertest(app).post('/items').send(item)
    const result = await supertest(app).post('/items').send(item)
    const status = result.status
    expect(status).toEqual(409)
  });
});

describe('Testa GET /items ', () => {
  it('Deve retornar status 200 e o body no formato de Array', async () => {
    const result = await supertest(app).get('/items')
    expect(result.status).toEqual(200)
    expect(result.body).toBeInstanceOf(Array)
  });
});

describe('Testa GET /items/:id ', () => {
  it('Deve retornar status 200 e um objeto igual a o item cadastrado', async () => {
    const item = allFactories.item
    await supertest(app).post('/items').send(item)
    const itemCriado = await prisma.items.findUnique({
      where: { title: item.title }
    });
    const result = await supertest(app).get(`/items/${itemCriado.id}`)
    delete result.body.id
    expect(item).toEqual(expect.objectContaining(result.body))
    expect(result.status).toEqual(200)
  });
  it('Deve retornar status 404 caso não exista um item com esse id', async () => {
    const result = await supertest(app).get(`/items/${0}`)
    expect(result.status).toEqual(404)
  });
});



afterAll(async () => {
  await prisma.$disconnect();
});