import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "@/components/navbar/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
// import toast from "react-hot-toast";

const NavbarLayout = () => {
    const { ping } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        async function authenticateUser() {
            console.log("Authenticating User...");
            const res = await ping();
            if (!res) {
                // toast.error("Authentication Failed")
                navigate("/", { replace: true });
            };
            // else console.log("Authorized User");
        }
        authenticateUser();
    }, [navigate, ping])


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