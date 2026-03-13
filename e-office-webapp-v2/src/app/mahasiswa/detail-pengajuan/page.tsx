"use client";
export const dynamic = "force-dynamic";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { StudentNavbar } from "@/components/student/StudentNavbar";
import { PageHeader } from "@/components/PageHeader";
import { FormStepper } from "@/components/FormStepper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  jenisSurat: z.string(),
  keperluan: z.string().min(1, { message: "Keperluan harus diisi." }),
});

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function DetailPengajuanPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [, setSidebarOpen] = React.useState(false);
  const isResubmit = searchParams?.get("resubmit") === "1";
  const isSavingRef = React.useRef(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      jenisSurat: "AK 007",
      keperluan: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  React.useEffect(() => {
    const revision = searchParams?.get("revision");
    const letterId = searchParams?.get("letterId");
    if (letterId) {
      sessionStorage.setItem("revisionLetterId", letterId);
      return;
    }
    if (!revision) {
      return;
    }
    const stored = sessionStorage.getItem("revisionLetterId");
    if (!stored) {
      return;
    }
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("letterId", stored);
    router.replace(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams]);

  React.useEffect(() => {
    const draftId = searchParams?.get("draftId");
    if (!draftId) return;

    const loadDraft = async () => {
      try {
        const response = await fetch(`${API_BASE}/drafts/${draftId}`, {
          credentials: "include",
        });
        if (!response.ok) return;
        const draft = (await response.json()) as { data?: { keperluan?: string } };
        if (draft?.data?.keperluan) {
          form.reset({
            ...form.getValues(),
            keperluan: draft.data.keperluan,
          });
        }
      } catch (error) {
        console.warn("Failed to load draft detail", error);
      }
    };

    loadDraft();
  }, [form, searchParams]);

  const handleSaveDraft = async () => {
    if (isSavingRef.current) {
      return;
    }
    const draftId = searchParams?.get("draftId");
    if (!draftId) {
      return;
    }
    const values = form.getValues();
    isSavingRef.current = true;
    try {
      await fetch(`${API_BASE}/drafts/${draftId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            jenisSurat: values.jenisSurat,
            keperluan: values.keperluan,
          },
        }),
      });
    } finally {
      isSavingRef.current = false;
    }
  };

  const handleNext = async () => {
    await handleSaveDraft();
    const draftId = searchParams?.get("draftId");
    const revision = searchParams?.get("revision") === "1";
    const resubmit = isResubmit;
    const letterId = searchParams?.get("letterId");
    const queryParts = [
      ...(revision ? ["revision=1"] : []),
      ...(resubmit ? ["resubmit=1"] : []),
      ...(letterId ? [`letterId=${letterId}`] : []),
    ];
    const query = queryParts.length ? `?${queryParts.join("&")}` : "";
    router.push(
      draftId
        ? `/mahasiswa/lampiran?draftId=${draftId}${query ? `&${query.slice(1)}` : ""}`
        : `/mahasiswa/lampiran${query}`,
    );
  };

  const watchedValues = form.watch();
  React.useEffect(() => {
    if (!form.formState.isDirty) {
      return;
    }

    const timer = setTimeout(() => {
      void handleSaveDraft();
    }, 800);

    return () => clearTimeout(timer);
  }, [form.formState.isDirty, handleSaveDraft, watchedValues]);

  const backHref = (() => {
    const draftId = searchParams?.get("draftId");
    const revision = searchParams?.get("revision") === "1";
    const resubmit = isResubmit;
    const letterId = searchParams?.get("letterId");
    const queryParts = [
      ...(revision ? ["revision=1"] : []),
      ...(resubmit ? ["resubmit=1"] : []),
      ...(letterId ? [`letterId=${letterId}`] : []),
    ];
    const query = queryParts.length ? `?${queryParts.join("&")}` : "";
    return draftId
      ? `/mahasiswa/identitas-pemohon?draftId=${draftId}${query ? `&${query.slice(1)}` : ""}`
      : `/mahasiswa/identitas-pemohon${query}`;
  })();

  return (
    <div className="min-h-screen bg-[#F3F3F3]">
      <StudentNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} />

      <main className="container mx-auto max-w-5xl px-4 py-8">
        <PageHeader
          title="Detail Pengajuan"
          description="Lengkapi detail utama dari surat yang akan diajukan."
          breadcrumbItems={[
            { label: "Form Pengajuan Surat", href: "/mahasiswa/identitas-pemohon" },
            { label: "Detail Pengajuan" },
          ]}
        />

        <FormStepper
          currentStep={2}
          steps={[
            { label: "Info Pengajuan" },
            { label: "Detail Pengajuan" },
            { label: "Lampiran" },
            { label: "Review & Ajukan" },
          ]}
        />

        <Card className="mt-6 border-none shadow-sm">
          <CardContent className="p-6 md:px-16 md:py-8">
            <Form {...form}>
              <form className="space-y-6">
                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="jenisSurat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jenis Surat</FormLabel>
                        <FormControl>
                          <Input className="bg-slate-100" readOnly {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="keperluan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Keperluan Surat</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Tulis perihal singkat yang mewakili isi surat."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-between">
          <Button variant="outline" asChild>
            <Link href={backHref}>Kembali</Link>
          </Button>

          <div className="flex gap-4">
            <Button
              variant="outline"
              className="border-[#0078C9] text-[#0078C9] hover:bg-[#0078C9]/5"
              onClick={handleSaveDraft}
            >
              Simpan Draft
            </Button>

            <Button
              type="button"
              disabled={!form.formState.isValid}
              className={
                form.formState.isValid
                  ? "bg-[#0078C9] text-white hover:bg-[#0078C9]/90"
              : "cursor-not-allowed bg-slate-300 text-slate-500"
            }
              onClick={handleNext}
            >
              Lanjut
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
