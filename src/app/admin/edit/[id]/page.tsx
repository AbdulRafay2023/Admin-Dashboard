'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Button } from '@/components/ui/button'


export default function EditPostPage() {
    const { id } = useParams()
    const router = useRouter()

    const [title, setTitle] = useState('')
    const [loading, setLoading] = useState(true)

    // Tiptap editor
    const editor = useEditor({
        extensions: [StarterKit],
        content: '',
    })

    // Fetch post
    useEffect(() => {
        const fetchPost = async () => {
            const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
            const data = await res.json()
            setTitle(data.title)
            editor?.commands.setContent(data.body)
            setLoading(false)
        }
        fetchPost()
    }, [id, editor])

    // Update post
    const handleUpdate = async () => {
        const body = editor?.getHTML() || ''

        if (!title || !body) {
            alert('Please fill in both fields')
            return
        }

        await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, title, body, userId: 1 }),
        })

        alert('✅ Post updated!')
        router.push('/admin')
    }

    if (loading) return <p>Loading...</p>

    return (
        <div className="p-4">
            <div className="absolute top-4 right-4">
                <button
                    className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    onClick={() => router.back()}
                >
                    Back
                </button>
            </div>
            <h1 className="inline-block text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                ✏️ Edit Post
            </h1>
            <input
                className="border p-2 w-full mb-4"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post title"
            />
            <div className="border p-2 mb-4 rounded">
                <EditorContent editor={editor} />
            </div>
            <button
                onClick={handleUpdate}
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                Update Post
            </button>
        </div>
    )
}
