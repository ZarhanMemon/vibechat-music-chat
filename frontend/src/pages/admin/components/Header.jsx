import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Disc3 } from "lucide-react";

const Header = () => {
	return (<div className='flex items-center justify-between py-6 px-4 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-xl shadow-lg'>
		<div className='flex items-center gap-4'>
			<Link to='/' className='rounded-lg hover:opacity-80 transition-all duration-300 hover:scale-105'>
				<img
					src='/music.png'
					alt="Logo"
					className='w-12 h-12 object-contain'
				/>

			

			</Link>

				<div className='flex flex-col'>
					<h1 className='text-2xl font-bold leading-none bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent'>
						Music Manager
					</h1>
					<p className='text-sm hidden md:block text-zinc-400 mt-1'>Manage your music catalog</p>
				</div>

		</div>
		<div className='flex items-center gap-4'>
			<Link to="/" className="hidden md:inline-block">
				<Button variant="outline" size="sm" className="gap-2">
					<Disc3 className="w-4 h-4" />
					Home Panel
				</Button>
			</Link>				
			<UserButton afterSignOutUrl='/' />
		</div>
	</div>
	);
};
export default Header;