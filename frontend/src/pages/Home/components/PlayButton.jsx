import { Button } from "@/components/ui/button";
import usePlayerStore from "@/store/usePlayerStore";
import { Pause, Play } from "lucide-react";


const PlayButton = ({ song }) => {
	const { currentSong, isPlaying, setCurrentSong, togglePlayPause } = usePlayerStore();
	const isCurrentSong = currentSong?._id === song._id;

	const handlePlay = (e) => {
		e.stopPropagation();
		if (isCurrentSong) togglePlayPause();
		else setCurrentSong(song);
	};

	return (<Button
		size="icon"
		onClick={handlePlay}
		className={`w-9 h-9  rounded-full bg-green-500 hover:bg-green-500 hover:scale-105 transition-all duration-300
				${isCurrentSong ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
	>			{isCurrentSong && isPlaying ? (
		<Pause className='h-5 w-5 text-black' />
	) : (
		<Play className='h-5 w-5 text-black' />
	)}
	</Button>
	);
};
export default PlayButton;