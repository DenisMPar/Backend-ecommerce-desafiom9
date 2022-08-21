import { Product } from "models/products";

export async function searchProducts(
  query: string,
  limit: number,
  offset: number
): Promise<object> {
  //trae los resultados del model
  const hits = await Product.getProductsByQuery({ query, limit, offset });
  const hitsResults = hits.hits as any;

  return {
    results: hitsResults,
    pagination: {
      results: hitsResults.length,
      offset,
      limit,
      total: hits.nbHits,
    },
  };
}

export async function getProductById(id: string) {
  const product = new Product(id);
  await product.pull();
  return product.data;
}
export async function getAllProductsId() {
  const products = await Product.getAll();
  const ids = products.map((prod) => {
    return prod.objectID;
  });
  return ids;
}
