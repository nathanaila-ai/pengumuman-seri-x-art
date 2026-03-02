import { NextResponse } from "next/server";
import { fetchSheetValues } from "../../../lib/sheets";

export async function POST(req: Request) {
  try {
    const { nim } = await req.json();

    if (!nim) {
      return NextResponse.json(
        { ok: false, message: "NIM wajib diisi." },
        { status: 400 }
      );
    }

    const rows = await fetchSheetValues();

    if (rows.length < 2) {
      return NextResponse.json(
        { ok: false, message: "Data belum tersedia." },
        { status: 500 }
      );
    }

    const header = rows[0].map((h) => String(h || "").trim());
    const dataRows = rows.slice(1);

    const idx = (name: string) =>
      header.findIndex((h) => h.toLowerCase() === name.toLowerCase());

    const iNIM = idx("NIM");
    const iNama = idx("Nama");
    const iFak = idx("Fakultas");
    const iDivisi = idx("Divisi");
    const iStatus = idx("Status");
    const iNHNama = idx("Narahubung_Nama");
    const iNHWA = idx("Narahubung_WA");

    if (iNIM === -1) {
      return NextResponse.json(
        { ok: false, message: "Kolom NIM tidak ditemukan." },
        { status: 500 }
      );
    }

    const row = dataRows.find(
      (r) => String(r[iNIM] || "").trim() === nim.trim()
    );

    if (!row) {
      return NextResponse.json({
        ok: false,
        message: "NIM tidak ditemukan.",
      });
    }

    const data = {
      NIM: row[iNIM],
      Nama: row[iNama],
      Fakultas: row[iFak],
      Divisi: row[iDivisi],
      Status: row[iStatus],
      Narahubung_Nama: row[iNHNama],
      Narahubung_WA: row[iNHWA],
    };

    return NextResponse.json({ ok: true, data });
  } catch (error: any) {
    console.error("API ERROR:", error);
    return NextResponse.json({
      ok: false,
      message: error.message || "Server error",
    });
  }
}