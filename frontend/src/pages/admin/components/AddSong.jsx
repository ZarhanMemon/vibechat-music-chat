import React, { useState, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter, // ✅ Fixed: Added missing import
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Plus, Upload } from "lucide-react"
import useMusicStore from '../../../store/useMusicStore'

function AddSong() {
  const { loading, addSong, albums } = useMusicStore()

  const [NewSong, setNewSong] = useState({
    title: '',
    artist: '',
    duration: "0",
    album: "none",
  })

  const [files, setFiles] = useState({
    audio: null,
    image: null,
  })

  const audioInputRef = useRef(null)
  const imageInputRef = useRef(null)

  const [songDialogOpen, setSongDialogOpen] = useState(false)

  const handleSubmit = async () => {
    if (!files.audio || !NewSong.title || !NewSong.artist || !files.image) {
      alert("Please fill all required fields and select both audio and image files.")
      return
    }

    try {
      const formData = new FormData()
      formData.append('audiofile', files.audio)
      formData.append('imagefile', files.image)
      formData.append('title', NewSong.title)
      formData.append('artist', NewSong.artist)
      formData.append('duration', NewSong.duration.toString())

      if (NewSong.album && NewSong.album !== 'none') {
        formData.append('albumId', NewSong.album)
      }

      formData.append("audiofile", files.audio);
	  formData.append("imagefile", files.image);

      await addSong(formData)

      setFiles({ audio: null, image: null })
      setNewSong({ title: '', artist: '', duration: "0", album: 'none' })

      console.log("Song added successfully")

      setSongDialogOpen(false)
    } catch (error) {
      console.error("Failed to add song:", error)
    } finally {
      setSongDialogOpen(false)
    }
  }

  return (
    <Dialog open={songDialogOpen} onOpenChange={setSongDialogOpen}>
      <DialogTrigger asChild>
        <Button className='bg-emerald-500 hover:bg-emerald-600 text-black'>
          <Plus className='mr-2 h-4 w-4' />
          Add Song
        </Button>
      </DialogTrigger>

      <DialogContent className='bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto'>
        <DialogHeader>
          <DialogTitle>Add New Song</DialogTitle>
          <DialogDescription>Add a new song to your music library</DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          {/* Hidden Inputs */}
          <input
            type='file'
            accept='audio/*'
            ref={audioInputRef}
            hidden
            onChange={(e) =>
              setFiles((prev) => ({
                ...prev,
                audio: e.target.files?.[0] || null,
              }))
            }
          />
          <input
            type='file'
            accept='image/*'
            ref={imageInputRef}
            hidden
            onChange={(e) =>
              setFiles((prev) => ({
                ...prev,
                image: e.target.files?.[0] || null,
              }))
            }
          />

          {/* Image Upload Area */}
          <div
            className='flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer'
            onClick={() => imageInputRef.current?.click()}
          >
            <div className='text-center'>
              {files.image ? (
                <>
                  <div className='space-y-2'>
                    <div className='text-sm text-emerald-500'>Image selected:</div>
                    <div className='text-xs text-zinc-400'>{files.image.name.slice(0, 20)}</div>
                    <img
                      src={URL.createObjectURL(files.image)}
                      alt='preview'
                      className='w-20 h-20 object-cover rounded mx-auto mt-2'
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className='p-3 bg-zinc-800 rounded-full inline-block mb-2'>
                    <Upload className='h-6 w-6 text-zinc-400' />
                  </div>
                  <div className='text-sm text-zinc-400 mb-2'>Upload artwork</div>
                  <Button variant='outline' size='sm' className='text-xs'>
                    Choose File
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Audio Upload */}
          <div className='space-y-2'>
            <label htmlFor='audio' className='text-sm font-medium'>Audio File</label>
            <Button
              variant='outline'
              onClick={() => audioInputRef.current?.click()}
              className='w-full'
            >
              {files.audio ? files.audio.name.slice(0, 20) : "Choose Audio File"}
            </Button>
          </div>

          {/* Title Input */}
          <div className='space-y-2'>
            <label htmlFor='title' className='text-sm font-medium'>Title</label>
            <Input
              id='title'
              value={NewSong.title}
              onChange={(e) => setNewSong({ ...NewSong, title: e.target.value })}
              className='bg-zinc-800 border-zinc-700'
            />
          </div>

          {/* Artist Input */}
          <div className='space-y-2'>
            <label htmlFor='artist' className='text-sm font-medium'>Artist</label>
            <Input
              id='artist'
              value={NewSong.artist}
              onChange={(e) => setNewSong({ ...NewSong, artist: e.target.value })}
              className='bg-zinc-800 border-zinc-700'
            />
          </div>

          {/* Duration Input */}
          <div className='space-y-2'>
            <label htmlFor='duration' className='text-sm font-medium'>Duration (seconds)</label>
            <Input
              id='duration'
              type='number'
              min='0'
              value={NewSong.duration}
              onChange={(e) => setNewSong({ ...NewSong, duration: e.target.value || "0" })}
              className='bg-zinc-800 border-zinc-700'
            />
          </div>

          {/* Album Select */}
          <div className='space-y-2'>
            <label htmlFor='album' className='text-sm font-medium'>Album (Optional)</label>
            <Select
              value={NewSong.album}
              onValueChange={(value) => setNewSong({ ...NewSong, album: value })}
            >
              <SelectTrigger className='bg-zinc-800 border-zinc-700'>
                <SelectValue placeholder='Select album' />
              </SelectTrigger>
              <SelectContent className='bg-zinc-800 border-zinc-700'>
                <SelectItem value='none'>No Album (Single)</SelectItem>
                {albums.map((album) => (
                  <SelectItem key={album._id} value={album._id}>
                    {album.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => setSongDialogOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Uploading..." : "Add Song"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddSong
