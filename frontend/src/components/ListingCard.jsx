export default function ListingCard({ data, onRequest }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
      <h2 className="text-lg font-semibold mb-1">{data.block}</h2>
      <p className="text-sm text-gray-600">Room: {data.room_type}</p>
      <p className="text-sm text-gray-600">Beds: {data.bed_count}</p>
      <p className="text-sm text-gray-600">Remaining: {data.roommates_remaining}</p>
      <button
        onClick={() => onRequest(data.listing_id)}
        className="mt-2 bg-primary text-white w-full py-1 rounded hover:bg-blue-700"
      >
        Give Request
      </button>
    </div>
  );
}
