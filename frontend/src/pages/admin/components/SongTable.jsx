import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Trash2 } from "lucide-react";
import useMusicStore from "../../../store/useMusicStore";
import { ScrollArea } from "@/components/ui/scroll-area";

const SongTable = () => {
  const { allSongs, loading, error, fetchAllSongs, deleteSong } = useMusicStore();

  useEffect(() => {
    fetchAllSongs();
  }, [fetchAllSongs]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-zinc-400">Loading songs...</div>
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

  return (
    <ScrollArea className="h-full w-full rounded-xl border border-zinc-700/40 bg-zinc-900/30 backdrop-blur p-2">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-zinc-700/50">
            <TableHead className="w-[50px] text-zinc-400 font-semibold" />
            <TableHead className="text-zinc-400 font-semibold">Title</TableHead>
            <TableHead className="hidden sm:table-cell text-zinc-400 font-semibold">Artist</TableHead>
            <TableHead className="hidden sm:table-cell text-zinc-400 font-semibold text-xs sm:text-sm">Release Date</TableHead>
            <TableHead className="text-zinc-400 font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {allSongs && allSongs.length > 0 ? (
            allSongs.map((song) => (
              <TableRow
                key={song._id}
                className="border-b border-zinc-800/50 hover:bg-zinc-800/40 transition-all"
              >
                <TableCell>
                  <img
                    src={song.imgUrl}
                    alt={song.title || "Song cover"}
                    onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                    className="size-10 rounded-md object-cover border border-zinc-700/50"
                  />
                </TableCell>
                <TableCell className="font-medium text-zinc-100 truncate max-w-[150px]">{song.title}</TableCell>
                <TableCell className="hidden sm:table-cell text-zinc-400 truncate max-w-[120px]">{song.artist}</TableCell>
                <TableCell className="hidden sm:flex  text-zinc-400  items-center gap-1 whitespace-nowrap text-xs sm:text-sm">
                  <Calendar className="h-3 w-3 text-emerald-400" />
                  {new Date(song.createdAt).toLocaleDateString(undefined, {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => deleteSong(song._id)}
                    size="icon"
                    variant="ghost"
                    className="hover:bg-red-500/10 hover:text-red-400 text-zinc-400 transition-all"
                    aria-label="Delete song"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-zinc-500 py-6">
                No songs available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default SongTable;
