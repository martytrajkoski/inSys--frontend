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
export interface BrKartonType {
  id: number;
  name: string;
}

export interface RoleType {
  id: string;
  name: string;
}

export interface FakturaType {
  id: number;
  arhivski_br: string;
  br_faktura: string;
  basic_info_id: number;
  smetkovodstvo_id: number;
  evidencija_id: number;
  tip_id: number;
  status: string;
  review_comment: string;
  faktura_id: number;
  is_sealed: number;
  approved_by: UserType;
  approved_at: string;
  rejected_at: string;
  created_at: string;
  updated_at: string;
  tip_nabavka: TipNabavkaType;
  smetkovodstvo: SmetkovodstvoType;
  baratel_javna_nabavka: BaratelNabavkaType;
  tehnicki_sekretar: TehnickiSekretarType;
  read: boolean;
}

export interface TipNabavkaType {
  id: number;
  br_faktura: string;
  vk_vrednost: number;
  datum: string;
  tip: "javna" | "tender";
  status: string;
  review_comment: string;
  created_at: string;
  updated_at: string;
  read: number;
  submited_by: UserType;
  updated_by: UserType;

  javna_nabavka?: {
    id: number;
    br_dogovor: number;
    vaznost_do: string;
    ostanati_rasp_sredstva: number;
    soglasno_dogovor: number;
    created_at: string;
    updated_at: string;
  };

  tender?: {
    id: number;
    ist_tip: number;
    vk_potroseno: number;
    created_at: string;
    updated_at: string;
    tip_id: number;
  };
}

export interface SmetkovodstvoType {
  id: number;
  br_faktura: string;
  br_karton: string;
  datum: string;
  konto: string;
  smetka: string;
  osnova_evidentiranje: number;
  sostojba_karton: string;
  formular: number;
  vneseni_sredstva: number;
  status: string;
  review_comment: string;
  read: number;
  created_at: string;
  updated_at: string;
  submited_by: UserType;
  updated_by: UserType;
}

export interface BaratelNabavkaType {
  id: number;
  br_faktura: string;
  br_karton: number;
  datum: string;
  naziv_proekt: string;
  poteklo: string;
  status: string;
  review_comment: string;
  read: number;
  created_at: string;
  updated_at: string;
  baratel: string;
  submited_by: UserType;
  updated_by: UserType;
}

export interface TehnickiSekretarType {
  id: number;
  br_faktura: string;
  datum: string;
  arhivski_br: string;
  iznos_dogovor: number;
  scan_file: string;
  review_comment: string;
  status: string;
  created_at: string;
  updated_at: string;
  izdavaci_id: number;
  izdavac: string;
  submited_by: UserType;
  updated_by: UserType;
}

export interface Izdavac {
  id: number;
  name: string;
}

export interface PropsModal {
  onClose?: () => void;
}

export interface InvoiceType {
  items: FakturaType[];
  role: string;
}

export type CommentProp = {
  brFaktura: string;
  endpoint: string;
  initialStatus?: string | "";
  initialComment?: string | "";
};
