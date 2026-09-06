import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Trainees from "./pages/Trainees";
import TraineeProfile from "./pages/TraineeProfile";
import Training from "./pages/Training";
import Skills from "./pages/Skills";
import Employment from "./pages/Employment";
import FollowUps from "./pages/FollowUps";
import NonPlacement from "./pages/NonPlacement";
function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [selectedTrainee, setSelectedTrainee] = useState(null);

  const handlePageChange = (page) => {
    setActivePage(page);
    setSelectedTrainee(null);
  };

  return (
    <div className="min-h-screen flex">

      <Sidebar
        activePage={activePage}
        setActivePage={handlePageChange}
      />

      <main className="flex-1 min-w-0">

        <Header activePage={activePage} />

        <section className="p-8">

  {activePage === "Dashboard" && (
    <Dashboard />
  )}

  {activePage === "Trainees" && !selectedTrainee && (
    <Trainees
      onViewTrainee={(trainee) => {
        setSelectedTrainee(trainee);
      }}
    />
  )}

  {activePage === "Trainees" && selectedTrainee && (
    <TraineeProfile
      trainee={selectedTrainee}
      onBack={() => setSelectedTrainee(null)}
    />
  )}

  {activePage === "Training" && (
    <Training />
  )}
  {activePage === "Skills" && (
  <Skills />
)}
{activePage === "Employment" && (
  <Employment />
)}
{activePage === "Follow-ups" && (
  <FollowUps />
)}
{activePage === "Non-placement" && (
  <NonPlacement />
)}
  {![
  "Dashboard",
  "Trainees",
  "Training",
  "Skills",
  "Employment",
  "Follow-ups",
  "Non-placement",

].includes(activePage) && (
    <div className="bg-white border border-blue-100 rounded-2xl p-8 shadow-sm">
      <p className="text-sm font-medium text-blue-600">
        SkillPulse
      </p>

      <h1 className="text-2xl font-bold text-slate-900 mt-1">
        {activePage}
      </h1>

      <p className="text-slate-500 mt-2">
        This module will be built next.
      </p>
    </div>
  )}

</section>
      </main>

    </div>
  );
}

export default App;