import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Award,
  BriefcaseBusiness,
  ClipboardCheck,
  AlertCircle,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Trainees", icon: Users },
  { name: "Training", icon: GraduationCap },
  { name: "Skills", icon: Award },
  { name: "Employment", icon: BriefcaseBusiness },
  { name: "Follow-ups", icon: ClipboardCheck },
  { name: "Non-placement", icon: AlertCircle },
];

function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="w-64 min-h-screen bg-white/90 backdrop-blur-sm border-r border-[#DCE6F5] flex flex-col">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-[#E6EDF7]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold shadow-sm">
            S
          </div>

          <div>
            <h1 className="font-bold text-[#14213D] tracking-tight">
              SkillTrack
            </h1>

            <p className="text-[11px] text-[#71809A]">
              Skilling Outcomes
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        <p className="px-3 mb-3 text-[10px] font-semibold tracking-wider text-[#94A3B8] uppercase">
          Workspace
        </p>

        {navigation.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.name;

          return (
            <button
              key={item.name}
              onClick={() => setActivePage(item.name)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-[#EAF3FF] text-[#3478E5] shadow-sm"
                  : "text-[#53627A] hover:bg-[#F4F8FF] hover:text-[#3478E5]"
              }`}
            >
              <Icon
                size={18}
                strokeWidth={active ? 2.3 : 1.8}
              />

              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-5 border-t border-[#E6EDF7]">
        <p className="text-[11px] text-[#94A3B8]">
          SIH 2026 · PS 26135
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;