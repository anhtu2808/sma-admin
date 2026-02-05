import React from 'react';
import LoginHero from './components/LoginHero';
import LoginForm from './components/LoginForm';

const Login = () => {
    return (
        <div className="min-h-screen flex">
            <LoginHero />
            <LoginForm />
        </div>
    );
};

export default Login;
