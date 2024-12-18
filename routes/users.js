const { get } = require("mongoose");
const User = require("../models/user");
const router = require("express").Router();
const bcrypt = require("bcrypt")


//update
router.put("/:id",async (req,res)=>{

    if(req.body.userId === req.params.id || req.body.isAdmin){

        if(req.body.password){

            try{

                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);

            }catch(err){
                return res.status(500).json(err)
            }
        }
        try{

            const user = await User.findByIdAndUpdate(req.params.id,
                {$set:req.body,})
                res.status(200).json("La cuenta ha sido modificada")

        }catch(err){
            return res.status(500).json(err)

        }
    }else{

        return res.status(403).json("Solo puedes modificar tu propia cuenta")
    }
     
})

//Delete

router.delete("/:id",async (req,res)=>{

    if(req.body.userId === req.params.id || req.body.isAdmin){
        try{
            const user = await User.findByIdAndDelete(req.params.id)
                res.status(200).json("Account has been deleted")

        }catch(err){
            return res.status(500).json(err)

        }
    }else{

        return res.status(403).json("You can delete only your account! ")
    }
     
})

// get

router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  const name = req.query.name;

  try {
    const user = userId
      ? await User.findById(userId)
      : username
      ? await User.findOne({ username: username })
      : name
      ? await User.findOne({ name: name })
      : null;  
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);  
  } catch (err) {
    res.status(500).json(err); 
  }
});


//get Users por filtros
router.get("/searchUsers", async (req, res) => {
  const username = req.query.username;

  try {
    if (!username) {
      return res.status(400).json({ message: "El parámetro 'username' es requerido" });
    }

    // Buscar usuarios que coincidan parcialmente con el 'username'
    const users = await User.find({
      username: { $regex: username, $options: "i" }, // Insensible a mayúsculas
    });

    if (users.length === 0) {
      return res.status(404).json({ message: "No se encontraron usuarios" });
    }

    // Eliminar el campo de contraseña antes de devolver los resultados
    const result = users.map(user => {
      const { password, updatedAt, ...other } = user._doc;
      return other;
    });

    res.status(200).json(result);
  } catch (err) {
    console.error("Error al buscar usuarios:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});



//follows
router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (!user.followers.includes(req.body.userId)) {
          await user.updateOne({ $push: { followers: req.body.userId } });
          await currentUser.updateOne({ $push: { followings: req.params.id } });
          res.status(200).json("user has been followed");
        } else {
          res.status(403).json("you already unfollow this user");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you cant follow yourself");
    }
  });

  //unfollow

  router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (user.followers.includes(req.body.userId)) {
          await user.updateOne({ $pull: { followers: req.body.userId } });
          await currentUser.updateOne({ $pull: { followings: req.params.id } });
          res.status(200).json("user has been unfollowed");
        } else {
          res.status(403).json("you dont follow this user");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you cant unfollow yourself");
    }
  });

  //searchUser
  router.get("/searchUsers", async (req, res) => {
    const username = req.query.username;
    try {
      const users = await User.find({ username: new RegExp(username, "i") });
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

  

module.exports = router;