import React, { useEffect, useState } from "react";
import { fetchProperties } from "../api/client";
import PropertyCard from "../components/PropertyCard";

export default function ListingsPage() {
  const [data, setData] = useState(null);      // { total, limit, offset, results }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchProperties({ limit: 20, offset: 0 })
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load properties");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    // If the component unmounts mid-request, don't call setState.
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return <div className="listings-page__state">Loading properties...</div>;
  }

  if (error) {
    return (
      <div className="listings-page__state listings-page__state--error">
        Error: {error}
      </div>
    );
  }

  const shown = data.results.length;

  return (
    <div className="listings-page">
      <div className="listings-page__summary">
        Showing {shown} of {data.total.toLocaleString("en-US")} properties
      </div>
      <div className="listings-page__grid">
        {data.results.map((p) => (
          <PropertyCard key={p.L_ListingID} property={p} />
        ))}
      </div>
    </div>
  );
}
