export default function FilterBar({ filters, setFilters }) {
  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <input
        placeholder="Block"
        value={filters.block}
        onChange={(e) => setFilters({ ...filters, block: e.target.value })}
        className="border p-2 rounded w-32"
      />
      <select
        value={filters.room_type}
        onChange={(e) => setFilters({ ...filters, room_type: e.target.value })}
        className="border p-2 rounded w-32"
      >
        <option value="">Room Type</option>
        <option value="AC">AC</option>
        <option value="NON-AC">Non-AC</option>
      </select>
      <input
        type="number"
        placeholder="Beds"
        value={filters.bed_count}
        onChange={(e) => setFilters({ ...filters, bed_count: e.target.value })}
        className="border p-2 rounded w-32"
      />
    </div>
  );
}
