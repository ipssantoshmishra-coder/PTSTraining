import { Incharge, Hostel, Recruit, RecruitPayload } from "@/types";

const API_URL = "http://127.0.0.1:8000";

export const fetchDashboardData = async (): Promise<{
  recruits: Recruit[];
  incharges: Incharge[];
  hostels: Hostel[];
}> => {
  const [resRecruits, resIncharges, resHostels] = await Promise.all([
    fetch(`${API_URL}/recruits/`),
    fetch(`${API_URL}/incharges/`),
    fetch(`${API_URL}/hostels/`),
  ]);

  const recruits = await resRecruits.json();
  const incharges = await resIncharges.json();
  const hostels = await resHostels.json();

  return {
    recruits: Array.isArray(recruits) ? recruits : [],
    incharges: Array.isArray(incharges) ? incharges : [],
    hostels: Array.isArray(hostels) ? hostels : [],
  };
};

export const createIncharge = async (data: Omit<Incharge, "id">) => {
  const res = await fetch(`${API_URL}/incharges/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.ok;
};

export const createRecruit = async (payload: RecruitPayload) => {
  const res = await fetch(`${API_URL}/recruits/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.ok;
};