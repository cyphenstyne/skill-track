import { useEffect, useState } from "react";

/**
 * Shared data-fetching hook matching the backend's GET-only contract.
 * Replaces the copy-pasted useState/useEffect/isMounted/loading/error
 * blocks across pages. Frontend-only — no backend change needed.
 *
 * Usage:
 *   const { data, loading, error } = useApi(() => fetchApi("/trainees"), []);
 */
export function useApi(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const result = await fetcher(controller.signal);
        if (isMounted) setData(result ?? null);
      } catch (err) {
        if (isMounted && err?.name !== "AbortError") {
          setError(err.message || "Failed to load data");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}

export function ErrorBox({ title = "Failed to load data", message }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
      <p className="font-semibold">{title}</p>
      <p className="text-sm mt-1">{message}</p>
      <p className="text-xs mt-2 text-red-500">
        Make sure the backend is running: `npm run dev` in `backend/` (port 5000).
      </p>
    </div>
  );
}
