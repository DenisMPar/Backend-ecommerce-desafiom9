import { productsIndex } from "lib/algolia";

export async function searchProducts(query, limit, offset) {
  //trae los resultados de algolia
  const hits = await productsIndex.search(query, {
    length: limit,
    offset,
  });

  return {
    results: hits.hits,
    pagination: {
      results: hits.hits.length,
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
