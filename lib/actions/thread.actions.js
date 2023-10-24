"use server"

import { revalidatePath } from "next/cache";
import { connectToDB } from "../mongoose";
import User from "../models/user.model";
import Thread from "../models/thread.model";

export async function createThread({text, author, communityId, path}){
    try {
        connectToDB();

        const createdThread = await Thread.create({
            text,
            author,
            community: null,
        });

        await User.findByIdAndUpdate(author, {
            $push: {threads: createdThread._id}
        })

        revalidatePath(path);
    } catch (error) {
        throw new Error(`Error creating thread: ${error.message}`)
    }
}

export async function fetchPosts(pageNumber, pageSize){
    try{
        connectToDB();

        const skipAmount = (pageNumber - 1) * pageSize

        const postsQuery = Thread.find({parentId: {$in: [null, undefined]}})
            .sort({createdAt: 'desc'})
            .skip(skipAmount)
            .limit(pageSize)
            .populate({path: 'author', model: User})
            .populate({
                path: 'children',
                populate: {
                    path: 'author',
                    model: User,
                    select: "_id name parentId image"
                }
            });

            const totalPostsCount = await Thread.countDocuments({parentId: {$in: 
            [null, undefined]}});

            const posts = await postsQuery.exec();

            const isNext = totalPostsCount > skipAmount + posts.length;

            return {posts, isNext}
    }
    catch(error){
        throw new Error(`Error fetching posts: ${error.message}`)
    }
}

export async function fetchThreadById(id){
    try{
        connectToDB();

        //Populate community
        const thread = await Thread.findById(id)
        .populate({
            path: 'author',
            model: User,
            select: "_id id name image"
        })
        .populate({
            path: 'children',
            populate: [
                {
                path: 'author',
                model: User,
                select: "_id id name parentId image"
                },
                {
                path: 'children',
                model: Thread,
                populate: {
                    path: 'author',
                    model: User,
                    select: "_id id name parentId image"
                }
                }
            ]
        }).exec()

        return thread;
    }
    catch(error){
        throw new Error(`Failed to fetch Thread: ${error.message}`)
    }
}

export async function addCommentToThread(threadId, commentText, userId, path){
    try{
        connectToDB();

        const originalThread = await Thread.findById(threadId);

        if(!originalThread) throw new Error("Thread not Found");

        const commentThread = new Thread({
            text: commentText,
            author: userId,
            parentId: threadId
        });

       const savedCommonThread = await commentThread.save();
       
       originalThread.children.push(savedCommonThread._id);

       await originalThread.save();

       revalidatePath(path);
    }
    catch(error){
        throw new Error()
    }
}

