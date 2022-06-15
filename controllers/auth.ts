import { Auth } from "models/auth";
import { User } from "models/user";
import addMinutes from "date-fns/addMinutes";
import { sendMail } from "lib/sendgrid";
import { randomIntFromInterval } from "lib/functions";
import { generate } from "lib/jwt";

//encuentra un user o crea un registro nuevo
export async function findOrCreateAuth(email: string): Promise<Auth> {
  const cleanEmail = email.trim().toLowerCase();
  const auth = await Auth.findByEmail(email);

  if (auth) {
    return auth;
  } else {
    const newUser = await User.createNewUser({ email: cleanEmail });
    const newAuth = await Auth.createNewauth({
      email: cleanEmail,
      userId: newUser.id,
      code: "",
      expires: new Date(),
    });
    return newAuth;
  }
}

//envia el codigo de autenticacion al mail
export async function sendCode(email: string): Promise<string> {
  const auth = await findOrCreateAuth(email);
  //genero el codigo random
  const code = randomIntFromInterval(10000, 100000);
  //preparo el email a enviar
  const mail = {
    message: `Tu codigo de ingreso es: ${code}`,
    from: process.env.SENDGRID_EMAIL,
    to: auth.data.email,
    subject: "Your Code",
  };
  //creo la fecha de expiracion del codigo
  const date = new Date();
  const datePlusMinutes = addMinutes(date, 20);

  const emailSent = await sendMail(mail);
  //si el mail se envia actualizo los datos en la db para comparar y poder autenticar al user
  if (emailSent) {
    auth.data.code = code;
    auth.data.expires = datePlusMinutes;
    await auth.push();
    return "Codigo enviado";
  } else {
    throw "No se pudo enviar el codigo";
  }
}
//checkeo el codigo del user
export async function checkUserCode(
  email: string,
  code: number
): Promise<string> {
  const auth = await Auth.FindByEmailAndCode(email, code);
  if (!auth) {
    throw "Código o email incorrectos";
  }
  const validCode = auth.isCodeValid();
  //si el codigo es valido genero el token y luego invalido el codigo para que no se pueda usar de nuevo
  if (validCode) {
    const token = generate({ userId: auth.data.userId });
    await auth.invalidateCode();
    return token;
  } else {
    throw "Código expirado";
  }
}
