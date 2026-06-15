import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterSchema } from '@/lib/validation'
import { useAuth } from '@/contexts/AuthContext'
import { Layout } from '@/components/layout/Layout'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ErrorMessage } from '@/components/ui/ErrorMessage'

export function RegisterPage() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (values: RegisterSchema) => {
    setIsLoading(true)
    setError('')
    try {
      await registerUser(values)
      navigate('/', { replace: true })
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Failed to create account'
      setError(message)
      setIsLoading(false)
    }
  }

  return (
    <Layout title="Sign up">
      <div className="page-container flex justify-center">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <h1 className="page-title">Create account</h1>
            <p className="mt-1 text-ink-dim">
              Join the FlashDev indie game community.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <ErrorMessage message={error} />

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              {...register('email')}
              error={errors.email?.message}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              error={errors.password?.message}
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
            >
              Sign up
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-ink-dim">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-cyan hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  )
}
