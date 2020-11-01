import {getProductsList}  from '../handlers/getProductsList.ts';
let answer;
let body;

beforeAll(async () => {
  answer = await getProductsList();
  body = JSON.parse(answer.body);
})

test('Status Code should be 200', () => {
  expect(answer.statusCode).toBe(200);
});

test('products to be an Array', () => {
  expect(body).toEqual(expect.toBeArray());
});