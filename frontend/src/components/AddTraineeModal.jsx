import { useState } from "react";
import { X } from "lucide-react";
import { fetchApi } from "../api";

const EMPTY_FORM = {
  name: "",
  dateOfBirth: "",
  qualification: "",
  phonePrimary: "",
  phoneSecondary: "",
  consentStatus: false,
  addressLine: "",
  city: "",
  district: "",
  state: "",
  pincode: "",
};

function inputClassName(hasError) {
  return `w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 ${
    hasError ? "border-red-300" : "border-slate-200"
  }`;
}

function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

function AddTraineeModal({ onClose, onCreated }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [saving, setSaving] = useState(false);

  function setField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (form.dateOfBirth) {
      const parsed = new Date(form.dateOfBirth);
      if (Number.isNaN(parsed.getTime())) next.dateOfBirth = "Invalid date.";
    }

    const addressTouched =
      form.addressLine.trim() ||
      form.city.trim() ||
      form.district.trim() ||
      form.state.trim() ||
      form.pincode.trim();
    if (addressTouched) {
      if (!form.addressLine.trim()) next.addressLine = "Required when adding an address.";
      if (!form.district.trim()) next.district = "Required when adding an address.";
      if (!form.state.trim()) next.state = "Required when adding an address.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    const addressTouched =
      form.addressLine.trim() ||
      form.city.trim() ||
      form.district.trim() ||
      form.state.trim() ||
      form.pincode.trim();

    const payload = {
      name: form.name.trim(),
      dateOfBirth: form.dateOfBirth || null,
      qualification: form.qualification.trim() || null,
      phonePrimary: form.phonePrimary.trim() || null,
      phoneSecondary: form.phoneSecondary.trim() || null,
      consentStatus: form.consentStatus,
      ...(addressTouched
        ? {
            address: {
              addressLine: form.addressLine.trim(),
              city: form.city.trim() || null,
              district: form.district.trim(),
              state: form.state.trim(),
              pincode: form.pincode.trim() || null,
            },
          }
        : {}),
    };

    try {
      setSaving(true);
      const created = await fetchApi("/trainees", { method: "POST", body: payload });
      onCreated(created);
    } catch (err) {
      setSubmitError(err.message || "Failed to create trainee.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Add Trainee</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Register a new trainee with basic information.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Full Name" required error={errors.name}>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="e.g. Priya Sharma"
                className={inputClassName(errors.name)}
              />
            </Field>
            <Field label="Date of Birth" error={errors.dateOfBirth}>
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => setField("dateOfBirth", e.target.value)}
                className={inputClassName(errors.dateOfBirth)}
              />
            </Field>
            <Field label="Qualification">
              <input
                type="text"
                value={form.qualification}
                onChange={(e) => setField("qualification", e.target.value)}
                placeholder="e.g. Bachelor's"
                className={inputClassName(false)}
              />
            </Field>
            <div className="flex items-end pb-1">
              <label className="inline-flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.consentStatus}
                  onChange={(e) => setField("consentStatus", e.target.checked)}
                  className="w-4 h-4 rounded accent-blue-600"
                />
                Tracking consent given
              </label>
            </div>
            <Field label="Primary Phone">
              <input
                type="tel"
                value={form.phonePrimary}
                onChange={(e) => setField("phonePrimary", e.target.value)}
                placeholder="e.g. 9812345678"
                className={inputClassName(false)}
              />
            </Field>
            <Field label="Secondary Phone">
              <input
                type="tel"
                value={form.phoneSecondary}
                onChange={(e) => setField("phoneSecondary", e.target.value)}
                placeholder="Optional"
                className={inputClassName(false)}
              />
            </Field>
          </div>

          <div className="border-t border-slate-100 pt-5">
            <p className="text-sm font-semibold text-slate-800">Current Address</p>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">
              Optional — if filled, address line, district and state are required.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Field label="Address Line" error={errors.addressLine}>
                  <input
                    type="text"
                    value={form.addressLine}
                    onChange={(e) => setField("addressLine", e.target.value)}
                    placeholder="e.g. MG Road, House 12"
                    className={inputClassName(errors.addressLine)}
                  />
                </Field>
              </div>
              <Field label="City">
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setField("city", e.target.value)}
                  placeholder="e.g. Pune"
                  className={inputClassName(false)}
                />
              </Field>
              <Field label="Pincode">
                <input
                  type="text"
                  value={form.pincode}
                  onChange={(e) => setField("pincode", e.target.value)}
                  placeholder="e.g. 411001"
                  className={inputClassName(false)}
                />
              </Field>
              <Field label="District" error={errors.district}>
                <input
                  type="text"
                  value={form.district}
                  onChange={(e) => setField("district", e.target.value)}
                  placeholder="e.g. Pune"
                  className={inputClassName(errors.district)}
                />
              </Field>
              <Field label="State" error={errors.state}>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => setField("state", e.target.value)}
                  placeholder="e.g. Maharashtra"
                  className={inputClassName(errors.state)}
                />
              </Field>
            </div>
          </div>

          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
              {submitError}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Add Trainee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTraineeModal;
