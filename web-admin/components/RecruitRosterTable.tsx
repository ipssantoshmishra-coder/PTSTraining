"use client";

import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { Recruit } from "@/types";

interface Props {
  recruits: Recruit[];
}

export default function RecruitRosterTable({ recruits }: Props) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter dynamically by Roll Number or Name
  const filteredRecruits = recruits.filter((r) =>
    r.roll_number.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
    r.full_name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  return (
    <div className="space-y-4">
      {/* Search Bar Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-lg font-bold text-slate-900">
          Active Roster ({filteredRecruits.length} of {recruits.length})
        </h2>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Roll No or Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b text-slate-600 text-xs uppercase font-bold">
              <th className="py-3 px-4">Roll No</th>
              <th className="py-3 px-4">Name & District</th>
              <th className="py-3 px-4">Bed / Barrack</th>
              <th className="py-3 px-4">Indoor Incharge</th>
              <th className="py-3 px-4">Outdoor Incharge</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredRecruits.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  {searchTerm
                    ? `No recruit found matching "${searchTerm}".`
                    : "No recruits found in system."}
                </td>
              </tr>
            ) : (
              filteredRecruits.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-bold text-indigo-900">{r.roll_number}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">{r.full_name}</div>
                    <div className="text-xs text-slate-500">{r.home_district || "N/A"}</div>
                  </td>
                  <td className="py-3 px-4 text-xs font-medium text-slate-600">
                    Bed: {r.bed_number || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-700">
                    {r.indoor_incharge ? (
                      <div>
                        <div className="font-medium">{r.indoor_incharge.full_name}</div>
                        <div className="text-slate-400">{r.indoor_incharge.phone_number}</div>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-700">
                    {r.outdoor_incharge ? (
                      <div>
                        <div className="font-medium">{r.outdoor_incharge.full_name}</div>
                        <div className="text-slate-400">{r.outdoor_incharge.phone_number}</div>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Unassigned</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}