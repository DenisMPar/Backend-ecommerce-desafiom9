import { adminFirestore } from "lib/firestore";
import isAfter from "date-fns/isAfter";

const collection = adminFirestore.collection("auth");
export class Auth {
  ref: FirebaseFirestore.DocumentReference;
  data: any;
  id: string;
  constructor(id) {
    this.id = id;
    this.ref = collection.doc(id);
  }
  //trae la data desde la db
  async pull() {
    const snap = await this.ref.get();
    this.data = snap.data();
  }
  //sube la data a la db
  async push() {
    this.ref.update(this.data);
  }
  //checkea si el codigo expiró
  isCodeValid() {
    const expires = this.data.expires.toDate();
    const now = new Date();
    const after = isAfter(expires, now);
    return after;
  }
  //invalida el codigo usado comabiando su fecha de expiracion
  async invalidateCode() {
    this.data.expires = new Date();
    await this.push();
  }
  //Busca un registro por email en la db
  //crea una nueva instancia de auth y la retorna
  static async findByEmail(email: string) {
    const cleanEmail = this.cleanEmail(email);
    const results = await collection.where("email", "==", cleanEmail).get();
    if (results.docs.length) {
      const first = results.docs[0];
      const newAuth = new Auth(first.id);
      newAuth.data = first.data();
      return newAuth;
    } else {
      return null;
    }
  }
  //Crea un nuevo registro de auth en la db y devuelve una instancia de auth
  static async createNewauth(data) {
    const userSnap = await collection.add(data);
    const newUser = new Auth(userSnap.id);
    newUser.data = data;
    return newUser;
  }

  static cleanEmail(email) {
    return email.trim().toLowerCase();
  }
  //encuentra un registro en la db con un email y codigo y devuelve una instancia de auth
  static async FindByEmailAndCode(email: string, code: number) {
    const cleanEmail = this.cleanEmail(email);
    const results = await collection
      .where("email", "==", cleanEmail)
      .where("code", "==", code)
      .get();
    if (results.empty) {
      console.error("Codigo o email incorrectos");
      return null;
    } else {
      const snap = results.docs[0];
      const auth = new Auth(snap.id);
      auth.data = snap.data();
      return auth;
    }
  }
}
