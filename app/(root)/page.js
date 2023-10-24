import { UserButton } from "@clerk/nextjs";
import { fetchPosts } from "@/lib/actions/thread.actions";
import { auth } from '@clerk/nextjs';
import ThreadCard from "@/components/cards/ThreadCard";
import { redirect } from "next/navigation";

export default async function Home() {

  const result = await fetchPosts(1, 30);
  const { userId } = auth();
  if(!userId) redirect('/onboarding');
  return (
    <div>
      <h1 className="head-text text-left"> 
      Home
      </h1>
      
      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
        <>
          {result.posts.map(post => (
            <ThreadCard
              key={post._id}
              id={post._id}
              currentUserId={userId}
              parentId={post.parentId}
              content={post.text}
              author={post.author}
              community={post.community}
              createdAt={post.createdAt}
              comments={post.children}
            />
          ))}
        </>
        )}
      </section>
    </div>
  )
}