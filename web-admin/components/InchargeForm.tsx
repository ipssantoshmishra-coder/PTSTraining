"use client";

import React, { useState } from "react";
import { createIncharge } from "@/lib/api";

interface Props {
  onSuccess: () => void;
}

export default function InchargeForm({ onSuccess }: Props) {
  const [inchargeName, setInchargeName] = useState("");
  const [inchargePhone, setInchargePhone] = useState("");
  const [inchargeDesignation, setInchargeDesignation] = useState("Instructor");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inchargeName || !inchargePhone) return alert("Fill in required incharge details");

    const success = await createIncharge({
      full_name: inchargeName.trim(),
      phone_number: inchargePhone.trim(),
      designation: inchargeDesignation.trim(),
    });

    if (success) {
      alert("Incharge added successfully!");
      setInchargeName("");
      setInchargePhone("");
      onSuccess();
    } else {
      alert("Failed to create incharge");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">Incharge Name *</label>
        <input
          type="text"
          placeholder="e.g. Dinesh Tiwari"
          value={inchargeName}
          onChange={(e) => setInchargeName(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">Contact Number *</label>
        <input
          type="text"
          placeholder="Phone Number"
          value={inchargePhone}
          onChange={(e) => setInchargePhone(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">Designation</label>
        <input
          type="text"
          placeholder="e.g. Indoor Incharge"
          value={inchargeDesignation}
          onChange={(e) => setInchargeDesignation(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <button type="submit" className="w-full bg-indigo-900 text-white py-2.5 rounded-lg font-semibold text-sm">
        Save Staff Incharge
      </button>
    </form>
  );
}