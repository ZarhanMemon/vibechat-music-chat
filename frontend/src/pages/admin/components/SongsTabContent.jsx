import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Music } from "lucide-react";
import SongsTable from "./SongTable";
import AddSong from "./AddSong";

const SongsTabContent = () => {
	return (
		<Card className='bg-zinc-900/50 border-zinc-700/50 backdrop-blur-sm shadow-lg hover:shadow-emerald-500/5 transition-all duration-300'>
			<CardHeader>
				<div className='flex items-center justify-between'>
					<div>
						<CardTitle className='flex items-center gap-2 text-zinc-100'>
							<Music className='size-5 text-emerald-400' />
							Songs Library
						</CardTitle>
						<CardDescription className="text-zinc-400">Manage your music tracks</CardDescription>
					</div>
					<AddSong/>
				</div>
			</CardHeader>
			<CardContent>
				<SongsTable />
			</CardContent>
		</Card>
	);
};
export default SongsTabContent;