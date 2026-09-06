function Header({ activePage }) {
  return (
    <header className="h-20 bg-white/75 backdrop-blur-md border-b border-[#E6EDF7] flex items-center justify-between px-8">
      <div>
        <h2 className="text-xl font-bold text-[#14213D] tracking-tight">
          {activePage}
        </h2>

        <p className="text-xs text-[#71809A] mt-1">
          Skilling outcomes and employment tracking
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 text-white flex items-center justify-center text-sm font-semibold shadow-sm">
          S
        </div>

        <div className="hidden sm:block">
          <p className="text-xs font-semibold text-[#243552]">
            SkillPulse
          </p>

          <p className="text-[10px] text-[#8794A9]">
            Outcome Management
          </p>
        </div>
      </div>
    </header>
  );
}

export default Header;