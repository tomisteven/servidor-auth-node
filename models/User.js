const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: String,
  lastname: String,
  email: String,
  password: String,
  fracePresentacion: String,
  logoImg: String,
  imgSectionOne: String,
  public_id_logoImg: String,
  public_id_imgSectionOne: String,
  linkTienda : String,
  qr : String,
  slogan: String,
  date: {
    type: Date,
    default: Date.now(),
  },
  products: [
    {
      name: String,
      description: String,
      price: Number,
      image: String,
      stock: Number,
      public_id: String,
      generico : Boolean
    },
  ],
  itemsSectionTwo: [
    {
      titulo: String,
      subtitulo: String,
      img: String,
      public_id: String,
    },
  ],
  styles: {
    theme: Boolean,
    fontSize: String,
    color: String,
    productsBorderRadius: String,
  },
  footer: {
    direccion: String,
    telefono: String,
    mail: String,
    facebook: String,
    instagram: String,
    whatsapp: String,
  },
});

module.exports = mongoose.model("User", UserSchema);
