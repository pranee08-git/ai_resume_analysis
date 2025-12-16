import {Link, useNavigate} from "react-router";
import {usePuterStore} from "~/lib/puter";
import {useState} from "react";
import {useUserEmail} from "~/hooks/useUserEmail";

const Navbar = () => {
    const { auth } = usePuterStore();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const email = useUserEmail();

    const handleLogout = () => {
        auth.signOut();
        localStorage.removeItem("userEmail");
        setShowDropdown(false);
        navigate('/auth');
    };

    return (
        <nav className="navbar">
            <Link to="/">
                <p className="text-2xl font-bold text-gradient">RESUMIND</p>
            </Link>
            
            <div className="flex items-center gap-4">
                <Link to="/upload" className="primary-button w-fit">
                    Upload Resume
                </Link>

                {/* User Profile Section */}
                {auth.isAuthenticated && (
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:shadow-lg transition"
                                title="User Profile"
                            >
                                👤
                            </button>

                            {/* Dropdown Menu */}
                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-fade-in-scale">
                                    <div className="px-4 py-2 border-b border-gray-200">
                                        <p className="text-sm text-gray-600">Logged In</p>
                                        <p className="font-semibold text-gray-800 truncate">
                                            {email || 'User'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition font-medium"
                                    >
                                        🚪 Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Login Button (if not authenticated) */}
                {!auth.isAuthenticated && (
                    <Link
                        to="/auth"
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition"
                        title="Sign In"
                    >
                        🔓
                    </Link>
                )}
            </div>
        </nav>
    )
}
export default Navbar
