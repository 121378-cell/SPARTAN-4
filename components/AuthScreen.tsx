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
    const [showPassword, setShowPassword] = useState(false);
    
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
                                className={`h-12 px-4 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    fieldErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                }`}
                            />
                            {fieldErrors.email && (
                                <p className="text-sm text-red-500">{fieldErrors.email}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
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
                                    className={`h-12 px-4 pr-12 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        fieldErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {fieldErrors.password && (
                                <p className="text-sm text-red-500">{fieldErrors.password}</p>
                            )}
                        </div>
                        {authView === 'register' && (
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Repite tu contraseña"
                                        value={authForm.confirmPassword}
                                        onChange={(e) => {
                                            setAuthForm({ ...authForm, confirmPassword: e.target.value });
                                            if (fieldErrors.confirmPassword) {
                                                setFieldErrors({ ...fieldErrors, confirmPassword: '' });
                                            }
                                        }}
                                        required
                                        className={`h-12 px-4 pr-12 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            fieldErrors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
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
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Procesando...
                                </div>
                            ) : (
                                authView === 'login' ? 'Iniciar Sesión' : 'Registrarse'
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 pb-8">
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
                    
                    {authView === 'register' && (
                        <div className="text-center text-xs text-gray-500 mt-2">
                            <p>Al registrarte, aceptas nuestros</p>
                            <div className="flex justify-center space-x-2 mt-1">
                                <button className="text-blue-600 hover:underline">Términos de Servicio</button>
                                <span>y</span>
                                <button className="text-blue-600 hover:underline">Política de Privacidad</button>
                            </div>
                        </div>
                    )}
                </CardFooter>
            </Card>
            </div>
        </div>
    );
}