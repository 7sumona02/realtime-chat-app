'use client'
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { auth, provider } from '@/app/firebase-config';
import { signInWithPopup } from 'firebase/auth';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default function Auth(props) {
    const { setIsAuth } = props; 
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            console.log('User signed in:', result.user);
            cookies.set('auth-token', result.user.refreshToken);
            setIsAuth(true);
        } catch(err) {
            console.error('Error signing in with Google:', err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-md">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Sign In</h1>
                    <p className="text-sm text-gray-600">Welcome back! Please enter your details.</p>
                </div>
                <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                    <Button type="button" onClick={signInWithGoogle} className="w-full">Sign In with Google</Button>
                </form>
                <div className="text-center text-sm">
                    <a href="#" className="text-blue-600 hover:underline">Forgot password?</a>
                </div>
            </div>
        </div>
    );
}