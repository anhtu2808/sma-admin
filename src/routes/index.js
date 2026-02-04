import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Layout from '@/pages/layout';
import Dashboard from '@/pages/dashboard';
import UiKit from '@/pages/ui-kit';
import Home from '@/pages/home';
import Login from '@/pages/login';

export const routes = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            <Route element={<Layout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="users" element={<Dashboard />} />
                <Route path="employers" element={<Dashboard />} />
                <Route path="jobs" element={<Dashboard />} />
                <Route path="analytics" element={<Dashboard />} />
                <Route path="settings" element={<Dashboard />} />
                <Route path="help" element={<Dashboard />} />
            </Route>
            <Route path="/" element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="ui-kit" element={<UiKit />} />
        </Route>
    )
);
