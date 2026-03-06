export type Pegawai = {
  uuid?: string;
  name?: string;
  Pegawai?: {
    nip?: string;
    id_prodi?: string | number | null;
    no_hp?: string | null;
  };
  [key: string]: any;
};
