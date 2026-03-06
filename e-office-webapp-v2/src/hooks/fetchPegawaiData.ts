import { useEffect, useState } from "react";
import { AxiosService } from "@/utils/axios";

export function useAllPegawaiData(roleId: number) {
  const [dataPegawai, setDataPegawai] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setLoading(true);
        const axios = new AxiosService();
        const res = await axios.get(`/v1/pegawai/${roleId}`);
        if (!isMounted) return;
        const data = (res as any)?.data?.data ?? [];
        setDataPegawai(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!isMounted) return;
        setError(err);
        setDataPegawai([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [roleId]);

  return { dataPegawai, isLoading, error };
}
