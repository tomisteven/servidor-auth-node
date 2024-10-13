const User = require("../models/User");
const cloudinary = require("cloudinary");
const fs = require("fs-extra");
const bcrypt = require("bcrypt-nodejs");

const getUserLogged = async (req, res) => {
  const { user_id } = req.user.user_id;
  const user = await User.findOne(user_id);
  res.status(200).json({ user });
};
/*  */
const createProduct = async (req, res) => {
  const { user_id } = req.user.user_id;
  const { name, description, price, stock } = req.body;
  const { img } = req.files;
  const result = await cloudinary.v2.uploader.upload(img.path);

  const newProduct = {
    name,
    description,
    price,
    stock,
    image: result.secure_url,
    public_id: result.public_id,
  };

  const user = await User.findOne(user_id);
  user.products.push(newProduct);
  await user.save();

  fs.unlink(img.path);

  res.status(200).json({
    message: "Producto creado correctamente",
    products: user.products,
  });
};

const deleteProduct = async (req, res) => {
  try {
    const { user_id } = req.user.user_id;
    const { product_id } = req.params;

    const productImg = user.products.filter(
      (product) => product._id == product_id
    );
    console.log(productImg);
    await cloudinary.v2.api.delete_resources(productImg[0].public_id);

    const products = user.products.filter(
      (product) => product._id != product_id
    );
    user.products = products;
    await user.save();
    res
      .status(200)
      .json({ message: "Producto eliminado correctamente", ok: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error al eliminar el producto", ok: false });
  }
};
/*  */

const updateImagesUser = async (req, res) => {
  const { user_id } = req.user.user_id;

  const user = await User.findOne(user_id);

  if (req.files) {
    const { logoImg, imgSectionOne } = req.files;

    if (logoImg) {
      const result = await cloudinary.v2.uploader.upload(logoImg.path);
      user.public_id_logoImg
        ? await cloudinary.v2.uploader.destroy(user.public_id_logoImg)
        : null;
      user.public_id_logoImg = result.public_id;
      user.logoImg = result.secure_url;
    }
    if (imgSectionOne) {
      const result = await cloudinary.v2.uploader.upload(imgSectionOne.path);
      user.public_id_imgSectionOne
        ? await cloudinary.v2.uploader.destroy(user.public_id_imgSectionOne)
        : null;
      user.public_id_imgSectionOne = result.public_id;
      user.imgSectionOne = result.secure_url;
    }
  }

  await user.save();
  res.status(200).json({ message: "Usuario actualizado correctamente", user });
};

const updateUser = async (req, res) => {
  const { user_id } = req.user.user_id;
  const { password } = req.body;
  const user = await User.findOne(user_id);

  if (password) {
    bcrypt.hash(password, null, null, async (err, hash) => {
      if (err) {
        res.status(500).send({ message: "Error al encriptar la contraseña" });
      } else {
        user.password = hash;
      }
    });const bcrypt = require("bcrypt-nodejs");
  }

  Object.keys(req.body).forEach((key) => {
    user[key] = req.body[key];
  });

  await user.save();
  res.status(200).json({ message: "Usuario actualizado correctamente", user });
};

const updateStyles = async (req, res) => {
  const { user_id } = req.user.user_id;
  const user = await User.findOne(user_id)
  const footer = user.footer;


  Object.keys(req.body).forEach((key) => {
    footer[key] = req.body[key];
  });

  await user.save();
  res.status(200).json({ message: "Estilos actualizado correctamente", user });
};

const updateFooter = async (req, res) => {
  const { user_id } = req.user.user_id;
  const user = await User.findOne(user_id)
  const footer = user.footer;

  Object.keys(req.body).forEach((key) => {
    footer[key] = req.body[key];
  });

  await user.save();
  res.status(200).json({ message: "Estilos actualizado correctamente", user });



};

const updateItemsSectionTwo = async (req, res) => {
  const { user_id } = req.user.user_id;
  const { id_item } = req.params;
  const { img } = req.files;

  const user = await User.findOne(user_id);
  const item = user.itemsSectionTwo.id(id_item);

  console.log(item);

  if (img) {
    if (
      item.public_id == "certificado-de-garantia_i5xevp" ||
      item.public_id == "enviado_oavqpj"
    ) {
      const result = await cloudinary.v2.uploader.upload(img.path);
      item.img = result.secure_url;
      item.public_id = result.public_id;
    } else {
      await cloudinary.v2.api.delete_resources(item.public_id);
      const result = await cloudinary.v2.uploader.upload(img.path);
      item.img = result.secure_url;
      item.public_id = result.public_id;
    }
  }

  Object.keys(req.body).forEach((key) => {
    item[key] = req.body[key];
  });

  await user.save();
  res.status(200).json({ message: "Usuario actualizado correctamente", user });
};

module.exports = {
  createProduct,
  updateImagesUser,
  getUserLogged,
  deleteProduct,
  updateItemsSectionTwo,
  updateUser,
  updateStyles,
  updateFooter
};
