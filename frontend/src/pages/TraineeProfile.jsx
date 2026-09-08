import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Phone,
  ShieldCheck,
  GraduationCap,
  Award,
  BriefcaseBusiness,
  TrendingUp,
  CalendarDays,
  MessageCircle,
  AlertTriangle,
} from "lucide-react";
import { fetchApi } from "../api";

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm font-medium text-slate-800 mt-1">{value || "N/A"}</p>
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
        styles[type] || styles.blue
      }`}
    >
      {children}
    </span>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatCurrency(amount) {
  if (amount === undefined || amount === null || isNaN(Number(amount))) return "N/A";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function TraineeProfile({ traineeId: traineeIdProp, onBack }) {
  const { id: routeId } = useParams();
  const navigate = useNavigate();
  const traineeId = traineeIdProp ?? routeId;
  const handleBack = onBack ?? (() => navigate("/trainees"));
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      if (!traineeId) return;
      try {
        setLoading(true);
        setError(null);
        const data = await fetchApi(`/trainees/${traineeId}`);
        if (isMounted) {
          setProfile(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load trainee details.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [traineeId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft size={17} />
          Back to Trainees
        </button>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
          <p className="font-semibold">Failed to load trainee profile</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-6">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft size={17} />
          Back to Trainees
        </button>
        <div className="bg-white border border-blue-100 rounded-2xl p-8 text-center text-slate-500">
          No profile found for this trainee.
        </div>
      </div>
    );
  }

  const hasConsent = Boolean(profile.consentStatus);
  // Consent gate: only outcome-tracking data requires consent.
  // Learning records (training/skills/certification/address) stay visible.
  const address = profile.address || {};
  const courses = profile.courses || [];
  const primaryCourse = courses[0];
  const skills = profile.skills || [];
  const certifications = profile.certifications || [];
  const primaryCert = certifications[0];
  const employmentList = hasConsent ? profile.employment || [] : [];
  const primaryEmployment = employmentList[0];
  const salaryHistory = hasConsent ? profile.salaryHistory || [] : [];
  const followUps = hasConsent ? profile.followUps || [] : [];
  const nonPlacement = hasConsent ? profile.nonPlacement || [] : [];

  // Salary calculations
  const startingSalary =
    salaryHistory.length > 0 ? salaryHistory[0].salaryAmount : null;
  const latestSalary =
    salaryHistory.length > 0
      ? salaryHistory[salaryHistory.length - 1].salaryAmount
      : null;
  const salaryIncrease =
    startingSalary && latestSalary && Number(startingSalary) > 0
      ? ((Number(latestSalary) - Number(startingSalary)) / Number(startingSalary)) * 100
      : null;

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={handleBack}
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
              {(profile.name || "T").charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="text-sm text-blue-600 font-medium">
                Trainee #{profile.id}
              </p>

              <h1 className="text-2xl font-bold text-slate-900 mt-1">
                {profile.name}
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                {profile.qualification || "No qualification listed"}
              </p>
            </div>
          </div>

          <StatusBadge type={profile.consentStatus ? "green" : "pink"}>
            {profile.consentStatus ? "Tracking Consent Provided" : "No Tracking Consent"}
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
            <InfoItem
              label="Phone"
              value={profile.phonePrimary || profile.phoneSecondary || "N/A"}
            />
            <InfoItem label="Trainee ID" value={`#${profile.id}`} />
            <InfoItem
              label="Tracking Consent"
              value={profile.consentStatus ? "Yes" : "No"}
            />
          </div>
        </div>

        <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <MapPin size={19} className="text-blue-600" />
            <h2 className="font-semibold text-slate-900">Current Address</h2>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <InfoItem label="Address" value={address.addressLine || "N/A"} />
            <InfoItem label="City" value={address.city || "N/A"} />
            <InfoItem label="District" value={address.district || "N/A"} />
            <InfoItem label="State" value={address.state || "N/A"} />
          </div>

          <p className="text-xs text-slate-400 mt-4">
            Pincode: {address.pincode || "N/A"}
          </p>
        </div>
      </div>

      {/* Training */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <GraduationCap size={20} className="text-indigo-600" />
            <h2 className="font-semibold text-slate-900">Training</h2>
          </div>

          {primaryCourse && (
            <StatusBadge
              type={
                primaryCourse.status?.toLowerCase() === "completed"
                  ? "green"
                  : primaryCourse.status?.toLowerCase() === "dropped"
                  ? "pink"
                  : "blue"
              }
            >
              {primaryCourse.status || "Enrolled"}
            </StatusBadge>
          )}
        </div>

        {primaryCourse ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <InfoItem label="Course" value={primaryCourse.name} />
            <InfoItem label="Provider" value={primaryCourse.providerName} />
            <InfoItem
              label="Enrolled"
              value={formatDate(primaryCourse.enrolledAt)}
            />
            <InfoItem
              label="Completed"
              value={
                primaryCourse.completedAt
                  ? formatDate(primaryCourse.completedAt)
                  : primaryCourse.status || "In Progress"
              }
            />
          </div>
        ) : (
          <p className="text-sm text-slate-500">No training data available.</p>
        )}
      </div>

      {/* Skills */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <Award size={20} className="text-blue-600" />
          <h2 className="font-semibold text-slate-900">Skills</h2>
        </div>

        {skills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            {skills.map((skill, index) => (
              <div
                key={skill.id || index}
                className="rounded-xl border border-slate-100 bg-slate-50 p-4"
              >
                <p className="font-semibold text-slate-900">{skill.name}</p>

                <p className="text-sm text-blue-600 mt-1">
                  {skill.proficiencyLevel || "General"}
                </p>

                <p className="text-xs text-slate-400 mt-2">
                  Source: {skill.source || "Training"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No skills recorded.</p>
        )}
      </div>

      {/* Certification */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <ShieldCheck size={20} className="text-emerald-600" />
          <h2 className="font-semibold text-slate-900">Certification</h2>
        </div>

        {primaryCert ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <InfoItem
              label="Certificate"
              value={primaryCert.certificateName || primaryCert.courseName}
            />
            <InfoItem
              label="Issued"
              value={formatDate(primaryCert.issuedAt)}
            />
            <InfoItem
              label="Score"
              value={
                primaryCert.score != null ? `${primaryCert.score}%` : "Completed"
              }
            />
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            No certification records available.
          </p>
        )}
      </div>

      {/* Employment */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <BriefcaseBusiness size={20} className="text-blue-600" />
            <h2 className="font-semibold text-slate-900">Employment</h2>
          </div>

          {primaryEmployment && (
            <StatusBadge
              type={
                primaryEmployment.status?.toLowerCase() === "active"
                  ? "green"
                  : "blue"
              }
            >
              {primaryEmployment.status || "Active"}
            </StatusBadge>
          )}
        </div>

        {primaryEmployment ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            <InfoItem label="Role" value={primaryEmployment.role} />
            <InfoItem
              label="Employer"
              value={primaryEmployment.employerName}
            />
            <InfoItem
              label="Industry"
              value={primaryEmployment.industry}
            />
            <InfoItem
              label="Type"
              value={primaryEmployment.employmentType}
            />
            <InfoItem
              label="Verification"
              value={primaryEmployment.verificationStatus}
            />
            <InfoItem
              label="Training Relevance"
              value={primaryEmployment.trainingRelevance}
            />
            <InfoItem
              label="Job Source"
              value={primaryEmployment.jobSource}
            />
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            No employment records available.
          </p>
        )}
      </div>

      {/* Salary */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp size={20} className="text-emerald-600" />
          <h2 className="font-semibold text-slate-900">Salary Progression</h2>
        </div>

        {salaryHistory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Starting Salary</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {formatCurrency(startingSalary)}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Latest Salary</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {formatCurrency(latestSalary)}
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-5">
              <p className="text-sm text-emerald-700">Salary Increase</p>
              <p className="text-2xl font-bold text-emerald-700 mt-2">
                {salaryIncrease !== null
                  ? `${salaryIncrease >= 0 ? "+" : ""}${salaryIncrease.toFixed(1)}%`
                  : "N/A"}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            No salary records available.
          </p>
        )}
      </div>

      {/* Follow-ups */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <MessageCircle size={20} className="text-indigo-600" />
          <h2 className="font-semibold text-slate-900">Follow-up History</h2>
        </div>

        {followUps.length > 0 ? (
          <div className="space-y-3">
            {followUps.map((followUp, index) => (
              <div
                key={followUp.id || index}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-slate-100 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <CalendarDays size={18} />
                  </div>

                  <div>
                    <p className="font-medium text-slate-900">
                      {formatDate(followUp.completedAt || followUp.scheduledAt)}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      {followUp.channel || "Standard"} ·{" "}
                      {followUp.employmentStatus || "Status Recorded"}
                    </p>
                  </div>
                </div>

                <StatusBadge
                  type={
                    followUp.responseStatus?.toLowerCase() === "completed"
                      ? "green"
                      : followUp.responseStatus?.toLowerCase() === "no_response"
                      ? "pink"
                      : "blue"
                  }
                >
                  {followUp.responseStatus || "Scheduled"}
                </StatusBadge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            No follow-up history available.
          </p>
        )}
      </div>

      {/* Non-placement Alert */}
      {nonPlacement.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
          <AlertTriangle
            size={20}
            className="text-amber-600 mt-0.5 shrink-0"
          />

          <div>
            <h2 className="font-semibold text-amber-800">
              Non-placement Information Reported
            </h2>

            <p className="text-sm text-amber-700 mt-1">
              Reason: {nonPlacement.map((item) => item.reason).join(", ")}
              {nonPlacement[0].reportedAt &&
                ` (Reported on ${formatDate(nonPlacement[0].reportedAt)})`}
            </p>
          </div>
        </div>
      )}

      {/* Consent Alert */}
      {!profile.consentStatus && (
        <div className="bg-pink-50 border border-pink-100 rounded-2xl p-5 flex items-start gap-3">
          <AlertTriangle size={20} className="text-pink-600 mt-0.5 shrink-0" />

          <div>
            <h2 className="font-semibold text-pink-800">
              Tracking consent information requires attention
            </h2>

            <p className="text-sm text-pink-700 mt-1">
              This trainee has not provided tracking consent for the current record.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default TraineeProfile;