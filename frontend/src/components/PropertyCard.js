import React from "react";

// Parse the L_Photos field defensively. It's a JSON-string column that
// can be null, empty, or malformed. We fall back to an empty array
// on anything unexpected so the component never crashes on bad data.
function parsePhotos(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch (_) {
    return [];
  }
}

function formatPrice(price) {
  if (price === null || price === undefined || price === 0) return "Price unavailable";
  return "$" + Number(price).toLocaleString("en-US");
}

function formatNumber(n, suffix) {
  if (n === null || n === undefined) return null;
  return `${n} ${suffix}`;
}

export default function PropertyCard({ property }) {
  const photos = parsePhotos(property.L_Photos);
  const firstPhoto = photos[0] || null;

  const beds = formatNumber(property.L_Keyword2, "bd");
  const baths = formatNumber(property.LM_Dec_3, "ba");
  const sqft = property.LM_Int2_3
    ? `${Number(property.LM_Int2_3).toLocaleString("en-US")} sqft`
    : null;

  const stats = [beds, baths, sqft].filter(Boolean).join(" · ");

  return (
    <div className="property-card">
      <div className="property-card__image">
        {firstPhoto ? (
          <img src={firstPhoto} alt={property.L_Address || "Property"} loading="lazy" />
        ) : (
          <div className="property-card__no-image">No photo available</div>
        )}
      </div>
      <div className="property-card__body">
        <div className="property-card__price">{formatPrice(property.L_SystemPrice)}</div>
        {stats && <div className="property-card__stats">{stats}</div>}
        <div className="property-card__address">{property.L_Address || "Address unavailable"}</div>
        <div className="property-card__city">
          {[property.L_City, property.L_State].filter(Boolean).join(", ")}
        </div>
      </div>
    </div>
  );
}
