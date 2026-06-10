import { Outlet } from 'react-router-dom';
import Banner from '../components/Banner';
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer';
import CartSidebar from '../components/CartSidebar';

const AppLayout = () => {
  return (
    <>
       <Banner />
       <Navbar /> 
       
       {/* FONDO NEGRO ABSOLUTO (Estilo Spotify) - El lienzo base para toda la Tacoteca */}
       <main className="min-h-screen bg-[#000000] text-white selection:bg-[#FF8C00] selection:text-white">
           <Outlet />
       </main>
       
       <Footer />
       <CartSidebar />
    </>
  );
};

export default AppLayout;