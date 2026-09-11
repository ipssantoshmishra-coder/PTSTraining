"use client";

import React, { useState, useEffect } from "react";
import { Shield, RefreshCw } from "lucide-react";
import { Recruit, Incharge } from "@/types";
import { fetchDashboardData } from "@/lib/api";
import RecruitForm from "@/components/RecruitForm";
import InchargeForm from "@/components/InchargeForm";
import RecruitRosterTable from "@/components/RecruitRosterTable";

export default function AdminDashboard() {
  const [recruits, setRecruits] = useState<Recruit[]>([]);
  const [incharges, setIncharges] = useState<Incharge[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"recruit" | "incharge">("recruit");

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchDashboardData();
      setRecruits(data.recruits);
      setIncharges(data.incharges);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="bg-indigo-900 text-white px-8 py-5 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-amber-400" />
          <div>
            <h1 className="text-xl font-bold tracking-wide">POLICE ACADEMY MANAGEMENT PORTAL</h1>
            <p className="text-xs text-indigo-200">Kushinagar Police Training Center</p>
          </div>
        </div>
        <button
          onClick={loadData}
          className="flex items-center gap-2 bg-indigo-800 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Data
        </button>
      </header>

      <main className="p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
          <div className="flex border-b mb-6 gap-4">
            <button
              onClick={() => setActiveTab("recruit")}
              className={`pb-2 font-bold text-sm ${
                activeTab === "recruit"
                  ? "border-b-2 border-indigo-900 text-indigo-900"
                  : "text-slate-400"
              }`}
            >
              Add Recruit
            </button>
            <button
              onClick={() => setActiveTab("incharge")}
              className={`pb-2 font-bold text-sm ${
                activeTab === "incharge"
                  ? "border-b-2 border-indigo-900 text-indigo-900"
                  : "text-slate-400"
              }`}
            >
              Add Incharge
            </button>
          </div>

          {activeTab === "recruit" ? (
            <RecruitForm incharges={incharges} onSuccess={loadData} />
          ) : (
            <InchargeForm onSuccess={loadData} />
          )}
        </section>

        <section className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <RecruitRosterTable recruits={recruits} />
        </section>
      </main>
    </div>
  );
}