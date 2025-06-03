'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'

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
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">📚 Public Blog</h1>
      {posts?.slice(0, 10).map((post) => (
        <div key={post.id} className="border p-4 rounded shadow">
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
