import { useState, FormEvent, useEffect } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter, Input, Label, Alert, AlertTitle, AlertDescription } from "./ui";
import { authManager, type LoginCredentials, type RegisterCredentials } from "../lib/auth";
import { useFormValidation, formValidations, validationUtils } from "../lib/validation";

interface AuthScreenProps {
    onLoginSuccess: () => void;
}

export default function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
    const [authView, setAuthView] = useState<'login' | 'register'>('login');
    const [authForm, setAuthForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    
    const { validateField, clearErrors } = useFormValidation();

    // Verificar si ya está autenticado
    useEffect(() => {
        const unsubscribe = authManager.subscribe((state) => {
            if (state.isAuthenticated && !state.isLoading) {
                onLoginSuccess();
            }
        });
        
        return unsubscribe;
    }, [onLoginSuccess]);

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};
        
        if (authView === 'register') {
            // Validar nombre
            const nameError = validateField('name', authForm.name, formValidations.register.name);
            if (nameError) errors.name = nameError;
            
            // Validar email
            const emailError = validateField('email', authForm.email, formValidations.register.email);
            if (emailError) errors.email = emailError;
            
            // Validar contraseña
            const passwordError = validateField('password', authForm.password, formValidations.register.password);
            if (passwordError) errors.password = passwordError;
            
            // Validar confirmación de contraseña
            const confirmPasswordError = validateField('confirmPassword', authForm.confirmPassword, formValidations.register.confirmPassword);
            if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
            
            // Validar que las contraseñas coincidan
            const passwordsMatchError = validationUtils.passwordsMatch(authForm.password, authForm.confirmPassword);
            if (passwordsMatchError) errors.confirmPassword = passwordsMatchError;
        } else {
            // Validar email
            const emailError = validateField('email', authForm.email, formValidations.register.email);
            if (emailError) errors.email = emailError;
            
            // Validar contraseña
            const passwordError = validateField('password', authForm.password, formValidations.register.password);
            if (passwordError) errors.password = passwordError;
        }
        
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAuthSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        clearErrors();
        
        if (!validateForm()) {
            return;
        }
        
        setIsLoading(true);

        try {
            if (authView === 'register') {
                const credentials: RegisterCredentials = {
                    name: authForm.name,
                    email: authForm.email,
                    password: authForm.password
                };
                
                await authManager.register(credentials);
            } else {
                const credentials: LoginCredentials = {
                    email: authForm.email,
                    password: authForm.password
                };
                
                await authManager.login(credentials);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error de autenticación');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
            <div className="w-full max-w-md">
                <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="space-y-6 pb-8">
                        <div className="text-center space-y-2">
                            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
                                <span className="text-2xl font-bold text-white">S4</span>
                            </div>
                            <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                {authView === 'login' ? 'Bienvenido de Vuelta' : 'Crear Cuenta'}
                            </CardTitle>
                            <CardDescription className="text-center text-gray-600 text-lg">
                                {authView === 'login'
                                    ? 'Inicia sesión en tu viaje fitness'
                                    : 'Comienza tu viaje fitness personalizado'}
                            </CardDescription>
                        </div>
                    </CardHeader>
                <CardContent className="px-8 pb-8">
                    {error && (
                        <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
                            <AlertTitle className="text-red-800">Error</AlertTitle>
                            <AlertDescription className="text-red-700">{error}</AlertDescription>
                        </Alert>
                    )}
                    
                    <form onSubmit={handleAuthSubmit} className="space-y-6">
                        {authView === 'register' && (
                            <div className="space-y-3">
                                <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Nombre</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Tu nombre completo"
                                    value={authForm.name}
                                    onChange={(e) => {
                                        setAuthForm({ ...authForm, name: e.target.value });
                                        if (fieldErrors.name) {
                                            setFieldErrors({ ...fieldErrors, name: '' });
                                        }
                                    }}
                                    required
                                    className={`h-12 px-4 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        fieldErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                />
                                {fieldErrors.name && (
                                    <p className="text-sm text-red-500 mt-1">{fieldErrors.name}</p>
                                )}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="tu@email.com"
                                value={authForm.email}
                                onChange={(e) => {
                                    setAuthForm({ ...authForm, email: e.target.value });
                                    if (fieldErrors.email) {
                                        setFieldErrors({ ...fieldErrors, email: '' });
                                    }
                                }}
                                required
                                className={fieldErrors.email ? 'border-red-500' : ''}
                            />
                            {fieldErrors.email && (
                                <p className="text-sm text-red-500">{fieldErrors.email}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Mínimo 6 caracteres"
                                value={authForm.password}
                                onChange={(e) => {
                                    setAuthForm({ ...authForm, password: e.target.value });
                                    if (fieldErrors.password) {
                                        setFieldErrors({ ...fieldErrors, password: '' });
                                    }
                                }}
                                required
                                minLength={6}
                                className={fieldErrors.password ? 'border-red-500' : ''}
                            />
                            {fieldErrors.password && (
                                <p className="text-sm text-red-500">{fieldErrors.password}</p>
                            )}
                        </div>
                        {authView === 'register' && (
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Repite tu contraseña"
                                    value={authForm.confirmPassword}
                                    onChange={(e) => {
                                        setAuthForm({ ...authForm, confirmPassword: e.target.value });
                                        if (fieldErrors.confirmPassword) {
                                            setFieldErrors({ ...fieldErrors, confirmPassword: '' });
                                        }
                                    }}
                                    required
                                    className={fieldErrors.confirmPassword ? 'border-red-500' : ''}
                                />
                                {fieldErrors.confirmPassword && (
                                    <p className="text-sm text-red-500">{fieldErrors.confirmPassword}</p>
                                )}
                            </div>
                        )}
                        <Button 
                            type="submit" 
                            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105" 
                            variant="default" 
                            size="default"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Procesando...' : (authView === 'login' ? 'Iniciar Sesión' : 'Registrarse')}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center pb-8">
                    <Button
                        variant="link"
                        size="default"
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                        onClick={() => {
                            setAuthView(authView === 'login' ? 'register' : 'login');
                            setError(null);
                            setFieldErrors({});
                            setAuthForm({ name: '', email: '', password: '', confirmPassword: '' });
                        }}
                        disabled={isLoading}
                    >
                        {authView === 'login'
                            ? "¿No tienes cuenta? Regístrate"
                            : "¿Ya tienes cuenta? Inicia sesión"}
                    </Button>
                </CardFooter>
            </Card>
            </div>
        </div>
    );
}
