import { axiosInstance } from "@/lib/axios";
import useAuthStore from "@/store/useAuthStore";
import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import useUserStore from "../store/useUserStore";

const updateApiToken = (token) => {
	if (token) axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
	else delete axiosInstance.defaults.headers.common["Authorization"];
};

const AuthProvider = ({ children }) => {
	const { getToken, userId } = useAuth();
	const [loading, setLoading] = useState(true);
	const { checkAdminStatus } = useAuthStore();

	const {initSocket , disconnectSocket} = useUserStore()

	useEffect(() => {
		const initAuth = async () => {
			try {
				const token = await getToken();
				updateApiToken(token);
				if (token) {
					await checkAdminStatus();

				}

				if(userId) initSocket(userId);  // Initialize socket connection with userId
	

			} catch (error) {
				updateApiToken(null);
				console.log("Error in auth provider", error);
			} finally {
				setLoading(false);
			}
		};

		initAuth();

		// clean up
		return () => {
			disconnectSocket();  // Disconnect socket when component unmounts
			
			// Clear the token from axios headers
			updateApiToken(null);
		};

	}, [getToken, userId, checkAdminStatus]);

	if (loading)
		return (
			<div className='h-screen w-full flex items-center justify-center'>
				<Loader className='size-8 text-emerald-500 animate-spin' />
			</div>
		);

	return <>{children}</>;
};
export default AuthProvider;