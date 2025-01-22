import { Button } from "@/components/ui/button";
import { LayoutDashboard, ListTodo, LogOut, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

const Navbar = () => {
    const navigate = useNavigate();
    const { logout, isAuthenticated } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 border-b bg-white z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo/Brand */}
                    <div className="flex-shrink-0">
                        <button
                            onClick={() => handleNavigation("/dashboard")}
                            className="font-semibold text-xl hover:text-gray-600 transition-colors"
                        >
                            Taskify
                        </button>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        <Button
                            variant="ghost"
                            className="flex items-center gap-2 px-4 py-2 h-10"
                            onClick={() => handleNavigation("/dashboard")}
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </Button>

                        <Button
                            variant="ghost"
                            className="flex items-center gap-2 px-4 py-2 h-10"
                            onClick={() => handleNavigation("/tasks")}
                        >
                            <ListTodo className="h-4 w-4" />
                            Task List
                        </Button>

                        {isAuthenticated && <div className="h-6 w-px bg-gray-200 mx-2" />}

                        {isAuthenticated && <Button
                            variant="ghost"
                            className="flex items-center gap-2 px-4 py-2 h-10 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </Button>}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t bg-white">
                    <div className="space-y-1 px-4 pb-3 pt-2">
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-2 h-10"
                            onClick={() => handleNavigation("/dashboard")}
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </Button>

                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-2 h-10"
                            onClick={() => handleNavigation("/tasks")}
                        >
                            <ListTodo className="h-4 w-4" />
                            Task List
                        </Button>

                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-2 h-10 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;