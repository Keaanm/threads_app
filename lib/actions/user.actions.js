"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model"
import { connectToDB } from "../mongoose"
import Thread from "../models/thread.model";

export async function updateUser({userId, username, name, bio, image, path}){

    try {

        connectToDB();

        await User.findOneAndUpdate(
            {id: userId},
            {
                username: username.toLowerCase(),
                name,
                bio,
                image,
                onboarded: true,
            },
            {upsert: true}
        );
    
        if(path === '/profile/edit'){
            revalidatePath(path)
        }
    } catch (error) {
        console.log(error)
        throw new Error('Failed to create/update user')
    }
}

export async function fetchUser(id){
    try{
        connectToDB();

        const user = await User.findOne({id: id})
        
        return user
    }
    catch(e){
        throw new Error(`Failed to fetch User ${e}`)
    }
}

export async function fetchUserPosts(userId){
    try{
        connectToDB();

        const threads = await User.findOne({id: userId})
        .populate({
            path: 'threads',
            model: Thread,
            populate: {
                path: 'children',
                model: Thread,
                populate: {
                    path: 'author',
                    model: User,
                    select: 'name image id'
                }
            }
        });

        return threads;
    }
    catch(error){
        throw new Error(`Failed to fetch User Posts: ${error.message}`)
    }
}

export async function fetchUsers({
    userId,
    searchString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = "desc"
}){
    try{
        connectToDB();

        const skipAmount = (pageNumber - 1) * pageSize;

        const regex = new RegExp(searchString, 'i');

        const query = {
            id: {$ne: userId}
        }
        if(searchString.trim() !== ""){
            query.$or = [
                {username: {$regex: regex}},
                {name: {$regex: regex}}
            ]
        }
        const sortOptions = {createdAt: sortBy};

        const usersQuery = User.find(query)
        .sort(sortOptions)
        .skip(skipAmount)
        .limit(pageSize)

        const totalUserCount = await User.countDocuments(query);

        const users = await usersQuery.exec()

        const isNext = totalUserCount > skipAmount + users.length;

        return {users, isNext}
    }
    catch(errors){
        throw new Error(`Failed to fetch users: ${errors.message}`)
    }
}

export async function getActivity(userId){
    try {
        connectToDB();

        const userThreads = await Thread.find({author: userId})
        
        const childThreadIds = userThreads.reduce((acc, userThread) => {
            return acc.concat(userThread.children)
        }, [])
        
        const replies = await Thread.find({
            _id: {$in: childThreadIds},
            author: {$ne: userId}
        }).populate({
            path: 'author',
            model: User,
            select: 'name, image _id'
        })

        return replies;

    } catch (error) {
        throw new Error(`Failed to fetch activity: ${error.message}`)
    }
}