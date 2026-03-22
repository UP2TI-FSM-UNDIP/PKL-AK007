type StudentLetterPreviewProps = {
  nomor?: string;
  applicant: {
    name: string;
    nim: string;
    program: string;
    birthPlace: string;
    birthDate: string;
    address: string;
    semester: string;
  };
  academicYear: { start: string; end: string };
  keperluan: string;
  signatureDate?: string;
  signatureImage?: string | null;
};

export function StudentLetterPreview({
  nomor = "........../UN7.F8.4/AK/...../20...",
  applicant,
  academicYear,
  keperluan,
  signatureDate,
  signatureImage,
}: StudentLetterPreviewProps) {
  const hasValue = (value: string) => value.trim().length > 0;
  const spellNumberId = (value: number) => {
    const mapping: Record<number, string> = {
      1: "Satu",
      2: "Dua",
      3: "Tiga",
      4: "Empat",
      5: "Lima",
      6: "Enam",
      7: "Tujuh",
      8: "Delapan",
      9: "Sembilan",
      10: "Sepuluh",
      11: "Sebelas",
      12: "Dua Belas",
      13: "Tiga Belas",
      14: "Empat Belas",
    };
    return mapping[value] ?? `${value}`;
  };
  const formatSemester = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return trimmed;
    if (/\(.+\)/.test(trimmed)) return trimmed;
    if (!/^\d+$/.test(trimmed)) return trimmed;
    const numeric = Number(trimmed);
    if (!Number.isFinite(numeric)) return trimmed;
    return `${numeric} (${spellNumberId(numeric)})`;
  };
  const semesterValue = formatSemester(applicant.semester ?? "");
  const hasName = hasValue(applicant.name);
  const hasBirthPlace = hasValue(applicant.birthPlace);
  const hasBirthDate = hasValue(applicant.birthDate);
  const hasAddress = hasValue(applicant.address);
  const hasProgram = hasValue(applicant.program);
  const hasNim = hasValue(applicant.nim);
  const hasSemester = hasValue(semesterValue);
  const hasKeperluan = hasValue(keperluan);
  const hasAcademicYearStart = hasValue(academicYear.start);
  const hasAcademicYearEnd = hasValue(academicYear.end);
  const dottedLineClass = "border-b border-dotted border-black pb-1";
  const signatureLine = signatureDate ? `Semarang, ${signatureDate}` : "Semarang, ……………………20….";

  return (
    <div
      className="w-full max-w-[210mm] bg-[#ffffff] text-black"
      style={{
        minHeight: "auto",
        padding: "1mm 20mm 18mm",
        fontFamily: '"Times New Roman", Times, serif',
      }}
    >
      {/* Header - Kop Surat */}
      <header className="pb-1 -mx-[20mm]">
        <img
          src="/persuratan-keterangan-mhs/kopSurat.png"
          alt="Kop Surat FSM Undip"
          className="w-[calc(100%+40mm)]"
        />
      </header>

      {/* Judul Surat */}
      <div className="mt-3 flex items-center justify-between gap-6">
        <div className="flex-1 text-center">
          <h1 className="text-[12pt] font-bold uppercase underline underline-offset-[5px]">
            SURAT KETERANGAN MAHASISWA
          </h1>
          <div className="mt-1 text-[10pt]">Nomor : {nomor}</div>
        </div>
        <div className="min-w-[80px] border border-black px-3 py-2 text-center text-[11pt] font-semibold">
          AK.007
        </div>
      </div>

      {/* Isi Surat */}
      <div className="mt-5 space-y-3 text-[11pt] leading-[1.6]">
        <p className="text-left">
          Dekan Fakultas Sains dan Matematika Universitas Diponegoro menerangkan bahwa:
        </p>

        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <td className="w-56 py-1 align-top">
                <span className="tracking-[0.22em]">Nama</span>
              </td>
              <td className="w-4 align-top text-left">:</td>
              <td className={hasName ? "" : dottedLineClass}>{applicant.name}</td>
            </tr>
            <tr>
              <td className="py-1 align-top">Tempat / Tanggal Lahir</td>
              <td className="align-top text-left">:</td>
              <td className={hasBirthPlace && hasBirthDate ? "" : dottedLineClass}>
                {applicant.birthPlace}, {applicant.birthDate}
              </td>
            </tr>
            <tr>
              <td className="py-1 align-top">
                <span className="tracking-[0.22em]">Alamat</span>
              </td>
              <td className="align-top text-left">:</td>
              <td className={hasAddress ? "" : dottedLineClass}>{applicant.address}</td>
            </tr>
            {!hasAddress ? (
              <tr>
                <td className="w-56" />
                <td className="w-4" />
                <td className="pt-2">
                  <div className="border-b border-dotted border-black pb-2" />
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>

        <div className="text-justify">
          <span>pada tahun akademik </span>
          <span
            className={`inline-block min-w-[56px] text-center font-semibold ${
              hasAcademicYearStart ? "" : "border-b border-dotted border-black"
            }`}
          >
            {academicYear.start}
          </span>
          <span className="px-2">/</span>
          <span
            className={`inline-block min-w-[56px] text-center font-semibold ${
              hasAcademicYearEnd ? "" : "border-b border-dotted border-black"
            }`}
          >
            {academicYear.end}
          </span>
          <span> terdaftar sebagai mahasiswa Fakultas Sains</span>
          <div>dan Matematika (FSM) Universitas Diponegoro.</div>
        </div>

        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <td className="w-56 py-1 align-top font-normal">Departemen / Prodi / Jenjang</td>
              <td className="w-4 align-top text-left">:</td>
              <td className={hasProgram ? "" : dottedLineClass}>{applicant.program}</td>
            </tr>
            <tr>
              <td className="py-1 align-top font-normal">
                <span className="tracking-[0.25em]">N I M</span>
              </td>
              <td className="align-top text-left">:</td>
              <td className={hasNim ? "" : dottedLineClass}>{applicant.nim}</td>
            </tr>
            <tr>
              <td className="py-1 align-top font-normal">Semester</td>
              <td className="align-top text-left">:</td>
              <td className={hasSemester ? "" : dottedLineClass}>{semesterValue}</td>
            </tr>
            <tr>
              <td className="py-1 align-top font-normal">Keterangan ini diberikan untuk</td>
              <td className="align-top text-left">:</td>
              <td className={hasKeperluan ? "" : dottedLineClass}>{keperluan}</td>
            </tr>
            {!hasKeperluan ? (
              <tr>
                <td className="w-56" />
                <td className="w-4" />
                <td className="pt-2">
                  <div className="border-b border-dotted border-black pb-2" />
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {/* TTD */}
      <div className="mt-8 flex justify-end">
        <div className="w-72 pl-20 text-[11pt]">
          <div className="text-left">{signatureLine}</div>
          <div className="mt-1 text-left">a.n. Dekan,</div>
          <div className="mt-1 text-left">Wakil Dekan I,</div>
          <div className="mt-1 text-left">u.b. Manager Bagian Tata Usaha,</div>

          <div className="mt-1">
            {signatureImage ? (
              <div className="h-28 w-full overflow-hidden">
                <img
                  src={signatureImage}
                  alt="Tanda tangan"
                  className="h-full w-full object-contain object-center"
                />
              </div>
            ) : (
              <div className="h-28" />
            )}
          </div>

          <div className="mt-1">
            <div className="font-bold text-left underline underline-offset-2">
              Lilik Maryuni, S.E., M.Si.
            </div>
            <div className="mt-1 text-left">NIP. 197808042001122001</div>
          </div>
        </div>
      </div>
    </div>
  );
}
