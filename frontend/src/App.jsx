import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Trainees from "./pages/Trainees";
import TraineeProfile from "./pages/TraineeProfile";
import Training from "./pages/Training";
import Skills from "./pages/Skills";
import SkillGapCalculator from "./pages/SkillGapCalculator";
import Employment from "./pages/Employment";
import FollowUps from "./pages/FollowUps";
import NonPlacement from "./pages/NonPlacement";
import { fetchApi } from "./api";

function App() {
  const [backendDown, setBackendDown] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetchApi("/health")
      .then(() => {
        if (isMounted) setBackendDown(false);
      })
      .catch(() => {
        if (isMounted) setBackendDown(true);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar />

      <main className="flex-1 min-w-0">
        {backendDown && (
          <div className="mx-8 mt-6 bg-red-50 border border-red-200 rounded-2xl px-5 py-4 text-sm text-red-700">
            <span className="font-semibold">Backend unreachable.</span> Start it with{" "}
            <code className="font-mono">npm run dev</code> in{" "}
            <code className="font-mono">backend/</code> (expects port 5000, proxied via
            /api).
          </div>
        )}

        <section className="p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/trainees" element={<Trainees />} />
            <Route path="/trainees/:id" element={<TraineeProfile />} />
            <Route path="/training" element={<Training />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/skill-gaps" element={<SkillGapCalculator />} />
            <Route path="/employment" element={<Employment />} />
            <Route path="/follow-ups" element={<FollowUps />} />
            <Route path="/non-placement" element={<NonPlacement />} />
            <Route
              path="*"
              element={
                <div className="bg-white border border-blue-100 rounded-2xl p-8 shadow-sm">
                  <p className="text-sm font-medium text-blue-600">SkillTrack</p>
                  <h1 className="text-2xl font-bold text-slate-900 mt-1">Page not found</h1>
                  <p className="text-slate-500 mt-2">
                    The page you are looking for does not exist.
                  </p>
                </div>
              }
            />
          </Routes>
        </section>
      </main>
    </div>
  );
}

export default App;
