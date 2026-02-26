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
};

export function StudentLetterPreview({
  nomor = "........../UN7.F8.4/AK/...../20...",
  applicant,
  academicYear,
  keperluan,
}: StudentLetterPreviewProps) {
  const hasValue = (value: string) => value.trim().length > 0;
  const hasName = hasValue(applicant.name);
  const hasBirthPlace = hasValue(applicant.birthPlace);
  const hasBirthDate = hasValue(applicant.birthDate);
  const hasAddress = hasValue(applicant.address);
  const hasProgram = hasValue(applicant.program);
  const hasNim = hasValue(applicant.nim);
  const hasSemester = hasValue(applicant.semester);
  const hasKeperluan = hasValue(keperluan);
  const hasAcademicYearStart = hasValue(academicYear.start);
  const hasAcademicYearEnd = hasValue(academicYear.end);
  const dottedLineClass = "border-b border-dotted border-black pb-1";
  return (
    <div
      className="w-full max-w-[210mm] bg-white text-black"
      style={{
        minHeight: "297mm",
        padding: "14mm 25mm 25mm",
        fontFamily: '"Times New Roman", Times, serif',
      }}
    >
      {/* Header - Kop Surat */}
      <header className="pb-2 -mx-[20mm]">
        <img
          src="/kopSurat.png"
          alt="Kop Surat FSM Undip"
          className="w-[calc(100%+40mm)]"
        />
      </header>

      {/* Judul Surat */}
      <div className="mt-5 flex items-center justify-between gap-6">
        <div className="flex-1 text-center">
          <h1 className="text-[14pt] font-bold uppercase underline underline-offset-[6px]">
            SURAT KETERANGAN MAHASISWA
          </h1>
          <div className="mt-2 text-[11pt]">Nomor : {nomor}</div>
        </div>
        <div className="min-w-[90px] border border-black px-4 py-2 text-center text-[12pt] font-semibold">
          AK.007
        </div>
      </div>

      {/* Isi Surat */}
      <div className="mt-8 space-y-4 text-[12pt] leading-[1.85]">
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
              <td className={hasSemester ? "" : dottedLineClass}>{applicant.semester}</td>
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
      <div className="mt-14 flex justify-end">
        <div className="w-80 text-[12pt]">
          <div className="text-left">Semarang, ……………………20….</div>
          <div className="mt-2 text-left">a.n. Dekan,</div>
          <div className="mt-1 text-left">Wakil Dekan I,</div>
          <div className="mt-1 text-left">u.b. Manager Bagian Tata Usaha,</div>
          
          <div className="mt-20">
            <div className="font-bold text-left underline underline-offset-4">
              Lilik Maryuni, S.E., M.Si.
            </div>
            <div className="mt-1 text-left">NIP. 197808042001122001</div>
          </div>
        </div>
      </div>
    </div>
  );
}
