export type APIResponse<T = unknown> = {
  data: T;
  message?: string;
  status?: string;
};

export type PegawaiCore = {
  nip?: string;
  id_prodi?: string | number | null;
  no_hp?: string | null;
  jabatan?: string;
  uuid?: string;
};

export type User = {
  uuid?: string;
  name?: string;
  email?: string;
  Pegawai?: PegawaiCore;
  TandaTangan?: any[];
  [key: string]: any;
};

export type Mahasiswa = {
  nim?: string;
  user?: { name?: string; [key: string]: any };
  prodi?: { nama_prodi?: string } | string;
  [key: string]: any;
};

export type SuratMasuk = {
  id?: string;
  tipe_suratId?: string;
  status?: string;
  keterangan_surat?: string;
  listLampiran?: string;
  information?: string;
  [key: string]: any;
};
