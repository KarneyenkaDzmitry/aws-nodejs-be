import { object, string, number } from 'yup';

export type Product = {
    id: string,
    title: string,
    description: string,
    price: number,
    count: number
};

export const ProductSchema = object()
    .shape({
        title: string().required(),
        description: string(),
        price: number().required().min(0),
        count: number().required().min(0)
    })