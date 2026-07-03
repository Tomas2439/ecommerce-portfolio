'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        if (isLogin) {
            const { error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) {
                toast.error(error.message)
            } else {
                toast.success('Sesión iniciada')
                router.push('/productos')
                router.refresh()
            }
        } else {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { full_name: fullName } },
            })
            if (error) {
                toast.error(error.message)
            } else {
                toast.success('Cuenta creada. Revisá tu email para confirmar.')
            }
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>{isLogin ? 'Iniciar sesión' : 'Crear cuenta'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {!isLogin && (
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="fullName">Nombre completo</Label>
                                <Input
                                    id="fullName"
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                    placeholder="Juan Pérez"
                                    required
                                />
                            </div>
                        )}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="tu@email.com"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Cargando...' : isLogin ? 'Ingresar' : 'Registrarse'}
                        </Button>
                    </form>
                    <p className="text-sm text-center text-muted-foreground mt-4">
                        {isLogin ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}{' '}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="underline hover:text-foreground"
                        >
                            {isLogin ? 'Registrate' : 'Iniciá sesión'}
                        </button>
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}