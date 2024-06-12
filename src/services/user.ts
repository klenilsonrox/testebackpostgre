import { prisma } from "../libs/prisma";
import {Prisma} from "@prisma/client"


export async function createUser(data:Prisma.UserCreateManyInput) {
    const user = await prisma.user.create({data})
    return user
}


export async function getUsers() {
    const users = await prisma.user.findMany()
    return users
}


export async function deleteUser(id:number) {
    await prisma.user.delete({
        where: {
            id: id
        }
    });

    return

}


export async function updateUser(id:number,name:string,email:string,status:boolean) {
   const userUpdated= await prisma.user.update({
        where: {
            id: id
        },
        data: {
            name: name || undefined,  // Atualiza apenas se o nome for fornecido
            email: email || undefined, // Atualiza apenas se o email for fornecido
            status: status !== undefined ? status : undefined // Atualiza apenas se o status for fornecido
        }
    });
    return userUpdated
}

export async function getUserById(userId:any) {
 
    const userExists = await prisma.user.findUnique({
        where: {
          id: parseInt(userId,10)
        },
      });
      return userExists
}



export async function findUserByEmail(email:string) {
    const user = await prisma.user.findUnique({
        where: { email }
      });

      return user
}