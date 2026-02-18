export default function PlantInfoCard({ plant }: { plant: any }) {
  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800 italic">
          {plant.genus} {plant.species}
        </h2>

        {plant.common_names?.length > 0 && (
          <p className="text-gray-500 mt-1">
            Common name: {plant.common_names.join(", ")}
          </p>
        )}
      </div>

      <div className="mb-5">
        <h3 className="text-lg font-semibold text-gray-700 mb-1">
          Description
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {plant.brief_description}
        </p>
      </div>

      {plant.regions?.length > 0 && (
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Native Regions
          </h3>
          <div className="flex flex-wrap gap-2">
            {plant.regions.map((region: any, index: number) => (
              <span
                key={index}
                className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full"
              >
                {region}
              </span>
            ))}
          </div>
        </div>
      )}

      {plant.growing_tips && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Growing Tips
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Tip label="Soil Type" value={plant.growing_tips.soil_type} />
            <Tip label="Watering" value={plant.growing_tips.watering} />
            <Tip label="Sunlight" value={plant.growing_tips.sunlight} />
          </div>

          {plant.growing_tips.extra_details_to_keep_in_mind && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800">
                {plant.growing_tips.extra_details_to_keep_in_mind}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Tip = ({ label, value }: { label: string, value: number }) => (
  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-gray-700 mt-1">{value}</p>
  </div>
);
