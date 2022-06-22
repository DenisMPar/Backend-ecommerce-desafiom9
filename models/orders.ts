import { adminFirestore } from "lib/firestore";

const collection = adminFirestore.collection("orders");
export class Order {
  ref: FirebaseFirestore.DocumentReference;
  data: any;
  id: string;
  constructor(id) {
    this.id = id;
    this.ref = collection.doc(id);
  }
  async pull() {
    const snap = await this.ref.get();
    this.data = snap.data();
  }
  async push() {
    this.ref.update(this.data);
  }
  //crea una nueva orden en la db
  static async createNewOrder(data = {}) {
    const orderSnap = await collection.add(data);
    const newOrder = new Order(orderSnap.id);
    newOrder.data = data;
    return newOrder;
  }
  //trae todas las ordenes del usuario
  static async getUserOrdersById(userId) {
    const ordersRef = collection.where("user.id", "==", userId);
    const ordersQuery = await ordersRef.get();
    let results = [];
    ordersQuery.forEach((result) => {
      results.push({ ...result.data(), orderId: result.id });
    });

    return results;
  }
}
