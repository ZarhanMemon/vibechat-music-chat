import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useMusicStore from "../../../store/useMusicStore.js";
import { Music, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const AlbumsTable = () => {
  const { albums, deleteAlbum, fetchAlbums, loading, error } = useMusicStore();

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-zinc-400">Loading albums...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  const handleDelete = async (albumId) => {
    try {
      await deleteAlbum(albumId);
    } catch (err) {
      console.error("Failed to delete album:", err);
    }
  };

  return (
    <ScrollArea className="max-h-[70vh] w-full rounded-xl border border-zinc-700/50 bg-zinc-800/30 backdrop-blur-sm p-2">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-700/50 hover:bg-zinc-800/50">
            {/* Image */}
            <TableHead className="w-16 sm:w-20 text-zinc-400 font-medium">
              {/* Empty header for image */}
            </TableHead>

            {/* Title */}
            <TableHead className="text-zinc-400 font-medium">Title</TableHead>

            {/* Songs length */}
            <TableHead className="text-zinc-400 font-medium hidden md:block">Songs</TableHead>

            {/* Actions */}
            <TableHead className="text-zinc-400 font-medium">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {albums && albums.length > 0 ? (
            albums.map((album) => (
              <TableRow
                key={album._id}
                className="border-zinc-800/50 hover:bg-zinc-800/50 transition-colors"
              >
                {/* Image */}
                <TableCell className="w-16 sm:w-20">
                  <img
                    src={album.imgUrl || "https://via.placeholder.com/50"}
                    alt={album.title}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-md object-cover border border-zinc-700/50 flex-shrink-0"
                  />
                </TableCell>

                {/* Title */}
                <TableCell className="font-medium text-zinc-100 truncate flex flex-col max-w-xs">
                  {album.title}
				  <span className="text-sm block md:hidden text-zinc-400 mt-1">
					{album.songs.length || "0"} songs
					</span>
                </TableCell>

                {/* Songs length */}
                <TableCell className="hidden sm:table-cell">
                  <div className="text-zinc-400 flex items-center gap-2 whitespace-nowrap">
                    <Music className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    <span>{album.songs.length}</span>
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <Button
                    onClick={() => handleDelete(album._id)}
                    size="icon"
                    variant="ghost"
                    className="hover:bg-red-500/10 hover:text-red-400 text-zinc-400"
                    aria-label={`Delete album ${album.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-zinc-400">
                No albums available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default AlbumsTable;
