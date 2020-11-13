import 'source-map-support/register';
import { getProductsList } from './handlers/getProductsList';
import { getProductsById } from './handlers/getProductsById';
import { addProduct } from './handlers/addProduct';
import { deleteProductsById } from './handlers/deleteProductsById';

export { getProductsById, getProductsList, addProduct, deleteProductsById };
