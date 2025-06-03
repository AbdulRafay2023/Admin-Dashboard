'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

type Post = {
  id: number
  title: string
  body: string
}

export default function PostDetailsPage() {
  const params = useParams()
  const postId = params.id as string

  const { data: post, isLoading, error } = useQuery<Post>({
    queryKey: ['post', postId],
    queryFn: async () => {
      const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
      return res.json()
    },
    enabled: !!postId, // only run when postId exists
  })

  if (isLoading) return <div className="text-center py-10">🔄 Loading posts...</div>
  if (error) return <div className="text-center text-red-500 py-10">❌ Failed to load posts</div>
  if (!post) return <div className="text-center text-gray-500 py-10">⚠️ Post not found</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">📝 {post.title}</h1>
      <p className="text-gray-700">{post.body}</p>
    </div>
  )
}
