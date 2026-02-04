import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Menu, X } from 'lucide-react';
import Button from '@/components/Button/index.tsx';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                    <Zap size={20} fill="currentColor" />
                </div>
                <span className="font-heading font-bold text-xl text-neutral-900 dark:text-white">RecruitAI</span>
            </div>

            <div className="hidden md:flex items-center gap-4">
                <Link to="/login" className="text-sm font-semibold text-neutral-900 dark:text-white hover:text-primary transition-colors">
                    Login
                </Link>
                <Link to="/signup">
                    <Button mode="primary" className="!px-6 !py-2 !rounded-lg !text-sm">
                        Sign Up
                    </Button>
                </Link>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-neutral-900 dark:text-white" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X /> : <Menu />}
            </button>
        </nav>
    );
};

export default Navbar;
