"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Navbar } from "@/components/Navbar"
import { PageHeader } from "@/components/PageHeader"
import { FormStepper } from "@/components/FormStepper"

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
  tanggalLahir: z.date({
    required_error: "Tanggal lahir harus diisi.",
  }).max(new Date(), {
    message: "Tanggal lahir tidak valid",
  }),
  noHp: z.string().regex(/^08\d{8,}$/, {
    message: "Format nomor HP tidak valid (awalan 08, min 10 digit)",
  }),
  alamat: z.string().min(1, { message: "Alamat harus diisi." }),
})

export default function IdentitasPemohonPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      namaLengkap: "Ahmad Douglas",
      role: "Mahasiswa",
      nim: "24060121130089",
      email: "ahmaddouglas@students.undip.ac.id",
      departemen: "Informatika",
      programStudi: "S1 - Informatika",
      tempatLahir: "Blora",
      tanggalLahir: new Date("2006-03-18"),
      noHp: "",
      alamat: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <div className="min-h-screen bg-[#F3F3F3]">
      {/* Navbar */}
      <Navbar />

      {/* Breadcrumb Atas */}
      <div className="w-full px-6 py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Form Pengajuan Surat</BreadcrumbLink>
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

      {/* Header dan Breadcrumb */}
      <main className="container mx-auto py-8 px-4 max-w-5xl">
        <PageHeader
          title="Identitas Pemohon"
          description="Data berikut diisi secara otomatis berdasarkan data Anda. Mohon periksa kembali dan lengkapi data yang diperlukan."
          breadcrumbItems={[
            { label: "Form Pengajuan Surat", href: "/" },
            { label: "Identitas Pemohon" },
          ]}
        />
        {/* Stepper */}
        <FormStepper
          currentStep={1}
          steps={[
            { label: "Info Pengajuan" },
            { label: "Detail Pengajuan" },
            { label: "Lampiran" },
            { label: "Review & Ajukan" },
          ]}
        />

        {/* Form Card */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-6 md:px-20 md:py-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  
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
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal bg-slate-100 border-input h-10 px-3 py-2",
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

        {/* Action Buttons */}
        <div className="mt-8 flex justify-between">
          <Button variant="outline" className="px-8">Kembali</Button>
          <div className="flex gap-4">
            <Button variant="outline" className="text-[#0078C9] border-[#0078C9] hover:bg-[#0078C9]/5">Simpan Draft</Button>
            <Button 
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
              disabled={!form.formState.isValid}
              className={cn(
                "transition-colors",
                form.formState.isValid 
                  ? "bg-[#0078C9] hover:bg-[#0078C9]/90 text-white" 
                  : "bg-slate-300 text-slate-500 hover:bg-slate-400 cursor-not-allowed"
              )}
            >
              Lanjut
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
