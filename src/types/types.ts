export interface UserType {
  id: number;
  name: string;
  email: string;
  role_id: number;
}

export interface IzdavaciType {
  id: number;
  name: string;
}

export interface RoleType {
  id: string;
  name: string;
}

export interface FakturaType {
  id: number;
  br_faktura: number;
  basic_info_id: number;
  smetkovodstvo_id: number;
  evidencija_id: number;
  tip_id: number;
  status: string;
  review_comment: string;
  faktura_id: number;
  is_sealed: boolean;
  approved_by: number;
  approved_at: string;
  created_at: string;
  updated_at: string;
}

export interface Baratel {
  id: number;
  name: string;
}

export interface Baratel {
  id: number;
  name: string;
}

export interface Izdavac {
  id: number;
  name: string;
}

export interface Props {
    onClose?: () => void;
}
