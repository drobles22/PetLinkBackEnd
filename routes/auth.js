const { get } = require("mongoose");
const router = require("express").Router();
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const { expressjwt: jwtMiddleware } = require('express-jwt');
const nodemailer = require("nodemailer"); 



const User = require("../models/user")


//registrar usuario
router.post("/register",async(req,res)=>{

   
      try{

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        name:req.body.name,
        itsBan:false
      });

        const user = await newUser.save()
        res.status(200).json(user)
      }catch(err){

        res.status(500).json(err)

      }

})

//login del user

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("user not found");

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    !validPassword && res.status(400).json("wrong password")

    res.status(200).json(user)
  } catch (err) {
    res.status(500).json(err)
  }
});




//solicitud de reinicio de contraseña
router.post("/forgotPassword", async (req, res) => {
  console.log("Solicitud a /forgotPassword recibida");
  const { email } = req.body;
  console.log("Correo recibido:", email);  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "El correo no existe" });
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    user.resetToken = resetToken;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Solicitud de reinicio de contraseña",
      text: `Hola, haz solicitado un reinicio de contraseña para PetLink, haz clic en el siguiente enlace para reiniciar tu contraseña: 
      http://localhost:8800/api/auth/reset-password?token=${resetToken}`,
    };

    console.log("Configuración del transporte: ", mailOptions);  
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error("Error al enviar el correo:", error);  
    return res.status(500).json({ message: "Error al enviar el correo de reinicio." });
  }
  console.log("Correo enviado:", info);
  res.json({ message: "Correo de reinicio enviado." });
});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Hubo un problema al procesar la solicitud." });
  }
});


// Resetear la contraseña
router.post("/resetPassword", async (req, res) => {
  const { resetToken, newPassword } = req.body;

  try {

    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.resetToken !== resetToken) {
      return res.status(400).json({ message: "Token inválido o expirado." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

 
    user.password = hashedPassword;
    user.resetToken = undefined;  
    await user.save();

    res.json({ message: "Contraseña cambiada exitosamente." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Hubo un error al reiniciar la contraseña." });
  }
});



module.exports = router;

