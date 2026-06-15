import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginSchema } from '@/lib/validation'
import { useAuth } from '@/contexts/AuthContext'
import { Layout } from '@/components/layout/Layout'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ErrorMessage } from '@/components/ui/ErrorMessage'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from
    ?.pathname
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (values: LoginSchema) => {
    setIsLoading(true)
    setError('')
    try {
      await login(values)
      navigate(from || '/', { replace: true })
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Invalid email or password'
      setError(message)
      setIsLoading(false)
    }
  }

  return (
    <Layout title="Log in">
      <div className="page-container flex justify-center">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <h1 className="page-title">Welcome back</h1>
            <p className="mt-1 text-ink-dim">
              Log in to share projects and join discussions.
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
              Log in
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-ink-dim">
            Don't have an account?{' '}
            <Link
              to="/register"
              state={location.state}
              className="text-brand-cyan hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  )
}
