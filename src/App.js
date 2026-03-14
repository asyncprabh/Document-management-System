import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProjectsPage from "./pages/ProjectsPage";
import FoldersPage from "./pages/FoldersPage";
import DocumentsPage from "./pages/DocumentsPage";
import UploadPage from "./pages/UploadPage";
import PreviewPage from "./pages/PreviewPage";
import VersionHistoryPage from "./pages/VersionHistoryPage";
import SearchPage from "./pages/SearchPage";
import ActivityPage from "./pages/ActivityPage";

// Components
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import RoleRoute from "./components/RoleRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ===== PUBLIC ROUTES ===== */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* ===== PROTECTED ROUTES ===== */}
        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <RoleRoute allowedRoles={["TenantAdmin","ProjectAdmin","InternalUser"]}>
                <DashboardPage />
              </RoleRoute>
            }
          />

          {/* Projects */}
          <Route
            path="/projects"
            element={
              <RoleRoute allowedRoles={["TenantAdmin","ProjectAdmin"]}>
                <ProjectsPage />
              </RoleRoute>
            }
          />

          {/* Folders */}
          <Route
            path="/folders"
            element={
              <RoleRoute allowedRoles={["TenantAdmin","ProjectAdmin"]}>
                <FoldersPage />
              </RoleRoute>
            }
          />

          <Route
            path="/folders/:projectId"
            element={
              <RoleRoute allowedRoles={["TenantAdmin","ProjectAdmin"]}>
                <FoldersPage />
              </RoleRoute>
            }
          />

          {/* Documents */}
          <Route
            path="/documents/:folderId"
            element={
              <RoleRoute allowedRoles={["TenantAdmin","ProjectAdmin","InternalUser"]}>
                <DocumentsPage />
              </RoleRoute>
            }
          />

          {/* Upload */}
          <Route
            path="/upload"
            element={
              <RoleRoute allowedRoles={["TenantAdmin","ProjectAdmin"]}>
                <UploadPage />
              </RoleRoute>
            }
          />

          {/* Preview */}
          <Route
            path="/preview/:id"
            element={
              <RoleRoute allowedRoles={["TenantAdmin","ProjectAdmin","InternalUser","ExternalUser"]}>
                <PreviewPage />
              </RoleRoute>
            }
          />

          {/* Version History */}
          <Route
            path="/versions/:documentId"
            element={
              <RoleRoute allowedRoles={["TenantAdmin","ProjectAdmin","InternalUser"]}>
                <VersionHistoryPage />
              </RoleRoute>
            }
          />

          {/* Search */}
          <Route
            path="/search"
            element={
              <RoleRoute allowedRoles={["TenantAdmin","ProjectAdmin","InternalUser"]}>
                <SearchPage />
              </RoleRoute>
            }
          />

          {/* Activity */}
          <Route
            path="/activity"
            element={
              <RoleRoute allowedRoles={["TenantAdmin","ProjectAdmin"]}>
                <ActivityPage />
              </RoleRoute>
            }
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;