const router = require("express").Router();
const Post = require("../models/post")
const User = require("../models/user");


//create

router.post("/", async (req,res)=>{

    const newPost = new Post(req.body)

    try{
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)
    }catch(err){

        res.status(500).json(err)
    }
})

//update

router.put("/:id",async (req,res)=>{

    try{

    
    const post = await Post.findById(req.params.id)
    if(post.userId === req.body.userId){

        await post.updateOne({$set:req.body})
        res.status(200).json("El post a sido modificado")

    }else{
        res.status(403).json("Solo puedes modificar tus propios post")
    }
}catch(err){
    res.status(500).json(err)
}
})
 

//delete


router.delete("/:id",async (req,res)=>{

    try{

    
    const post = await Post.findById(req.params.id)
    if(post.userId === req.body.userId){

        await post.deleteOne()
        res.status(200).json("El post a sido eliminado")

    }else{
        res.status(403).json("Solo puedes eliminar tus propios post")
    }
}catch(err){
    res.status(500).json(err)
}
})

//like dislike
router.put("/:id/like", async (req,res)=>{

    try{

        const post = await Post.findById(req.params.id)
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}})
            res.status(200).json("El post a sido likeado")
        }else{
            await post.updateOne({$pull:{likes:req.body.userId}})
            res.status(200).json("El post a sido deslikeado")

        }
        
    }catch(err){
        res.status(500).json(err)
    }
   
})

//get post

router.get("/:id", async (req,res)=>{

    try{

        const post = await Post.findById(req.params.id)
        res.status(200).json(post)

    }catch(err){

        res.status(500).json(err)
    }

})

//post de la feed

router.get("/timeline/:userId", async (req, res) => {
    try {
      const currentUser = await User.findById(req.params.userId);
      const userPosts = await Post.find({ userId: currentUser._id });
      const friendPosts = await Promise.all(
        currentUser.followings.map((friendId) => {
          return Post.find({ userId: friendId });
        })
      );
      res.status(200).json(userPosts.concat(...friendPosts));
    } catch (err) {
      res.status(500).json(err);
    }
  });

  //post del perfil

  router.get("/profile/:username", async (req, res) => {
    try {
      const user = await User.findOne({ username: req.params.username    });
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      const posts = await Post.find({ userId: user._id });
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json(err);
    }
  });
// contar cantidad de publicaciones de usuario
  router.get("/posts/count", async (req, res) => {
    const username = req.query.username; 
  
    try {
      const user = await User.findOne({ username: username }); // Busca el usuario por su username
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const postCount = await Post.countDocuments({ userId: user._id }); // Cuenta las publicaciones asociadas al userId
      res.status(200).json({ postCount });
    } catch (err) {
      res.status(500).json(err);
    }
  })

  // Agregar un comentario a un post
  router.put("/:id/comment", async (req, res) => {
    try {
      // Buscar el post por ID
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post no encontrado" });
      }
  
      // Crear el nuevo comentario
      const comentario = {
        userId: req.body.userId,
        comentario: req.body.comentario,
      };
    
      // Actualizar el array de comentarios
      await post.updateOne({ $push: { comentarios: comentario } });
  
      res.status(200).json({ message: "Comentario agregado", comentario });
    } catch (err) {
      res.status(500).json(err);
    }
  });

// Obtener todos los comentarios de un post
router.get("/:id/comments", async (req, res) => {
  try {
    // Buscar el post por su ID
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post no encontrado" });
    }

    // Devolver el array de comentarios
    res.status(200).json(post.comentarios);
  } catch (err) {
    res.status(500).json(err);
  }
});




  


module.exports = router;