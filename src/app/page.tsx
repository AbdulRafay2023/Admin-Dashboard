'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'

type Post = {
  id: number
  title: string
  body: string
}

export default function HomePage() {
  const { data: posts, isLoading, error } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts')
      return res.json()
    },
  })

  if (isLoading) return <div className="text-center py-10">🔄 Loading posts...</div>
  if (error) return <div className="text-center text-red-500 py-10">❌ Failed to load posts</div>

  return (
    <div className="h-auto md:[40 rem]  rounded-md  p-6">
      <h1 className="inline-block text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
        Home
      </h1>
      <Link href="/admin">
        <Button className=" text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Go to Admin page</Button>
      </Link>
      {posts?.slice(0, 10).map((post) => (
        <div key={post.id} className="border px-5 py-10 shadow-xl rounded-2xl  mt-11 bg-accent ">
          <Link href={`/posts/${post.id}`} className="text-blue-600 font-semibold hover:underline">
            {post.title}
          </Link>
          <p className="text-gray-600 mt-1">
            {post.body.substring(0, 100)}...
          </p>
        </div>
      ))}
    </div>
  )
}
