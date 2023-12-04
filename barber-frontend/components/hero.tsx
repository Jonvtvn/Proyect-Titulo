import React from 'react'
import '../styles/globals.css';
import Link from 'next/link';

const home: React.FC = () => {
    return (
        <div className="hero">
            <div className="color-overlay"></div>
            <div className="hero-content z-0">
                <h1>Transformamos cabello en confianza</h1>
                <p>Barbería, Rizos, Colores, Estudio privado...</p>
                <Link href="http://186.64.113.85:3000/agend_user_cut">
                    <button >Agendar ahora</button>
                </Link>
            </div>
        </div>

    );
};

export default home