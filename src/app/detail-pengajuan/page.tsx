"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Navbar } from "@/components/Navbar";
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

export default function DetailPengajuanPage() {
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

  return (
    <div className="min-h-screen bg-[#F3F3F3]">
      <Navbar />

      <main className="container mx-auto max-w-5xl px-4 py-8">
        <PageHeader
          title="Detail Pengajuan"
          description="Lengkapi detail utama dari surat yang akan diajukan."
          breadcrumbItems={[
            { label: "Form Pengajuan Surat", href: "/" },
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

        <Card className="border-none shadow-sm mt-6">
          <CardContent className="p-6 md:px-16 md:py-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          <Button variant="outline" className="px-8" asChild>
            <a href="/">Kembali</a>
          </Button>
          <div className="flex gap-4">
            <Button variant="outline" className="border-[#0078C9] text-[#0078C9] hover:bg-[#0078C9]/5">
              Simpan Draft
            </Button>
            <Button
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
              disabled={!form.formState.isValid}
              className={form.formState.isValid ? "bg-[#0078C9] text-white hover:bg-[#0078C9]/90" : "cursor-not-allowed bg-slate-300 text-slate-500"}
              asChild
            >
              <a href="/lampiran">Lanjut</a>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
