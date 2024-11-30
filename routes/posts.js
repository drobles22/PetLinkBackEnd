const router = require("express").Router();
const Post = require("../models/post")

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

router.get("/timeline/all", async (req, res) => {
    try {
      const currentUser = await User.findById(req.body.userId);
      const userPosts = await Post.find({ userId: currentUser._id });
      const friendPosts = await Promise.all(
        currentUser.followings.map((friendId) => {
          return Post.find({ userId: friendId });
        })
      );
      res.json(userPosts.concat(...friendPosts))
    } catch (err) {
      res.status(500).json(err);
    }
  });


module.exports = router;