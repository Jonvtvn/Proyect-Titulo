import React from 'react'
import Hero from '../components/hero';
import BarRed from '../components/barred';
import AboutUs from '../components/about_us';
import AboutUsTwo from '../components/about_us_two';
import Services from '../components/services_static';
import Contact from '../components/contact';
import RootLayout from '../app/layout'
import Footer from '../components/footer';

function page() {
    return (
        <>
            <RootLayout showNavbar={true}>
                <Hero />
                <BarRed />
                <AboutUs />
                <AboutUsTwo />
                <Services />
                <Contact />
                <Footer />
            </RootLayout>
        </>
    )
}

export default page