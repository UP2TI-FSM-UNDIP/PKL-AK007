"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, Bell, User } from "lucide-react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const formSchema = z.object({
  namaLengkap: z.string().min(2, {
    message: "Nama lengkap harus diisi.",
  }),
  role: z.string(),
  nim: z.string(),
  email: z.string().email(),
  departemen: z.string(),
  programStudi: z.string(),
  tempatLahir: z.string(),
  tanggalLahir: z.date({
    required_error: "Tanggal lahir harus diisi.",
  }),
  noHp: z.string(),
  alamat: z.string(),
})

export default function IdentitasPemohonPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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
    <div className="min-h-screen bg-zinc-50/50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-[#0078C9] text-white shadow-sm">
        <div className="flex h-16 items-center justify-between px-6 w-full">
          <div className="flex items-center gap-2 font-bold text-lg">
            {/* Placeholder Logo */}
            <div className="h-8 w-8 rounded bg-white/20 flex items-center justify-center">
              <span className="text-xs">LOGO</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-normal opacity-90">Fakultas</span>
              <span>SAINS DAN MATEMATIKA</span>
              <span className="text-[10px] font-normal opacity-80">UNIVERSITAS DIPONEGORO</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-white hidden sm:block">Mahasiswa</span>
              <Avatar className="h-9 w-9 border-2 border-white/20">
                <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                <AvatarFallback className="bg-sky-200 text-sky-900 font-bold">AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Top Breadcrumb */}
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

      <main className="container mx-auto py-8 px-4 max-w-5xl">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Form Pengajuan Surat</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Identitas Pemohon</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Identitas Pemohon</h1>
          <p className="text-slate-500 mt-2 max-w-2xl">
            Data berikut diisi secara otomatis berdasarkan data Anda. Mohon periksa kembali dan lengkapi data yang diperlukan.
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-12 mt-8">
          <div className="relative flex justify-between items-start">
            {/* Connecting Line */}
            <div className="absolute top-4 left-0 w-full -z-10 px-4">
              <div className="h-[2px] w-full bg-slate-200"></div>
            </div>
            
            {/* Step 1 */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0078C9] text-white text-sm font-bold ">
                1
              </div>
              <span className="text-xs font-bold text-[#0078C9] mt-1">Info Pengajuan</span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-500 text-sm font-bold ">
                2
              </div>
              <span className="text-xs font-medium text-slate-500 mt-1">Detail Pengajuan</span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-500 text-sm font-bold ">
                3
              </div>
              <span className="text-xs font-medium text-slate-500 mt-1">Lampiran</span>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-500 text-sm font-bold ">
                4
              </div>
              <span className="text-xs font-medium text-slate-500 mt-1">Review & Ajukan</span>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <FormField
                    control={form.control}
                    name="namaLengkap"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Lengkap</FormLabel>
                        <FormControl>
                          <Input className="bg-slate-50/50" readOnly {...field} />
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
                          <Input className="bg-slate-50/50" readOnly {...field} />
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
                          <Input className="bg-slate-50/50" readOnly {...field} />
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
                          <Input className="bg-slate-50/50" readOnly {...field} />
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
                          <Input className="bg-slate-50/50" readOnly {...field} />
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
                          <Input className="bg-slate-50/50" readOnly {...field} />
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
                          <Input className="bg-slate-50/50" {...field} />
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
                                  "w-full pl-3 text-left font-normal bg-slate-50/50 border-input h-10 px-3 py-2",
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
            <Button className="bg-slate-300 text-slate-500 hover:bg-slate-400 cursor-not-allowed">Lanjut</Button>
          </div>
        </div>
      </main>
    </div>
  )
}
