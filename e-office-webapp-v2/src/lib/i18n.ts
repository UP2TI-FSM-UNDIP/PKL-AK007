export type UiLang = "id" | "en";

export type I18nKey =
  | "notifications"
  | "close"
  | "loadingNotifications"
  | "notificationsError"
  | "notificationsEmpty"
  | "remove"
  | "profileTitle"
  | "name"
  | "program"
  | "email"
  | "role"
  | "logout"
  | "logoutConfirm"
  | "logoutConfirmDesc"
  | "logoutCancel"
  | "logoutOk"
  | "dashboard"
  | "language"
  | "darkMode"
  | "lightMode"
  | "incomingLetter"
  | "supervisorRole"
  | "managerRole"
  | "studentRole"
  | "upaRole"
  | "superadminRole"
  | "facultyName"
  | "universityName"
  | "upaName"
  | "upaStaff"
  | "managerLabel"
  | "studentId"
  | "employeeId"
  | "position"
  | "persuratan"
  | "suratMasuk"
  | "semuaSurat"
  | "suratSaya"
  | "draftSurat"
  | "ajukanSurat"
  | "dasbor"
  | "manajemenUser"
  | "monitoringSurat"
  | "templateSurat"
  | "auditLog"
  | "pengaturanSistem"
  | "dashboardPersuratan"
  | "dashboardPersuratanDesc"
  | "summaryNeedsAction"
  | "summaryInRevision"
  | "summaryCompletedMonth"
  | "summaryTotalMonth"
  | "trendTitle"
  | "statusDistribution"
  | "allLetters"
  | "searchLetters"
  | "dateRange"
  | "filterStatus"
  | "loadingLetters"
  | "noLetters"
  | "showing"
  | "of"
  | "inboxBreadcrumb"
  | "penerimaTitle"
  | "filterSearch"
  | "applicantInfo"
  | "applicantNamePlaceholder"
  | "departemenPlaceholder"
  | "senderOrgPlaceholder"
  | "letterInfo"
  | "classificationPlaceholder"
  | "letterNaturePlaceholder"
  | "timePeriod"
  | "startDate"
  | "endDate"
  | "reasonSubmission"
  | "source"
  | "senderApplicant"
  | "subject"
  | "receivedDate"
  | "currentTarget"
  | "action"
  | "detailBreadcrumb"
  | "identitasPengaju"
  | "detailSurat"
  | "destination"
  | "letterNumber"
  | "letterNumbering"
  | "received"
  | "academicYear"
  | "semester"
  | "address"
  | "purpose"
  | "attachment"
  | "noAttachment"
  | "previewLetter"
  | "openPreview"
  | "actions"
  | "approve"
  | "revise"
  | "reject"
  | "history"
  | "statusLabel"
  | "note"
  | "verify"
  | "letterName"
  | "letterType"
  | "confirmVerify"
  | "rejectionNoteLabel"
  | "rejectionNotePlaceholder"
  | "sendRejection"
  | "revisionTarget"
  | "revisionTargetDesc"
  | "revisionNoteLabel"
  | "revisionNotePlaceholder"
  | "sendRevision"
  | "back"
  | "previewBreadcrumb"
  | "previewTitle"
  | "pageLabel"
  | "previewAllLettersDesc"
  | "pendingStatus"
  | "revisionStatus"
  | "completedStatus"
  | "rejectedStatus"
  | "reset"
  | "search"
  | "phone"
  | "loadingHistory"
  | "noHistory"
  | "noNotes"
  | "letters"
  | "fullName"
  | "typeCategory"
  | "statusPendingShort"
  | "statusRevisionShort"
  | "statusCompletedShort"
  | "statusRejectedShort"
  | "letter";

const labels: Record<UiLang, Record<I18nKey, string>> = {
  id: {
    notifications: "Notifikasi",
    close: "Tutup",
    loadingNotifications: "Memuat notifikasi...",
    notificationsError: "Gagal memuat notifikasi.",
    notificationsEmpty: "Belum ada notifikasi.",
    remove: "Hapus",
    profileTitle: "Profil Saya",
    name: "Nama",
    program: "Prodi",
    email: "Email",
    role: "Role",
    logout: "Log Out",
    logoutConfirm: "Keluar dari akun?",
    logoutConfirmDesc: "Apakah Anda yakin ingin keluar?",
    logoutCancel: "Batal",
    logoutOk: "Keluar",
    dashboard: "Dashboard",
    language: "Bahasa",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    incomingLetter: "Surat masuk",
    supervisorRole: "Supervisor Akademik",
    managerRole: "Manajer TU",
    studentRole: "Mahasiswa",
    upaRole: "UPA",
    superadminRole: "Superadmin",
    facultyName: "Fakultas Sains dan Matematika",
    universityName: "Universitas Diponegoro",
    upaName: "Unit Penjaminan Akademik",
    upaStaff: "Staff UPA",
    managerLabel: "Manajer TU",
    studentId: "NIM",
    employeeId: "NIP",
    position: "Jabatan",
    persuratan: "Persuratan",
    suratMasuk: "Surat Masuk",
    semuaSurat: "Semua Surat",
    suratSaya: "Surat Saya",
    draftSurat: "Draft Surat",
    ajukanSurat: "Ajukan Surat",
    dasbor: "Dasbor",
    manajemenUser: "Manajemen User",
    monitoringSurat: "Monitoring Surat",
    templateSurat: "Template Surat",
    auditLog: "Audit Log",
    pengaturanSistem: "Pengaturan Sistem",
    dashboardPersuratan: "Dashboard Persuratan",
    dashboardPersuratanDesc: "Pusat kendali untuk mengelola semua surat Fakultas Sains dan Matematika.",
    summaryNeedsAction: "Perlu Tindakan",
    summaryInRevision: "Dalam Proses Revisi",
    summaryCompletedMonth: "Selesai (Bulan Ini)",
    summaryTotalMonth: "Total Surat (Bulan Ini)",
    trendTitle: "Tren Volume 30 Hari",
    statusDistribution: "Distribusi Status",
    allLetters: "Semua Surat",
    searchLetters: "Cari surat...",
    dateRange: "Rentang Tanggal",
    filterStatus: "Status",
    loadingLetters: "Memuat surat...",
    noLetters: "Belum ada surat.",
    showing: "Showing",
    of: "of",
    inboxBreadcrumb: "Surat masuk / Penerima",
    penerimaTitle: "Penerima",
    filterSearch: "Filter Pencarian",
    applicantInfo: "Informasi Pemohon",
    applicantNamePlaceholder: "Masukkan nama pemohon",
    departemenPlaceholder: "Pilih departemen",
    senderOrgPlaceholder: "Nama instansi pengirim",
    letterInfo: "Informasi Surat",
    classificationPlaceholder: "Pilih klasifikasi",
    letterNaturePlaceholder: "Sifat Surat",
    timePeriod: "Periode Waktu",
    startDate: "Start date",
    endDate: "End date",
    reasonSubmission: "Alasan Pengajuan",
    source: "Sumber",
    senderApplicant: "Pengirim/Pemohon",
    subject: "Perihal",
    receivedDate: "Tanggal Diterima",
    currentTarget: "Tujuan Saat Ini",
    action: "Aksi",
    detailBreadcrumb: "Surat Masuk / Penerima / Identitas Pemohon",
    identitasPengaju: "Identitas Pengaju",
    detailSurat: "Detail Surat",
    destination: "Tujuan",
    letterNumber: "No Surat",
    letterNumbering: "Penomoran Surat",
    received: "Diterima",
    academicYear: "Tahun Akademik",
    semester: "Semester",
    address: "Alamat",
    purpose: "Keperluan",
    attachment: "Lampiran",
    noAttachment: "Belum ada lampiran.",
    previewLetter: "Pratinjau Surat",
    openPreview: "Buka Pratinjau",
    actions: "Aksi",
    approve: "Setujui",
    revise: "Revisi",
    reject: "Tolak",
    history: "Riwayat Surat",
    statusLabel: "Status",
    note: "Catatan",
    verify: "Verifikasi",
    letterName: "Nama Surat",
    letterType: "Jenis Surat",
    confirmVerify: "Yakin ingin memverifikasi surat ini?",
    rejectionNoteLabel: "Berikan catatan penolakan.",
    rejectionNotePlaceholder: "Tulis alasan penolakan.",
    sendRejection: "Kirim Penolakan",
    revisionTarget: "Pilih Target Revisi",
    revisionTargetDesc: "Ketika surat direvisi, surat akan dikirim kembali ke target tersebut.",
    revisionNoteLabel: "Berikan catatan revisi.",
    revisionNotePlaceholder: "Tulis catatan revisi.",
    sendRevision: "Kirim Revisi",
    back: "Kembali",
    previewBreadcrumb: "Form Pengajuan Surat / Pratinjau Surat",
    previewTitle: "Pratinjau Surat",
    pageLabel: "Halaman 1 dari 1",
    previewAllLettersDesc: "Daftar seluruh surat tanpa filter status.",
    pendingStatus: "Surat diajukan ke Supervisor Akademik",
    revisionStatus: "Surat perlu revisi",
    completedStatus: "Surat diajukan ke Manajer TU",
    rejectedStatus: "Surat ditolak oleh Supervisor",
    reset: "Reset",
    search: "Cari",
    phone: "No. HP",
    loadingHistory: "Memuat riwayat...",
    noHistory: "Belum ada riwayat.",
    noNotes: "Tidak ada catatan",
    letters: "surat",
    fullName: "Nama Lengkap",
    typeCategory: "Jenis & Kategori",
    statusPendingShort: "Pending",
    statusRevisionShort: "Revisi",
    statusCompletedShort: "Selesai",
    statusRejectedShort: "Ditolak",
    letter: "Surat",
  },
  en: {
    notifications: "Notifications",
    close: "Close",
    loadingNotifications: "Loading notifications...",
    notificationsError: "Failed to load notifications.",
    notificationsEmpty: "No notifications yet.",
    remove: "Remove",
    profileTitle: "My Profile",
    name: "Name",
    program: "Program",
    email: "Email",
    role: "Role",
    logout: "Log Out",
    logoutConfirm: "Sign out?",
    logoutConfirmDesc: "Are you sure you want to sign out?",
    logoutCancel: "Cancel",
    logoutOk: "Sign Out",
    dashboard: "Dashboard",
    language: "Language",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    incomingLetter: "Incoming letter",
    supervisorRole: "Academic Supervisor",
    managerRole: "TU Manager",
    studentRole: "Student",
    upaRole: "UPA",
    superadminRole: "Superadmin",
    facultyName: "Faculty of Science and Mathematics",
    universityName: "Diponegoro University",
    upaName: "Academic Quality Assurance Unit",
    upaStaff: "UPA Staff",
    managerLabel: "TU Manager",
    studentId: "Student ID",
    employeeId: "Employee ID",
    position: "Position",
    persuratan: "Correspondence",
    suratMasuk: "Incoming Letters",
    semuaSurat: "All Letters",
    suratSaya: "My Letters",
    draftSurat: "Draft Letters",
    ajukanSurat: "Submit Letter",
    dasbor: "Dashboard",
    manajemenUser: "User Management",
    monitoringSurat: "Letter Monitoring",
    templateSurat: "Letter Templates",
    auditLog: "Audit Log",
    pengaturanSistem: "System Settings",
    dashboardPersuratan: "Correspondence Dashboard",
    dashboardPersuratanDesc: "Control center to manage all Faculty of Science and Mathematics letters.",
    summaryNeedsAction: "Needs Action",
    summaryInRevision: "In Revision",
    summaryCompletedMonth: "Completed (This Month)",
    summaryTotalMonth: "Total Letters (This Month)",
    trendTitle: "30-Day Volume Trend",
    statusDistribution: "Status Distribution",
    allLetters: "All Letters",
    searchLetters: "Search letters...",
    dateRange: "Date Range",
    filterStatus: "Status",
    loadingLetters: "Loading letters...",
    noLetters: "No letters yet.",
    showing: "Showing",
    of: "of",
    inboxBreadcrumb: "Incoming / Recipient",
    penerimaTitle: "Recipient",
    filterSearch: "Search Filters",
    applicantInfo: "Applicant Information",
    applicantNamePlaceholder: "Enter applicant name",
    departemenPlaceholder: "Select department",
    senderOrgPlaceholder: "Sender organization",
    letterInfo: "Letter Information",
    classificationPlaceholder: "Select classification",
    letterNaturePlaceholder: "Letter nature",
    timePeriod: "Time Period",
    startDate: "Start date",
    endDate: "End date",
    reasonSubmission: "Reason",
    source: "Source",
    senderApplicant: "Sender/Applicant",
    subject: "Subject",
    receivedDate: "Received Date",
    currentTarget: "Current Target",
    action: "Action",
    detailBreadcrumb: "Incoming / Recipient / Applicant Identity",
    identitasPengaju: "Applicant Identity",
    detailSurat: "Letter Detail",
    destination: "Destination",
    letterNumber: "Letter No.",
    letterNumbering: "Letter Numbering",
    received: "Received",
    academicYear: "Academic Year",
    semester: "Semester",
    address: "Address",
    purpose: "Purpose",
    attachment: "Attachment",
    noAttachment: "No attachments yet.",
    previewLetter: "Letter Preview",
    openPreview: "Open Preview",
    actions: "Actions",
    approve: "Approve",
    revise: "Revise",
    reject: "Reject",
    history: "Letter History",
    statusLabel: "Status",
    note: "Note",
    verify: "Verify",
    letterName: "Letter Name",
    letterType: "Letter Type",
    confirmVerify: "Are you sure you want to verify this letter?",
    rejectionNoteLabel: "Provide rejection note.",
    rejectionNotePlaceholder: "Write rejection reason.",
    sendRejection: "Send Rejection",
    revisionTarget: "Select Revision Target",
    revisionTargetDesc: "When revised, the letter will be sent back to the target.",
    revisionNoteLabel: "Provide revision note.",
    revisionNotePlaceholder: "Write revision note.",
    sendRevision: "Send Revision",
    back: "Back",
    previewBreadcrumb: "Letter Submission / Preview",
    previewTitle: "Letter Preview",
    pageLabel: "Page 1 of 1",
    previewAllLettersDesc: "List of all letters without status filter.",
    pendingStatus: "Submitted to Academic Supervisor",
    revisionStatus: "Needs Revision",
    completedStatus: "Submitted to TU Manager",
    rejectedStatus: "Rejected by Supervisor",
    reset: "Reset",
    search: "Search",
    phone: "Phone",
    loadingHistory: "Loading history...",
    noHistory: "No history yet.",
    noNotes: "No notes",
    letters: "letters",
    fullName: "Full Name",
    typeCategory: "Type & Category",
    statusPendingShort: "Pending",
    statusRevisionShort: "Revision",
    statusCompletedShort: "Completed",
    statusRejectedShort: "Rejected",
    letter: "Letter",
  },
};

export const getLabel = (lang: UiLang, key: I18nKey) => labels[lang][key] ?? key;
