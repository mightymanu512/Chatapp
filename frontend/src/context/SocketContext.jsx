import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import useConversation from "../zustand/useConversation"; // ✅ Import Zustand store
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const { authUser } = useAuthContext();
	const { selectedConversation, addMessage } = useConversation(); // ✅ Use Zustand store

	useEffect(() => {
		if (authUser) {
			const socket = io("https://chat-app-yt.onrender.com", {
				query: {
					userId: authUser._id,
				},
			});

			setSocket(socket);

			// ✅ Handle online users
			socket.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
			});

			// ✅ Listen for new messages (only update correct chat)
			socket.on("newMessage", (newMessage) => {
				if (
					selectedConversation &&
					(newMessage.senderId === selectedConversation._id || newMessage.receiverId === selectedConversation._id)
				) {
					addMessage(newMessage);
				}
			});

			return () => socket.close();
		} else {
			if (socket) {
				socket.close();
				setSocket(null);
			}
		}
	}, [authUser, selectedConversation, addMessage]); // ✅ Add dependencies

	return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};
