import { prisma } from "../libs/prisma";
import {Prisma} from "@prisma/client"

interface PostData {
    title: string;
    body: string;
}

interface CreatePostArgs {
    id: number;
    data: PostData;
}

export async function deleteAllPosts(id:number) {
    await prisma.post.deleteMany({ 
        where: {
            userId: id
        }
    });
    return
}

export async function getAllPosts() {
    const posts = await prisma.post.findMany({
        include:{
            autor:true
        }
    })
    return posts
}

export async function createPost({title,body,userId}:any) {


    const post = await prisma.post.create({
        data:{
            title,body,
            userId

        }
    })
    return post
}




export async function getPostsUser(id:any) {
    const posts = await prisma.post.findMany({
        where: {
          userId: parseInt(id, 10),
        },
        include: {
          autor: true,
        },
      });
      return posts
}

export async function getPostbyId(id:any) {
    const post = await prisma.post.findUnique({
        where: {
          id: parseInt(id, 10),
        },
      });
      return post
}


export async function deletePost(id:any) {
   await prisma.post.delete({
        where: {
          id: parseInt(id, 10),
        }
      });
      return 
}