'use client'

import { useQuery } from '@tanstack/react-query'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { BackgroundGradient } from "@/components/ui/background-gradient";
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
  const router = useRouter()

  if (isLoading) return <div className="text-center py-10">🔄 Loading posts...</div>
  if (error) return <div className="text-center text-red-500 py-10">❌ Failed to load posts</div>

  return (
    <>
      <div className='max-w-6xl mx-auto p-6 space-y-4'>
        <h1 className=' inline-block text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'>All posts</h1>
        <div className=" top-4 right-4">
          <button
            className="absolute top-4 right-4 hover:cursor-pointer text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            onClick={() => router.back()}
          >
            Back
          </button>
        </div>
        <Link href="/admin/create">
          <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create New Post</button>
        </Link>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {posts?.map((post) => (
            <BackgroundGradient key={post.id}>
              <Card >
                <CardContent className="p-4">
                  <h2 className="font-semibold text-lg">{post.title}</h2>
                  <p className="text-gray-600 text-sm mt-1 mb-5">
                    {post.body.slice(0, 80)}...
                  </p>
                  <Link href={`/admin/edit/${post.id}`}
                    className="text-blue-600 underline mt-6 mr-3 hover:cursor-pointer ">
                    <Button>Edit</Button>
                  </Link>
                  <Button variant="destructive" className='hover:cursor-pointer'
                    onClick={() => {
                      const confirmDelete = confirm('Are you sure you want to delete this post?')
                      if (confirmDelete) {
                        deletePost.mutate(post.id)
                      }
                    }}
                  >
                    Delete
                  </Button>

                </CardContent>
              </Card>
            </BackgroundGradient>
          ))}
        </div>


      </div>
    </>
  )
}