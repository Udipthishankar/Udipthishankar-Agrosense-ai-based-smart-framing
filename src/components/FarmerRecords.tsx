import React, { useState, useEffect } from "react";
import { BookOpen, Plus, Trash2, Download, Calendar, MapPin, Sprout, Filter, CheckCircle2, AlertCircle } from "lucide-react";
import { FarmerRecord } from "../types";

export const FarmerRecords: React.FC = () => {
  const [records, setRecords] = useState<FarmerRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");

  const [newLocation, setNewLocation] = useState("");
  const [newCrop, setNewCrop] = useState("Sugarcane");
  const [newArea, setNewArea] = useState("2.5 acres");
  const [newSoilType, setNewSoilType] = useState("Black Cotton Soil");
  const [newIrrigation, setNewIrrigation] = useState("Drip Irrigation");
  const [newNotes, setNewNotes] = useState("");

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/records");
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
      }
    } catch (err) {
      console.error("Failed to load records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocation.trim() || !newCrop.trim()) return;

    try {
      const payload = {
        location: newLocation.trim(),
        crop: newCrop.trim(),
        details: {
          area: newArea,
          soil_type: newSoilType,
          irrigation: newIrrigation,
          notes: newNotes,
        },
      };

      const res = await fetch("/api/records/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowAddModal(false);
        setNewLocation("");
        setNewNotes("");
        fetchRecords();
      }
    } catch (err) {
      console.error("Error creating record:", err);
    }
  };

  const handleDeleteRecord = async (id: number) => {
    try {
      const res = await fetch(`/api/records/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setRecords((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error("Delete record error:", err);
    }
  };

  const exportCSV = () => {
    if (records.length === 0) return;
    const headers = ["ID", "Location", "Crop", "Timestamp", "Area", "Soil Type", "Irrigation", "Notes"];
    const rows = records.map((r) => [
      r.id,
      `"${r.location}"`,
      `"${r.crop}"`,
      `"${r.timestamp}"`,
      `"${r.details?.area || ""}"`,
      `"${r.details?.soil_type || ""}"`,
      `"${r.details?.irrigation || ""}"`,
      `"${r.details?.notes || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `agrosense_field_records_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = records.filter(
    (r) =>
      r.location.toLowerCase().includes(filterQuery.toLowerCase()) ||
      r.crop.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            Farmer Field Logbook
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-emerald-950">Saved Soil & Crop Records</h2>
          <p className="text-gray-600 text-xs sm:text-sm">
            Keep track of historical soil recommendations, farm plot sizes, and seasonal planting strategies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            disabled={records.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Field Log</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm flex items-center gap-3">
        <Filter className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder="Filter by plot location or crop name..."
          className="w-full text-xs sm:text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400"
        />
      </div>

      {/* Records List */}
      {loading ? (
        <div className="p-12 text-center text-gray-500 text-sm">Loading field logs...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-dashed border-emerald-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto text-2xl">
            📋
          </div>
          <h4 className="font-bold text-gray-800 text-base">No Field Records Found</h4>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {filterQuery ? "No records match your search filter." : "Run a soil recommendation or click 'Add Field Log' above to start tracking your plots."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-base font-bold">
                      🌱
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-base">{record.crop}</h4>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        <span>{record.location}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteRecord(record.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Details Subgrid */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-3 rounded-xl border border-gray-100">
                  {record.details?.area && (
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-semibold">Plot Area</span>
                      <span className="font-medium text-gray-800">{record.details.area}</span>
                    </div>
                  )}
                  {record.details?.soil_type && (
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-semibold">Soil Type</span>
                      <span className="font-medium text-gray-800">{record.details.soil_type}</span>
                    </div>
                  )}
                  {record.details?.irrigation && (
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-semibold">Irrigation</span>
                      <span className="font-medium text-gray-800">{record.details.irrigation}</span>
                    </div>
                  )}
                  {record.details?.ph && (
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-semibold">Soil pH</span>
                      <span className="font-medium text-gray-800">{record.details.ph}</span>
                    </div>
                  )}
                </div>

                {record.details?.notes && (
                  <p className="text-xs text-gray-600 italic bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100/60">
                    "{record.details.notes}"
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(record.timestamp).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="font-medium text-emerald-700">Record #{record.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-lg text-emerald-950">Add Field Log</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddRecord} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Field / Region Location</label>
                <input
                  type="text"
                  required
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Pune Plot 4, Maharashtra"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Selected Crop</label>
                  <input
                    type="text"
                    required
                    value={newCrop}
                    onChange={(e) => setNewCrop(e.target.value)}
                    placeholder="e.g. Rice, Wheat, Cotton"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Plot Area</label>
                  <input
                    type="text"
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                    placeholder="e.g. 4 acres"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Soil Type</label>
                  <input
                    type="text"
                    value={newSoilType}
                    onChange={(e) => setNewSoilType(e.target.value)}
                    placeholder="e.g. Black Soil, Alluvial"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Irrigation Method</label>
                  <input
                    type="text"
                    value={newIrrigation}
                    onChange={(e) => setNewIrrigation(e.target.value)}
                    placeholder="e.g. Drip, Canal, Sprinkler"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Farmer Notes / Schedule</label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Tested soil NPK, scheduled urea broadcast next week..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
