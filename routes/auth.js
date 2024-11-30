const { get } = require("mongoose");
const router = require("express").Router();
const bcrypt = require("bcrypt")

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
        lastName:req.body.lastName,
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
    !user && res.status(404).json("Usuario no encontrado");

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    !validPassword && res.status(400).json("Contraseña incorrecta")

    if (user.itsBan) {
      return res.status(403).json("El usuario está baneado");
    }
    res.status(200).json(user)
  } catch (err) {
    res.status(500).json(err)
    
  }
});


module.exports = router;

