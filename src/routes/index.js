import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Layout from '@/pages/layout';
import Dashboard from '@/pages/dashboard';
import UiKit from '@/pages/ui-kit';
import Home from '@/pages/home';
import CompanyManagement from '@/pages/company/companyManagement';
import CompanyDetail from '@/pages/company/companyDetail';
import Login from '@/pages/login';
import DomainManagement from "../pages/skill/domainManagement";
import ExpertiseGroupManagement from "../pages/skill/expertiseGroupManagement";
import ExpertiseManagement from "../pages/skill/expertiseManagement";
import SkillCategoryManagement from "../pages/skill/skillCategoryManagement";
import SkillManagement from "../pages/skill/skillManagement";
import MasterManagement from "../pages/skill/masterManagement";
import UserManagement from "../pages/user/userManagement";

export const routes = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            <Route element={<Layout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="companies" element={<CompanyManagement />} />
                <Route path="jobs" element={<Dashboard />} />
                <Route path="analytics" element={<Dashboard />} />
                <Route path="settings" element={<Dashboard />} />
                <Route path="help" element={<Dashboard />} />
                <Route path="companies/:id" element={<CompanyDetail />} />
                <Route path="domains" element={<DomainManagement />} />
                <Route path="expertise-groups" element={<ExpertiseGroupManagement />} />
                <Route path="expertises" element={<ExpertiseManagement />} />
                <Route path="skill-categories" element={<SkillCategoryManagement />} />
                <Route path="skills" element={<SkillManagement />} />
                <Route path="master-management" element={<MasterManagement />} />
            </Route>
            <Route path="/" element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="ui-kit" element={<UiKit />} />
        </Route>
    )
);
