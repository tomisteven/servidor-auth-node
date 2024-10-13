const bcrypt = require("bcrypt-nodejs");
const User = require("../models/User");
const {
  createRefreshToken,
  createToken,
  decodedToken,
} = require("../utils/jwt");

const register = async (req, res) => {
  const { password, repeatPassword, email, name, lastname } = req.body;
  const user = new User({
    name: name,
    lastname: lastname,
    email: email.toLowerCase(),
    fracePresentacion:
      "Hola, somos la empresa de tus sueños y estamos para ayudarte",
    logoImg:
      "https://res.cloudinary.com/dk0x8gavc/image/upload/v1701282863/Captura_de_pantalla_2023-11-29_152711-removebg-preview_swpcsm.png",
    imgSectionOne:
      "https://res.cloudinary.com/dk0x8gavc/image/upload/v1701282975/Dise%C3%B1o_sin_t%C3%ADtulo_zh0xdz.png",
    slogan: "Crea, Cataloga y Comparti tus productos",
    public_id_logoImg: "",
    public_id_imgSectionOne: "",
    products: [
      {
        name: "Shoes Gam",
        description:
          "Zapatos de cuero, con suela de goma, para todo tipo de terreno",
        price: 999,
        image:
          "https://res.cloudinary.com/dk0x8gavc/image/upload/v1701283161/5035227_gki79w.webp",
        stock: 5,
        public_id: "5035227_gki79w",
      },
      {
        name: "Shoes Kiffer",
        description:
          "Zapatos de cuero, con suela de goma, para todo tipo de terreno",
        price: 1999,
        image:
          "https://res.cloudinary.com/dk0x8gavc/image/upload/v1701283161/5035216_ekakqo.webp",
        stock: 5,
        public_id: "5035216_ekakqo",
      },
      {
        name: "Shoes Damer",
        description:
          "Zapatos de cuero, con suela de goma, para todo tipo de terreno",
        price: 2999,
        image:
          "https://res.cloudinary.com/dk0x8gavc/image/upload/v1701283160/5033508_mbxus1.webp",
        stock: 5,
        public_id: "5033508_mbxus1",
      },
      {
        name: "Shoes Nikker",
        description:
          "Zapatos de cuero, con suela de goma, para todo tipo de terreno",
        price: 3999,
        image:
          "https://res.cloudinary.com/dk0x8gavc/image/upload/v1701283160/2358596_jaxmjz.webp",
        stock: 5,
        public_id: "2358596_jaxmjz",
      },
    ],
    itemsSectionTwo: [
      {
        titulo: "Calidad Asegurada",
        subtitulo: "Garantia de 6 meses",
        img: "https://res.cloudinary.com/dk0x8gavc/image/upload/v1701283440/certificado-de-garantia_ybqnvf.png",
        public_id: "certificado-de-garantia_i5xevp",
      },
      {
        titulo: "Envios a todo el pais",
        subtitulo: "Compra Minima $5000",
        img: "https://res.cloudinary.com/dk0x8gavc/image/upload/v1701283441/enviado_oavqpj.png",
        public_id: "enviado_oavqpj",
      },
    ],
    footer: {
      direccion: "Av. Siempre Viva 123",
      telefono: "123456789",
      mail: "contacto@tusue%C3%B1o.com",
      facebook: "https://www.facebook.com/",
      instagram: "https://www.instagram.com/",
      whatsapp: "https://web.whatsapp.com/",
    },
    styles: {
      theme: true,
      fontSize: "16px",
      color: "#000000",
      productsBorderRadius: "10px",
    },
  });

  const emailExist = await User.findOne({ email: email.toLowerCase() });

  if (emailExist) res.status(404).send({ message: "El email ya existe" });
  else {
    if (!password || !repeatPassword) {
      res.status(404).send({ message: "Las contraseñas son obligatorias" });
    } else {
      if (password !== repeatPassword) {
        res
          .status(404)
          .send({ message: "Las contraseñas tienen que ser iguales" });
      } else {
        bcrypt.hash(password, null, null, (err, hash) => {
          if (err) {
            res
              .status(500)
              .send({ message: "Error al encriptar la contraseña" });
          } else {
            user.password = hash;
            user.save((err, userStored) => {
              if (err) {
                console.log(err);
                res.status(500).send({ message: err });
              } else {
                if (!userStored) {
                  res
                    .status(404)
                    .send({ message: "Error al crear el usuario" });
                } else {
                  res.status(200).send({ userStored });
                }
              }
            });
          }
        });
      }
    }
  }
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email) res.status(404).send({ message: "El email es obligatorio" });
  if (!password)
    res.status(404).send({ message: "La contraseña es obligatoria" });
  User.findOne({ email: email.toLowerCase() }, (err, userStored) => {
    if (err) res.status(500).send({ message: "Error del servidor" });
    if (!userStored) res.status(404).send({ message: "Usuario no encontrado" });
    else {
      bcrypt.compare(password, userStored.password, (bycriptErr, check) => {
        if (bycriptErr) res.status(500).send({ message: "Error del servidor" });
        if (!check)
          res.status(404).send({ message: "La contraseña es incorrecta" });
        else
          res.status(200).send({
            accessToken: createToken(userStored),
            refreshToken: createRefreshToken(userStored),
            //agregue los tokens para que no me de error cuando me creo un usuario nuevo desde un admin
          });
      });
    }
  });
};

const refreshToken = (req, res) => {
  const { token } = req.body;
  if (!token) res.status(404).send({ message: "El token requerido" });
  const { user_id } = decodedToken(token);
  if (!user_id) res.status(404).send({ message: "El token es invalido" });
  else {
    User.findOne({ _id: user_id }, (err, userStored) => {
      if (err) res.status(500).send({ message: "Error del servidor" });
      if (!userStored)
        res.status(404).send({ message: "Usuario no encontrado" });
      else {
        res.status(200).send({
          accessToken: createToken(userStored),
          //refreshToken: createRefreshToken(userStored)
        });
      }
    });
  }
};

//exportamos
module.exports = {
  register,
  login,
  refreshToken,
};
