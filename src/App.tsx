import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Processing from "./pages/Processing";
import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "./AppLayout";
import Auth from "./pages/Auth";
import SalarySimulator from "./pages/Processing/components/SalarySimulator";

const App = () => {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/auth" element={<Auth />} />

          <Route
            path="/processing"
            element={
              <ProtectedRoute>
                <Processing />
              </ProtectedRoute>
            }
          />

          <Route
            path="/simulator/:profession"
            element={
              <ProtectedRoute>
                <SalarySimulator />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/auth" />} />

          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
};

export default App;
