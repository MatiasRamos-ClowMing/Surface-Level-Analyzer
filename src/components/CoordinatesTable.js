export const CoordinatesTable = ({ data }) => {
  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-center">ID</th>
            <th className="px-4 py-2 text-center">X</th>
            <th className="px-4 py-2 text-center">Y</th>
            <th className="px-4 py-2 text-center">Z</th>
          </tr>
        </thead>
        <tbody>
          {data.map((coord) => (
            <tr key={coord.id} className="border-t border-gray-200 hover:bg-gray-50">
              <td className="px-4 py-2 text-center">{coord.id}</td>
              <td className="px-4 py-2 text-center font-mono">{coord.x.toFixed(3)}</td>
              <td className="px-4 py-2 text-center font-mono">{coord.y.toFixed(3)}</td>
              <td className="px-4 py-2 text-center font-mono">{coord.z.toFixed(3)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};