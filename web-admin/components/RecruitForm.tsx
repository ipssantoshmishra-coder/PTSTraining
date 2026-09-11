"use client";

import React, { useState } from "react";
import { Incharge } from "@/types";
import { createRecruit } from "@/lib/api";

interface Props {
  incharges: Incharge[];
  onSuccess: () => void;
}

export default function RecruitForm({ incharges, onSuccess }: Props) {
  const [rollNumber, setRollNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [homeDistrict, setHomeDistrict] = useState("");
  const [bedNumber, setBedNumber] = useState("");

  const [selectedIndoorId, setSelectedIndoorId] = useState("");
  const [selectedOutdoorId, setSelectedOutdoorId] = useState("");
  const [selectedMessId, setSelectedMessId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNumber || !fullName || !phoneNumber) return alert("Fill in required fields");

    const success = await createRecruit({
      roll_number: rollNumber.trim(),
      full_name: fullName.trim(),
      phone_number: phoneNumber.trim(),
      home_district: homeDistrict.trim() || "N/A",
      bed_number: bedNumber.trim() || "N/A",
      barrack_id: null,
      indoor_incharge_id: selectedIndoorId ? parseInt(selectedIndoorId) : null,
      outdoor_incharge_id: selectedOutdoorId ? parseInt(selectedOutdoorId) : null,
      mess_incharge_id: selectedMessId ? parseInt(selectedMessId) : null,
    });

    if (success) {
      alert("Recruit registered successfully!");
      setRollNumber("");
      setFullName("");
      setPhoneNumber("");
      setHomeDistrict("");
      setBedNumber("");
      onSuccess();
    } else {
      alert("Failed to submit recruit");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">Roll Number *</label>
        <input
          type="text"
          placeholder="e.g. 3870223"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name *</label>
        <input
          type="text"
          placeholder="Sachin Verma"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Phone *</label>
          <input
            type="text"
            placeholder="Mobile"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Home District</label>
          <input
            type="text"
            placeholder="e.g. Ambedkar Nagar"
            value={homeDistrict}
            onChange={(e) => setHomeDistrict(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="pt-2 border-t">
        <span className="text-xs font-bold text-indigo-900 uppercase block mb-2">Assign Instructors</span>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Indoor Incharge</label>
            <select
              value={selectedIndoorId}
              onChange={(e) => setSelectedIndoorId(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none bg-white"
            >
              <option value="">-- Select Incharge --</option>
              {incharges.map((i) => (
                <option key={i.id} value={i.id}>{i.full_name} ({i.designation})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Outdoor Incharge</label>
            <select
              value={selectedOutdoorId}
              onChange={(e) => setSelectedOutdoorId(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm outline-none bg-white"
            >
              <option value="">-- Select Incharge --</option>
              {incharges.map((i) => (
                <option key={i.id} value={i.id}>{i.full_name} ({i.designation})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button type="submit" className="w-full bg-indigo-900 text-white py-2.5 rounded-lg font-semibold text-sm">
        Save Recruit
      </button>
    </form>
  );
}