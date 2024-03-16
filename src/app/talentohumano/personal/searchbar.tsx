import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Search } from "lucide-react";

export default function SearchBar() {
	return (
		<form className='flex flex-row gap-2'>
			<Input type='text' placeholder='Buscar' className='w-full' />
			<Button
				type='submit'
				className='absolute right-12 mr-1 h-10 w-12 bg-transparent text-current hover:bg-transparent'
			>
				<Search className='' />
			</Button>
		</form>
	);
}
