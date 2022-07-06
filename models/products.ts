import { SearchIndex } from "algoliasearch";
import { productsIndex } from "lib/algolia";

type getProductsProps = {
  query: string;
  limit: number;
  offset: number;
};

export class Product {
  index: SearchIndex;
  data: any;
  id: string;
  constructor(id) {
    this.id = id;
    this.index = productsIndex;
  }
  async pull() {
    const product = await this.index.getObject(this.id);
    this.data = product;
  }

  static async getProductsByQuery({ query, limit, offset }: getProductsProps) {
    const hits = await productsIndex.search(query, {
      length: limit,
      offset,
    });

    return hits;
  }
  static async getAll() {
    let hits = [];
    await productsIndex.browseObjects({
      query: "", // Empty query will match all records

      batch: (batch) => {
        hits = hits.concat(batch);
      },
    });

    return await hits;
  }
}
