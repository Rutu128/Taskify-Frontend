import { Outlet } from "react-router-dom";
import Navbar from "@/components/navbar/Navbar";

const NavbarLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-16 "> {/* Add padding top to account for fixed navbar */}
                <Outlet />
            </main>
        </div>
    );
};

export default NavbarLayout;