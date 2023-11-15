import { fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs"
import UserCard from "../cards/UserCard";
import { fetchCommunities } from "@/lib/actions/community.actions";

export default async function RightSidebar(){
    const user = await currentUser()
    if(!user) return null

    const similarMinds = await fetchUsers({
        userId: user.id,
        pageSize: 4,
      });

    const suggestedCommunities = await fetchCommunities({ pageSize: 4 });

    return(
        <section className="custom-scrollbar rightsidebar">
            <div className="flec flex-1 flex-col justify-start">
                <h3 className="text-heading4-medium text-light-1">
                    Suggested Communities
                </h3>
                <div className="className='mt-7 flex flex-col gap-10'">
                    {suggestedCommunities.length > 0 ? (
                        <>
                            {suggestedCommunities.communities.map(community => (
                                <UserCard
                                key={community.id}
                                id={community.id}
                                name={community.name}
                                username={community.username}
                                imgUrl={community.image}
                                personType='Community'
                              />
                            ))
                            }
                        </>
                    ) : (
                        <p className='!text-base-regular text-light-3'>
                            No suggested communities
                        </p>
                    )
                    }
                </div>
            </div>
            <div className="flec flex-1 flex-col justify-start">
                <h3 className="text-heading4-medium text-light-1">
                    Suggested Users
                </h3>
                <div className="className='mt-7 flex flex-col gap-10'">
                    {similarMinds.length > 0 ? (
                        <>
                            {similarMinds.users.map(user => (
                                <UserCard
                                key={user.id}
                                id={user.id}
                                name={user.name}
                                username={user.username}
                                imgUrl={user.image}
                                personType='User'
                              />
                            ))
                            }
                        </>
                    ) : (
                        <p className='!text-base-regular text-light-3'>
                            No suggested Users
                        </p>
                    )
                    }
                </div>
            </div>
        </section>
    )
}