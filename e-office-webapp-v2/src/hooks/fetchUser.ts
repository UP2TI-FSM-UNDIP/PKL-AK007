import { useEffect, useState } from "react";
import { AxiosService } from "@/utils/axios";
import type { Mahasiswa } from "@/utils/data";

export function useUserMahasiswa() {
  const [data, setData] = useState<Mahasiswa | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setLoading(true);
        const axios = new AxiosService();
        const res = await axios.get("/v1/role/mahasiswa");
        if (!isMounted) return;
        setData((res as any)?.data?.data ?? null);
      } catch (err) {
        if (!isMounted) return;
        setError(err);
        setData(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, isLoading, error };
}
