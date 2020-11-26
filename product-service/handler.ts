import 'source-map-support/register';
import { getProductsList } from './handlers/getProductsList';
import { getProductsById } from './handlers/getProductsById';
import { addProduct } from './handlers/addProduct';
import { deleteProductsById } from './handlers/deleteProductsById';
import { catalogBatchProcess } from './handlers/catalogBatchProcess'

export { getProductsById, getProductsList, addProduct, deleteProductsById, catalogBatchProcess };
