import UserCard from '@/components/cards/UserCard';
import {fetchUser, fetchUsers } from '@/lib/actions/user.actions';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const Page = async () => {

    const { userId } = auth();
    if(!userId) return null;
    const userInfo = await fetchUser(userId);
    console.log(userInfo);
    if(!userInfo?.onboarded) redirect('/onboarding');

    const result = await fetchUsers({
        userId: userId,
        searchString: '',
        pageNumber: 1,
        pageSize: 25
    })
  return (
    <section>
        <h1 className='head-text mb-10'>Search</h1>


        <div className='mt-14 flex flex-col gap-9'>
            {result.users.length === 0 ? (
                <p className='no-result'>No users</p>)
                : (
                    <>
                    {result.users.map(person => (
                        <UserCard
                        key={person.id}
                        id={person.id}
                        name={person.name}
                        username={person.username}
                        imgUrl={person.image}
                        personType="User"
                        />
                    ))}
                    </>
                )
            }
        </div>
    </section>
  )
}

export default Page