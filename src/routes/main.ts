
import { Router, Request, Response } from 'express';
import { createUser, deleteUser, findUserByEmail, getUserById, getUsers, updateUser } from '../services/user';
import { createPost, deleteAllPosts, deletePost, getAllPosts, getPostbyId, getPostsUser } from '../services/posts';
import { prisma } from "../libs/prisma";

import {config} from "dotenv"

config()

export const mainRouter = Router();



mainRouter.get("/user", async (req, res) => {
    try {
     const users = await getUsers()
     return res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user', details: error });
    }
});



mainRouter.post("/user",async (req,res)=>{
    const {name,email}=req.body
    try {

        const userExist = await findUserByEmail(email)

        if(userExist){
            console.log(userExist)
            return res.status(401).json({message:'ja existe um usuário cadastrado com esse email'})
        }

        const novoUser = {
            name,email
        }

        const user = await createUser(novoUser)
        return res.status(201).json(user)
      } catch (error) {
          res.status(500).json({ error: 'Failed to delete user', details: error });
      } 
})


mainRouter.delete("/user/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    try {
        // Primeiro, delete registros dependentes (exemplo: posts do usuário)
       deleteAllPosts(id)

        // Agora delete o usuário
        await deleteUser(id)
        return res.status(200).json({ message: "usuário e os posts relacionados a ele foram deletados" });
    } catch (error: any) {  // Cast error to 'any' to access 'message' property
        res.status(500).json({ error: 'Failed to delete user', details: error.message });
    }
});


mainRouter.put("/user/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    const { name, email, status } = req.body;

    // Verificar se pelo menos um campo foi fornecido para atualização
    if (name === undefined && email === undefined && status === undefined) {
        return res.status(400).json({ error: 'No fields provided to update' });
    }  

    try {
        const updatedUser = await updateUser(id,name,email,status)

        return res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(500).json({ error: 'Failed to update user', details: error.message });
    }
});

mainRouter.get("/posts",async (req,res)=>{
   try{
    const posts = await getAllPosts()
    return res.status(200).json(posts)
   }catch(error){
    return res.status(500).json(error)
   }

})


 mainRouter.post("/user/:userId/posts",async (req,res)=>{
  const {userId}=req.params
  console.log(userId)
    const {title,body}= req.body

 
   
    try{
    const userExist = await getUserById(userId)
    if (!userExist) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

        const novoPost = {
            title,body,userId:parseInt(userId)
        }

        

     const post = await createPost(novoPost)

     return res.status(201).json(post)
    }catch(error){
        console.log(error)
     return res.status(500).json(error)
    }
 
 })

 
mainRouter.get("/user/:id/posts",async (req,res)=>{
    const {id}= req.params
   
    try{
const posts = await getPostsUser(id)
     return res.status(200).json(posts)
    }catch(error){
        console.log(error)
     return res.status(500).json(error)
    }
 
 })


 mainRouter.delete("/user/:userId/posts/:id",async (req,res)=>{
    const {userId,id}= req.params
   
    try{
const postExist = await getPostbyId(id)
if (!postExist){
    return res.status(404).json({ error: 'Post não encontrado ou não pertence ao usuário' });
}
   
await deletePost(id)
return res.status(200).json({message:"post deletado com sucesso"})
    }catch(error){
        console.log(error)
     return res.status(500).json(error)
    }
 
 })


