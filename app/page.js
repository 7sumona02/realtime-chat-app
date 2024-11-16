'use client'

import Auth from '@/components/Auth'
import React, { useState, useRef } from 'react'
import Cookies from 'universal-cookie'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './firebase-config'

const cookies = new Cookies();

const Page = () => {
  const [isAuth, setIsAuth] = useState(cookies.get('auth-token'));
  const [room, setRoom] = useState('');

  const [newMessage, setNewMessage] = useState('');

  const messagesRef = collection(db, 'messages');
  
  const roomInputRef = useRef(null);

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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {room ? (
        <Card className="w-full max-w-md" room={room}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Chat Room: {room}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <input placeholder='msg here' onChange={(e) => setNewMessage(e.target.value)} value={newMessage} />
              <button>send</button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Enter Chat Room</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <label htmlFor="room-input" className="block text-sm font-medium text-gray-700">
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
    </div>
  );
}

export default Page;