"use client";
export const dynamic = "force-dynamic";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { FormStepper } from "@/components/FormStepper";
import { StudentNavbar } from "@/components/student/StudentNavbar";
import { PageHeader } from "@/components/PageHeader";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  namaLengkap: z.string().min(2, {
    message: "Nama lengkap harus diisi.",
  }),
  role: z.string().min(1, { message: "Role harus diisi." }),
  nim: z.string().regex(/^\d{12,14}$/, {
    message: "NIM harus 12-14 digit angka",
  }),
  email: z.string().email({
    message: "Format email tidak valid",
  }),
  departemen: z.string().min(1, { message: "Departemen harus diisi." }),
  programStudi: z.string().min(1, { message: "Program studi harus diisi." }),
  tempatLahir: z.string().min(1, { message: "Tempat lahir harus diisi." }),
  tanggalLahir: z
    .date({
    })
    .max(new Date(), {
      message: "Tanggal lahir tidak valid",
    }),
  noHp: z.string().regex(/^\+62\d{9,12}$/, {
    message: "Format nomor HP tidak valid (awalan +62, 9-12 digit)",
  }),
  alamat: z.string().min(1, { message: "Alamat harus diisi." }),
});

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
const formatRoleName = (role?: string) => {
  if (!role) return "";
  return role
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function IdentitasPemohonPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [, setSidebarOpen] = React.useState(false);
  const isResubmit = searchParams?.get("resubmit") === "1";
  const isSavingRef = React.useRef(false);
  const profileLoadedRef = React.useRef(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      namaLengkap: "",
      role: "",
      nim: "",
      email: "",
      departemen: "",
      programStudi: "",
      tempatLahir: "",
      tanggalLahir: undefined,
      noHp: "",
      alamat: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

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
    const resubmit = searchParams?.get("resubmit");
    const letterId = searchParams?.get("letterId");
    if (letterId) {
      sessionStorage.setItem("resubmitLetterId", letterId);
      return;
    }
    if (!resubmit) {
      return;
    }
    const stored = sessionStorage.getItem("resubmitLetterId");
    if (!stored) {
      return;
    }
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("letterId", stored);
    router.replace(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams]);

  React.useEffect(() => {
    const draftId = searchParams?.get("draftId");
    const letterId = searchParams?.get("letterId");
    if (draftId || letterId || profileLoadedRef.current) {
      return;
    }
    const loadProfile = async () => {
      try {
        const response = await fetch(`${API_BASE}/profile`, {
          credentials: "include",
        });
        if (!response.ok) {
          return;
        }
        const profile = (await response.json()) as {
          name?: string;
          email?: string;
          mahasiswa?: {
            nim?: string;
            noHp?: string;
            alamat?: string;
            tempatLahir?: string;
            tanggalLahir?: string;
            departemen?: { name?: string };
            programStudi?: { name?: string };
          };
          userRole?: { role?: { name?: string } }[];
        };
        const mahasiswa = profile.mahasiswa;
        if (form.formState.isDirty) {
          return;
        }
        const roleName = formatRoleName(profile.userRole?.[0]?.role?.name);
        form.reset({
          ...form.getValues(),
          namaLengkap: profile.name ?? "",
          role: roleName,
          nim: mahasiswa?.nim ?? "",
          email: profile.email ?? "",
          departemen: mahasiswa?.departemen?.name ?? "",
          programStudi: mahasiswa?.programStudi?.name ?? "",
          tempatLahir: mahasiswa?.tempatLahir ?? "",
          tanggalLahir: mahasiswa?.tanggalLahir ? new Date(mahasiswa.tanggalLahir) : undefined,
          noHp: mahasiswa?.noHp ?? "",
          alamat: mahasiswa?.alamat ?? "",
        });
        profileLoadedRef.current = true;
      } catch (error) {
        console.warn("Failed to load profile data", error);
      }
    };

    loadProfile();
  }, [form, searchParams]);

  React.useEffect(() => {
    const draftId = searchParams?.get("draftId");
    const letterId = searchParams?.get("letterId");
    if (!draftId) {
      if (!letterId) {
        return;
      }

      const loadLetter = async () => {
        try {
          const response = await fetch(`${API_BASE}/letters/${letterId}`, {
            credentials: "include",
          });
          if (!response.ok) {
            return;
          }
          const letter = (await response.json()) as {
            values?: Omit<z.infer<typeof formSchema>, "tanggalLahir"> & {
              tanggalLahir?: string;
            };
          };
          if (isResubmit) {
            sessionStorage.setItem("resubmitOriginalValues", JSON.stringify(letter.values ?? {}));
            sessionStorage.setItem("resubmitLetterId", letterId);
          }
          const parsedTanggal = letter.values?.tanggalLahir
            ? new Date(letter.values.tanggalLahir)
            : form.getValues("tanggalLahir");
          form.reset({
            ...letter.values,
            tanggalLahir: parsedTanggal,
          });
        } catch (error) {
          console.warn("Failed to load letter data", error);
        }
      };

      loadLetter();
      return;
    }

    const loadDraft = async () => {
      try {
        const response = await fetch(`${API_BASE}/drafts/${draftId}`, {
          credentials: "include",
        });
        if (!response.ok) {
          return;
        }
        const draft = (await response.json()) as {
          data: Omit<z.infer<typeof formSchema>, "tanggalLahir"> & {
            tanggalLahir?: string;
          };
        };
        const parsedTanggal = draft.data.tanggalLahir
          ? new Date(draft.data.tanggalLahir)
          : form.getValues("tanggalLahir");
        form.reset({
          ...draft.data,
          tanggalLahir: parsedTanggal,
        });
      } catch (error) {
        console.warn("Failed to load draft data", error);
      }
    };

    loadDraft();
  }, [form, searchParams]);

  const handleSaveDraft = async (): Promise<string | null> => {
    if (isSavingRef.current) {
      return searchParams?.get("draftId") ?? null;
    }
    isSavingRef.current = true;
    const draftId = searchParams?.get("draftId");
    const values = form.getValues();
    const payload = {
      title: "Surat Keterangan Mahasiswa",
      data: {
        ...values,
        tanggalLahir: values.tanggalLahir ? values.tanggalLahir.toISOString().slice(0, 10) : "",
      },
    };

    const url = draftId ? `${API_BASE}/drafts/${draftId}` : `${API_BASE}/drafts`;
    const method = draftId ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.warn("Gagal menyimpan draft");
        return null;
      }

      if (!draftId) {
        const created = (await response.json()) as { id?: string };
        if (created?.id) {
          const revision = searchParams?.get("revision") ? "&revision=1" : "";
          const resubmit = isResubmit ? "&resubmit=1" : "";
          const letterId = searchParams?.get("letterId");
          const letterQuery = letterId ? `&letterId=${letterId}` : "";
          router.replace(`/mahasiswa/identitas-pemohon?draftId=${created.id}${revision}${resubmit}${letterQuery}`);
          return created.id;
        }
      }

      return draftId ?? null;
    } finally {
      isSavingRef.current = false;
    }
  };

  const draftId = searchParams?.get("draftId");

  const handleNext = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      return;
    }

    const savedId = await handleSaveDraft();
    if (!savedId) {
      alert("Gagal menyimpan draft. Pastikan sudah login dan API bisa diakses.");
      return;
    }
    const revision = searchParams?.get("revision") ? "&revision=1" : "";
    const resubmit = isResubmit ? "&resubmit=1" : "";
    const letterId = searchParams?.get("letterId");
    const letterQuery = letterId ? `&letterId=${letterId}` : "";
    router.push(`/mahasiswa/detail-pengajuan?draftId=${savedId}${revision}${resubmit}${letterQuery}`);
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

  return (
    <div className="min-h-screen bg-[#F3F3F3]">
      <StudentNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} />

      <div className="w-full px-6 py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/mahasiswa/identitas-pemohon">Form Pengajuan Surat</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <span className="text-slate-400">/</span>
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Identitas Pemohon</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <main className="container mx-auto max-w-5xl px-4 py-8">
        <PageHeader
          title="Identitas Pemohon"
          description="Data berikut diisi secara otomatis berdasarkan data Anda. Mohon periksa kembali dan lengkapi data yang diperlukan."
          breadcrumbItems={[
            { label: "Form Pengajuan Surat", href: "/mahasiswa/identitas-pemohon" },
            { label: "Identitas Pemohon" },
          ]}
        />

        <FormStepper
          currentStep={1}
          steps={[
            { label: "Info Pengajuan" },
            { label: "Detail Pengajuan" },
            { label: "Lampiran" },
            { label: "Review & Ajukan" },
          ]}
        />

        <Card className="border-none shadow-sm">
          <CardContent className="p-6 md:px-20 md:py-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
                  <FormField
                    control={form.control}
                    name="namaLengkap"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Lengkap</FormLabel>
                        <FormControl>
                          <Input className="bg-slate-100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <Input className="bg-slate-100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nim"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NIM</FormLabel>
                        <FormControl>
                          <Input className="bg-slate-100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input className="bg-slate-100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="departemen"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Departemen</FormLabel>
                        <FormControl>
                          <Input className="bg-slate-100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="programStudi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Program Studi</FormLabel>
                        <FormControl>
                          <Input className="bg-slate-100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tempatLahir"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tempat Lahir</FormLabel>
                        <FormControl>
                          <Input className="bg-slate-100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tanggalLahir"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Tanggal Lahir</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "h-10 w-full bg-slate-100 px-3 py-2 pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "MM/dd/yyyy")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              captionLayout="dropdown"
                              fromYear={1900}
                              toYear={new Date().getFullYear()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="noHp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>No. HP</FormLabel>
                        <FormControl>
                          <Input placeholder="Contoh: 081234567890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="alamat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alamat</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan Alamat" {...field} />
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
          <Button variant="outline" className="px-8">
            Kembali
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
              className={cn(
                "transition-colors",
                form.formState.isValid
                  ? "bg-[#0078C9] text-white hover:bg-[#0078C9]/90"
                  : "cursor-not-allowed bg-slate-300 text-slate-500 hover:bg-slate-400"
              )}
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
