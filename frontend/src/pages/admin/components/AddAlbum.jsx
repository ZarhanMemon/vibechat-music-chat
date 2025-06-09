import React, { useState, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Upload } from "lucide-react"
import useMusicStore from '../../../store/useMusicStore'


function AddAlbum() {
  const { loading, addAlbum } = useMusicStore()

  const [newAlbum, setNewAlbum] = useState({
    title: '',
    artist: '',
    releaseYear: new Date().getFullYear(),
  })

  const [imageFile, setImageFile] = useState(null)
  const imageInputRef = useRef(null)
  const [albumDialogOpen, setAlbumDialogOpen] = useState(false)

  const handleSubmit = async () => {
    if (!imageFile || !newAlbum.title || !newAlbum.artist || !newAlbum.releaseYear) {
      alert("Please fill all required fields and select an image file.")
      return
    }

    try {
      const formData = new FormData()
      formData.append('imagefile', imageFile)
      formData.append('title', newAlbum.title)
      formData.append('artist', newAlbum.artist)
      formData.append('releaseYear', newAlbum.releaseYear.toString())

      await addAlbum(formData)

      setImageFile(null)
      setNewAlbum({ 
        title: '', 
        artist: '', 
        releaseYear: new Date().getFullYear() 
      })

      console.log("Album added successfully")
      setAlbumDialogOpen(false)
    } catch (error) {
      console.error("Failed to add album:", error)
    } finally {
      setAlbumDialogOpen(false)
    }
  }
  return (
    <Dialog open={albumDialogOpen} onOpenChange={setAlbumDialogOpen}>
      <DialogTrigger asChild>
        <Button className='bg-emerald-500 hover:bg-emerald-600 text-black'>
          <Plus className='mr-2 h-4 w-4' />
          Add Album
        </Button>
      </DialogTrigger>

      <DialogContent className='bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto'>
        <DialogHeader>
          <DialogTitle>Add New Album</DialogTitle>
          <DialogDescription>Add a new album to your music library</DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          {/* Hidden Image Input */}
          <input
            type='file'
            accept='image/*'
            ref={imageInputRef}
            hidden
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />

          {/* Image Upload Area */}
          <div
            onClick={() => imageInputRef.current?.click()}
            className='border-2 border-dashed border-zinc-700 rounded-lg p-6 cursor-pointer hover:border-emerald-500 transition-colors'
          >
            <div className='flex flex-col items-center justify-center gap-2'>
              <Upload className='h-8 w-8 text-zinc-500' />
              <p className='text-sm text-zinc-500'>
                {imageFile ? imageFile.name : 'Click to upload album cover'}
              </p>
            </div>
          </div>

          {/* Album Details */}
          <div className='grid gap-4'>
            <Input
              type='text'
              placeholder='Album Title'
              value={newAlbum.title}
              onChange={(e) =>
                setNewAlbum((prev) => ({ ...prev, title: e.target.value }))
              }
            />
            <Input
              type='text'
              placeholder='Artist Name'
              value={newAlbum.artist}
              onChange={(e) =>
                setNewAlbum((prev) => ({ ...prev, artist: e.target.value }))
              }
            />
            <Input
              type='number'
              placeholder='Release Year'
              value={newAlbum.releaseYear}
              onChange={(e) =>
                setNewAlbum((prev) => ({ ...prev, releaseYear: e.target.value }))
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            disabled={loading}
            onClick={handleSubmit}
            className='bg-emerald-500 hover:bg-emerald-600 text-black'
          >
            {loading ? 'Adding...' : 'Add Album'}          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddAlbum