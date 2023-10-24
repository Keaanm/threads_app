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
import { Textarea } from "@/components/ui/textarea"
import { usePathname, useRouter } from "next/navigation"

import { createThread } from "@/lib/actions/thread.actions"
import { ThreadValidation } from "@/lib/validations/thread"

export default function PostThread({userId}){

    const router = useRouter()
    const pathname = usePathname()

    const form = useForm({
        resolver: zodResolver(ThreadValidation), 
        defaultValues: {
            thread: '',
            accountId: userId
        }
    })
    const onSubmit = async (values) => {

        await createThread({
            text: values.thread,
            author: userId,
            communityId: null,
            path: pathname
        });

        router.push("/")
    }
    return(
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 justify-start gap-10 mt-10">
          <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
          <FormItem className="flex flex-col w-full gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Content  
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
              <Textarea
              rows={15} 
              type="text"
              {...field}
              /> 
              </FormControl>
              <FormMessage/>
          </FormItem>
          )}
          />
          <Button type="submit" className="bg-primary-500">Post Thread</Button>
        </form>
      </Form>
    )
}