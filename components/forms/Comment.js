"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {useForm} from 'react-hook-form'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { usePathname, useRouter } from "next/navigation"

import { addCommentToThread } from "@/lib/actions/thread.actions"
import { CommentValidation } from "@/lib/validations/thread"
import Image from "next/image"

export default function Comment({threadId, currentUserImg, currentUserId}){
    const pathname = usePathname()

    const form = useForm({
        resolver: zodResolver(CommentValidation), 
        defaultValues: {
            comment: '',
        }
    })
    const onSubmit = async (values) => {

        await addCommentToThread(threadId, values.thread, JSON.parse(currentUserId), pathname);

        form.reset();
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
                <FormField
                control={form.control}
                name="thread"
                render={({ field }) => (
                    <FormItem className="flex items-center w-full gap-3">
                        <FormLabel>
                            <Image 
                            src={currentUserImg}
                            alt="Profile image"
                            width={48}
                            height={48}
                            className="rounded-full object-cover"
                            />  
                        </FormLabel>
                        <FormControl className="border-none bg-transparent">
                        <Input 
                        type="text"
                        placeholder="Comment..."
                        className="no-focus text-light-1 outline-none"
                        {...field}
                        /> 
                        </FormControl>
                    </FormItem>
                    )}
                />
                <Button type="submit" className="comment-form_btn">Reply</Button>
            </form>
        </Form>
    )
}