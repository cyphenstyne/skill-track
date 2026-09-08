import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Award,
  BriefcaseBusiness,
  ClipboardCheck,
  AlertCircle,
  Target,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Trainees", path: "/trainees", icon: Users },
  { name: "Training", path: "/training", icon: GraduationCap },
  { name: "Skills", path: "/skills", icon: Award },
  { name: "Skill Gaps", path: "/skill-gaps", icon: Target },
  { name: "Employment", path: "/employment", icon: BriefcaseBusiness },
  { name: "Follow-ups", path: "/follow-ups", icon: ClipboardCheck },
  { name: "Non-placement", path: "/non-placement", icon: AlertCircle },
];

function Sidebar() {
  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-[#DCE6F5]">
      <div className="flex items-center gap-6 px-6 py-3">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold shadow-sm">
            S
          </div>

          <div className="hidden sm:block">
            <h1 className="font-bold text-[#14213D] tracking-tight leading-tight">
              SkillTrack
            </h1>

            <p className="text-[11px] text-[#71809A]">
              Skilling Outcomes
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex items-center justify-end gap-1 overflow-x-auto py-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? "bg-[#EAF3FF] text-[#3478E5] shadow-sm"
                      : "text-[#53627A] hover:bg-[#F4F8FF] hover:text-[#3478E5]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={18}
                      strokeWidth={isActive ? 2.3 : 1.8}
                    />

                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export default Sidebar;