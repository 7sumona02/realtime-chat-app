'use client'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { auth, provider } from '@/app/firebase-config'
import {signInWithPopup} from 'firebase/auth'
import Cookies from 'universal-cookie'
const cookies = new Cookies();

export default function Auth(props) {
    const {setIsAuth} = props; 

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Sign in attempted with:', { email, password })
    // Here you would typically handle the sign-in logic
  }

  const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        cookies.set('auth-token', result.user.refreshToken);
        setIsAuth(true);
    } catch(err) {
        console.log('Error signing in with Google');
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Sign In</h1>
          <p className="text-sm text-gray-600">Welcome back! Please enter your details.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Enter your email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter your password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div> */}
          <Button type="submit" onClick={signInWithGoogle} className="w-full">Sign In</Button>
        </form>
        <div className="text-center text-sm">
          <a href="#" className="text-blue-600 hover:underline">Forgot password?</a>
        </div>
      </div>
    </div>
  )
}