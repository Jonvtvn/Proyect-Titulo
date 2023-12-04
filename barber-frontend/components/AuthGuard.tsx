import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';


interface RootLayoutProps {
    children: ReactNode;
}


const AuthGuard = ({ children }: RootLayoutProps) => {
    const router = useRouter();
    useEffect(() => {
        // Aquí deberías agregar la lógica de autenticación
        // Por ejemplo, verifica si el usuario tiene un token de acceso válido

        const isAuthenticated = true; // Reemplaza con tu lógica de autenticación

        if (!isAuthenticated) {
            // Si el usuario no está autenticado, redirige a la página de inicio de sesión
            router.push('/login');
        }
    }, [router]);

    return children;
};

export default AuthGuard;