export interface Incharge {
  id: number;
  full_name: string;
  phone_number: string;
  designation: string;
}

export interface Hostel {
  id: number;
  name: string;
  incharge?: Incharge;
}

export interface Barrack {
  id: number;
  barrack_number: string;
  hostel?: Hostel;
}

export interface Recruit {
  id: number;
  roll_number: string;
  full_name: string;
  phone_number: string;
  home_district: string;
  bed_number: string;
  barrack?: Barrack;
  indoor_incharge?: Incharge;
  outdoor_incharge?: Incharge;
}

export interface RecruitPayload {
  roll_number: string;
  full_name: string;
  phone_number: string;
  home_district: string;
  bed_number: string;
  barrack_id: number | null;
  indoor_incharge_id: number | null;
  outdoor_incharge_id: number | null;
  mess_incharge_id: number | null;
}