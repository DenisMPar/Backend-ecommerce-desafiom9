import { productsIndex } from "lib/algolia";

export async function searchProducts(query, limit, offset) {
  //trae los resultados de algolia
  const hits = await productsIndex.search(query, {
    length: limit,
    offset,
  });
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
  try {
    const product = await productsIndex.getObject(id);
    return product;
  } catch (error) {
    throw { message: error.message, status: error.status };
  }
}
