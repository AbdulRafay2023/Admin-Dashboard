'use client'

import { useQuery } from '@tanstack/react-query'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type post = {
  id: number
  title: string
  body: string

}

export default function AdminPage() {

  const { data: posts, isLoading, error } = useQuery<post[]>({
    queryKey: ['post'],
    queryFn: async () => {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts')
      return res.json()
    },

  })
  const queryClient = useQueryClient()
  const deletePost = useMutation({
    mutationFn: async (id: number) => {
      // Call DELETE API
      await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: 'DELETE',
      })
    },
    onSuccess: () => {
      // Refresh the posts list after delete
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      alert('Post deleted successfully!')
    },
  })


  if (isLoading) return <div className="text-center py-10">🔄 Loading posts...</div>
  if (error) return <div className="text-center text-red-500 py-10">❌ Failed to load posts</div>

  return (
    <>
      <div className='max-w-6xl mx-auto p-6 space-y-4'>
        <h1 className='text-2xl font-bold mb-4'>Admin All post</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {posts?.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-4">
                <h2 className="font-semibold text-lg">{post.title}</h2>
                <p className="text-gray-600 text-sm mt-1">
                  {post.body.slice(0, 80)}...
                </p>
                <Link href={`/admin/edit/${post.id}`}
                  className="text-blue-600 underline mt-2 block">
                  Edit
                </Link>
                <button className='bg-red-500 px-2 py-1 mt-2 text-white rounded-2xl'
                  onClick={() => {
                    const confirmDelete = confirm('Are you sure you want to delete this post?')
                    if (confirmDelete) {
                      deletePost.mutate(post.id)
                    }
                  }}
                >
                  Delete
                </button>

              </CardContent>
            </Card>
          ))}
        </div>

        <Link href="/admin/create">
          <Button className='mb-4'>Create new Post</Button>
        </Link>
      </div>
    </>
  )
}