import {
  ArrowLeft,
  MapPin,
  Phone,
  ShieldCheck,
  GraduationCap,
  Award,
  BriefcaseBusiness,
  Building2,
  TrendingUp,
  CalendarDays,
  MessageCircle,
  AlertTriangle,
} from "lucide-react";

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm font-medium text-slate-800 mt-1">{value}</p>
    </div>
  );
}

function StatusBadge({ children, type = "blue" }) {
  const styles = {
    green: "bg-emerald-50 text-emerald-700",
    blue: "bg-blue-50 text-blue-700",
    purple: "bg-violet-50 text-violet-700",
    pink: "bg-pink-50 text-pink-700",
    amber: "bg-amber-50 text-amber-700",
  };

  return (
    <span
      className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold ${
        styles[type]
      }`}
    >
      {children}
    </span>
  );
}

function TraineeProfile({ trainee, onBack }) {
  const profile = {
    ...trainee,

    address: {
      line: "MG Road, House 1",
      city: trainee.district,
      district: trainee.district,
      state: "Maharashtra",
      pincode: "400017",
    },

    training: {
      course: "Full Stack Web Development",
      provider: "Maharashtra Digital Skills Centre",
      enrolled: "18 Mar 2025",
      completed: "16 Jul 2025",
      status: "Completed",
    },

    skills: [
      { name: "Java", level: "Advanced", source: "Training" },
      { name: "JavaScript", level: "Intermediate", source: "Training" },
      { name: "React", level: "Intermediate", source: "Self-reported" },
      { name: "SQL", level: "Advanced", source: "Training" },
      { name: "Git", level: "Intermediate", source: "Training" },
    ],

    certification: {
      name: "Full Stack Web Development Certification",
      issued: "20 Jul 2025",
      score: "86%",
    },

    employment: {
      employer: "Employer 1",
      industry: "IT Services",
      role: "Software Developer",
      type: "Employment",
      status: "Active",
      verification: "Verified",
      relevance: "High",
      source: "Training Provider",
    },

    salary: {
      starting: "₹22,000",
      sixMonth: "₹25,960",
      increase: "+18%",
    },

    followUps: [
      {
        date: "15 Jan 2026",
        channel: "SMS",
        status: "Completed",
        employmentStatus: "Employed",
      },
      {
        date: "18 Jun 2026",
        channel: "Email",
        status: "Completed",
        employmentStatus: "Employed",
      },
    ],
  };

  return (
    <div className="space-y-6">

      {/* Back */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        <ArrowLeft size={17} />
        Back to Trainees
      </button>

      {/* Profile header */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">

          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 flex items-center justify-center text-xl font-bold">
              {profile.name.charAt(0)}
            </div>

            <div>
              <p className="text-sm text-blue-600 font-medium">
                Trainee #{profile.id}
              </p>

              <h1 className="text-2xl font-bold text-slate-900 mt-1">
                {profile.name}
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                {profile.qualification}
              </p>
            </div>

          </div>

          <StatusBadge type={profile.consent ? "green" : "pink"}>
            {profile.consent ? "Consent Provided" : "No Consent"}
          </StatusBadge>

        </div>
      </div>

      {/* Personal + Address */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">

          <div className="flex items-center gap-2 mb-5">
            <Phone size={19} className="text-blue-600" />
            <h2 className="font-semibold text-slate-900">
              Personal Information
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <InfoItem label="Qualification" value={profile.qualification} />
            <InfoItem label="Phone" value={profile.phone} />
            <InfoItem label="Trainee ID" value={`#${profile.id}`} />
            <InfoItem label="Consent" value={profile.consent ? "Yes" : "No"} />
          </div>

        </div>

        <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">

          <div className="flex items-center gap-2 mb-5">
            <MapPin size={19} className="text-blue-600" />
            <h2 className="font-semibold text-slate-900">
              Current Address
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <InfoItem label="Address" value={profile.address.line} />
            <InfoItem label="City" value={profile.address.city} />
            <InfoItem label="District" value={profile.address.district} />
            <InfoItem label="State" value={profile.address.state} />
          </div>

          <p className="text-xs text-slate-400 mt-4">
            Pincode: {profile.address.pincode}
          </p>

        </div>

      </div>

      {/* Training */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">

        <div className="flex items-center justify-between mb-5">

          <div className="flex items-center gap-2">
            <GraduationCap size={20} className="text-indigo-600" />
            <h2 className="font-semibold text-slate-900">
              Training
            </h2>
          </div>

          <StatusBadge type="green">
            {profile.training.status}
          </StatusBadge>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

          <InfoItem
            label="Course"
            value={profile.training.course}
          />

          <InfoItem
            label="Provider"
            value={profile.training.provider}
          />

          <InfoItem
            label="Enrolled"
            value={profile.training.enrolled}
          />

          <InfoItem
            label="Completed"
            value={profile.training.completed}
          />

        </div>

      </div>

      {/* Skills */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">

        <div className="flex items-center gap-2 mb-5">
          <Award size={20} className="text-blue-600" />
          <h2 className="font-semibold text-slate-900">
            Skills
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">

          {profile.skills.map((skill) => (
            <div
              key={skill.name}
              className="rounded-xl border border-slate-100 bg-slate-50 p-4"
            >
              <p className="font-semibold text-slate-900">
                {skill.name}
              </p>

              <p className="text-sm text-blue-600 mt-1">
                {skill.level}
              </p>

              <p className="text-xs text-slate-400 mt-2">
                Source: {skill.source}
              </p>
            </div>
          ))}

        </div>

      </div>

      {/* Certification */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">

        <div className="flex items-center gap-2 mb-5">
          <ShieldCheck size={20} className="text-emerald-600" />
          <h2 className="font-semibold text-slate-900">
            Certification
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <InfoItem
            label="Certificate"
            value={profile.certification.name}
          />

          <InfoItem
            label="Issued"
            value={profile.certification.issued}
          />

          <InfoItem
            label="Score"
            value={profile.certification.score}
          />

        </div>

      </div>

      {/* Employment */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">

        <div className="flex items-center justify-between mb-5">

          <div className="flex items-center gap-2">
            <BriefcaseBusiness size={20} className="text-blue-600" />
            <h2 className="font-semibold text-slate-900">
              Employment
            </h2>
          </div>

          <StatusBadge type="green">
            {profile.employment.status}
          </StatusBadge>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

          <InfoItem label="Role" value={profile.employment.role} />
          <InfoItem label="Employer" value={profile.employment.employer} />
          <InfoItem label="Industry" value={profile.employment.industry} />
          <InfoItem label="Type" value={profile.employment.type} />
          <InfoItem
            label="Verification"
            value={profile.employment.verification}
          />
          <InfoItem
            label="Training Relevance"
            value={profile.employment.relevance}
          />
          <InfoItem
            label="Job Source"
            value={profile.employment.source}
          />
        </div>

      </div>

      {/* Salary */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">

        <div className="flex items-center gap-2 mb-5">
          <TrendingUp size={20} className="text-emerald-600" />
          <h2 className="font-semibold text-slate-900">
            Salary Progression
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <div className="rounded-xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">
              Starting Salary
            </p>

            <p className="text-2xl font-bold text-slate-900 mt-2">
              {profile.salary.starting}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">
              Six-Month Salary
            </p>

            <p className="text-2xl font-bold text-slate-900 mt-2">
              {profile.salary.sixMonth}
            </p>
          </div>

          <div className="rounded-xl bg-emerald-50 p-5">
            <p className="text-sm text-emerald-700">
              Salary Increase
            </p>

            <p className="text-2xl font-bold text-emerald-700 mt-2">
              {profile.salary.increase}
            </p>
          </div>

        </div>

      </div>

      {/* Follow-ups */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">

        <div className="flex items-center gap-2 mb-5">
          <MessageCircle size={20} className="text-indigo-600" />
          <h2 className="font-semibold text-slate-900">
            Follow-up History
          </h2>
        </div>

        <div className="space-y-3">

          {profile.followUps.map((followUp, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-slate-100 p-4"
            >

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <CalendarDays size={18} />
                </div>

                <div>
                  <p className="font-medium text-slate-900">
                    {followUp.date}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    {followUp.channel} · {followUp.employmentStatus}
                  </p>
                </div>

              </div>

              <StatusBadge type="green">
                {followUp.status}
              </StatusBadge>

            </div>
          ))}

        </div>

      </div>

      {/* Non-placement */}
      {!profile.consent && (
        <div className="bg-pink-50 border border-pink-100 rounded-2xl p-5 flex items-start gap-3">

          <AlertTriangle
            size={20}
            className="text-pink-600 mt-0.5"
          />

          <div>
            <h2 className="font-semibold text-pink-800">
              Consent information requires attention
            </h2>

            <p className="text-sm text-pink-700 mt-1">
              This trainee has not provided consent for the current record.
            </p>
          </div>

        </div>
      )}

    </div>
  );
}

export default TraineeProfile;