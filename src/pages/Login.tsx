import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LoginForm } from '@/components/LoginForm'
import { SignUpForm } from '@/components/SignUpForm'

export default function Login() {
  const [showSignUp, setShowSignUp] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {showSignUp ? (
          <SignUpForm onLoginClick={() => setShowSignUp(false)} />
        ) : (
          <LoginForm onSignUpClick={() => setShowSignUp(true)} />
        )}
        
        <div className="mt-4 text-center">
          <Link 
            to="/" 
            className="text-sm text-muted-foreground hover:text-primary underline underline-offset-4"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}