import { getProductsById } from '../handlers/getProductsById.ts';
const event = {
    pathParameters: {
        productId: "7567ec4b-b10c-48c5-9345-fc73348a80a4"
    }
};
const expected = {
    "count": 8,
    "description": "Short Product Description4",
    "id": "7567ec4b-b10c-48c5-9345-fc73348a80a4",
    "price": 15,
    "title": "ProductTest"
};

let answer_1, answer_2;
let body_1, body_2;

beforeAll(async () => {
    answer_1 = await getProductsById(event);
    event.pathParameters.productId = "unexistedId";
    answer_2 = await getProductsById(event);
    body_1 = JSON.parse(answer_1.body);
    body_2 = JSON.parse(answer_2.body);
})

test('Status Code should be 200', () => {
    expect(answer_1.statusCode).toBe(200);
});

test('Status Code should be 200', () => {
    expect(answer_2.statusCode).toBe(200);
});

test('products/existedId to be an Object', () => {
    expect(body_1).toEqual(expect.toBeObject());
});

test('products/existedId to be an Object', () => {
    expect(body_1).toEqual(expect.toBeObject());
});

test('products/unexistedId to be an Object', () => {
    expect(body_1).toEqual(expect.objectContaining(expected));
});

test('products/unexistedId body should have message', () => {
    expect(body_2.message).toEqual(`Product not found: [unexistedId]`);
});