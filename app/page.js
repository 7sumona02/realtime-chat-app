'use client'

import Auth from '@/components/Auth'
import React, { useState, useRef, useEffect } from 'react'
import Cookies from 'universal-cookie'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where } from 'firebase/firestore'
import { auth, db } from './firebase-config'
import { SendIcon } from 'lucide-react'
import { signOut } from 'firebase/auth'
import './page.css'

const cookies = new Cookies();

const Page = () => {
  const [isAuth, setIsAuth] = useState(cookies.get('auth-token'));
  const [room, setRoom] = useState('');

  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const messagesRef = collection(db, 'messages');

  useEffect(() => {
    if (!room) return; 

    const queryMessages = query(messagesRef, where('room', '==', room), orderBy('createdAt'));
    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });

    return () => unsubscribe();
  }, [room]);
  
  const roomInputRef = useRef(null);

  const signUserOut = async () => {
    await signOut(auth);
    cookies.remove('auth-token');
    setIsAuth(false);
    setRoom(null);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(newMessage === "") return;

    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: auth.currentUser.displayName,
      room,
    });

    setNewMessage('');
  }

  if (!isAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Auth setIsAuth={setIsAuth} />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-10 items-center justify-center h-screen bg-gradient-to-b from-white to-[#ece9ff]">
      {room ? (
        <Card className="w-[90vw] min-h-[80vh] bg-white/30 rounded-2xl border-2 border-neutral-200 glass-card shadow-none" room={room}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Chat Room: {room}</CardTitle>
          </CardHeader>
          <CardContent>
  <div className="messages-container">
    {messages.map((message) => (
      <div key={message.id}>
        <span className='font-semibold'>{message.user}</span>{" "}
        {message.text}
      </div>
    ))}
  </div>
  <form onSubmit={handleSubmit} className="flex items-center space-x-2 p-1 bg-white rounded-full absolute bottom-5 right-0 left-0 w-[80vw] mx-auto">
    <Input
      type="text"
      placeholder="Type your message here..."
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      className="flex-grow rounded-full h-12 border-none shadow-none"
    />
    <Button type="submit" size="icon" className='h-12 w-12 bg-[#ece9ff] hover:bg-[#ece9ff]/90 shadow-none rounded-full' disabled={!newMessage.trim()}>
      <SendIcon className="h-4 w-4 text-black" />
      <span className="sr-only">Send message</span>
    </Button>
  </form>
</CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-md bg-white/30 rounded-2xl border-2 border-neutral-200 glass-card shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Enter Chat Room</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <label htmlFor="room-input" className="block text-sm font-medium text-[#272727]">
                Enter Room Name
              </label>
              <Input 
                id="room-input"
                ref={roomInputRef}
                placeholder="Room name"
                className="w-full"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => setRoom(roomInputRef.current.value)}
              className="w-full"
            >
              Enter Chat
            </Button>
          </CardFooter>
        </Card>
      )}
      <div>
        <Button onClick={signUserOut}>Sign Out</Button>
      </div>
    </div>
  );
}

export default Page;