import { HashRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { Layout } from "@/components/Layout";
import { ToastContainer } from "@/components/Toast";
import Dashboard from "@/pages/Dashboard";
import Employees from "@/pages/Employees";
import EmployeeProfile from "@/pages/EmployeeProfile";
import NewEmployee from "@/pages/NewEmployee";
import EditEmployee from "@/pages/EditEmployee";
import Settings from "@/pages/Settings";

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/employee/new" element={<NewEmployee />} />
            <Route path="/employee/:id" element={<EmployeeProfile />} />
            <Route path="/employee/edit/:id" element={<EditEmployee />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
        <ToastContainer />
      </HashRouter>
    </AppProvider>
  );
}
