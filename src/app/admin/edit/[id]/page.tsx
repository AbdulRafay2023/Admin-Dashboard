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
                <Button
                    variant="outline"
                    className="bg-white shadow-sm hover:bg-blue-400 cursor-pointer transition"
                    onClick={() => router.back()}
                >
                Back
                </Button>
            </div>
            <h1 className="text-xl font-bold mb-4">Edit Post (Rich Text)</h1>
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
