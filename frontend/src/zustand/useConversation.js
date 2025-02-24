import { create } from "zustand";

const useConversation = create((set, get) => ({
	selectedConversation: null,
	setSelectedConversation: (selectedConversation) => set({ selectedConversation }),

	messages: [],
	setMessages: (messages) => set({ messages }),

	// ✅ Only add messages if they belong to the currently selected conversation
	addMessage: (newMessage) => {
		const { selectedConversation, messages } = get();
		if (
			selectedConversation &&
			(newMessage.senderId === selectedConversation._id || newMessage.receiverId === selectedConversation._id)
		) {
			set({ messages: [...messages, newMessage] });
		}
	},
}));

export default useConversation;
