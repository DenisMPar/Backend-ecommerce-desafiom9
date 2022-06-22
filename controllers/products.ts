import { Product } from "models/products";

export async function searchProducts(
  query: string,
  limit: number,
  offset: number
): Promise<object> {
  //trae los resultados de algolia
  const hits = await Product.getProductsByQuery({ query, limit, offset });
  const hitsResults = hits.hits as any;
  const results = hitsResults.filter((hit) => hit.In_stock);

  return {
    results: results,
    pagination: {
      results: results.length,
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
