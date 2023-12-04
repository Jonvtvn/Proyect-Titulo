'use client'
import React, { useState } from "react";
import NavItem from "./nav_link";

const navegation: React.FC = () => {

    const MENU_LIST1 = [
        { text: "INICIO", href: "http://186.64.113.85:3000/" },
        { text: "NOSOTROS", href: "http://186.64.113.85:3000/#nosotros" },
    ];
    const MENU_LIST2 = [
        { text: "SERVICIOS", href: "http://186.64.113.85:3000/#services" },
        { text: "CONTACTO", href: "http://186.64.113.85:3000/#contact" },
    ];

    const [navActive, setNavActive] = useState<boolean | null>(null);
    const [activeIdx, setActiveIdx] = useState<number>(-1);

    return (
        <>
            <header className="sticky top-0 z-50 ">
                <nav className="navbar">
                    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 ">
                        <div className="relative flex h-34 items-center justify-between ">
                            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-evenly ">
                                <div onClick={() => setNavActive(!navActive)} className={`burger order-1`}>
                                    <img className="block h-20 w-auto" src="https://raw.githubusercontent.com/Jonvtvn/Other/main/logo.png" />
                                </div>
                                <div className={`${navActive ? "active" : ""} nav__menu-list`}>
                                    {MENU_LIST1.map((menu, idx) => (
                                        <div
                                            className="flex space-x-4"
                                            onClick={() => {
                                                setActiveIdx(idx);
                                                setNavActive(false);
                                            }}
                                            key={menu.text}
                                        >
                                            <NavItem active={activeIdx === idx} {...menu} />
                                        </div>
                                    ))}
                                    <a href="/" className="logo-navbar">
                                        <img className="mx-5 ml-6 block h-20 w-auto fill-white text-white" src="https://raw.githubusercontent.com/Jonvtvn/Other/main/logo.png" />
                                    </a>
                                    {MENU_LIST2.map((menu, idx) => (
                                        <div
                                            className="flex space-x-4"
                                            onClick={() => {
                                                setActiveIdx(idx);
                                                setNavActive(false);
                                            }}
                                            key={menu.text}
                                        >
                                            <NavItem active={activeIdx === idx} {...menu} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        </>
    );
};

export default navegation;
