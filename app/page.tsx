"use client";

import { useState } from "react";
import confetti from "canvas-confetti";

export default function Home() {
  const [nim, setNim] = useState("");
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    setError("");
    setData(null);
    setLoading(true);

    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nim }),
      });

      const result = await res.json();

      if (!result.ok) {
        setError(result.message);
      } else {
        setData(result.data);

        if (result.data.Status === "LOLOS") {
          confetti({
            particleCount: 200,
            spread: 120,
          });
        }
      }
    } catch (err) {
      setError("Terjadi kesalahan.");
    }

    setLoading(false);
  };

  const renderQuote = () => {
    if (!data) return null;

    if (data.Status === "LOLOS") {
      return (
        <p className="mt-4 italic text-[#154748] text-sm">
          🌟 Selamat! Perjalananmu baru saja dimulai. 
          Jadilah versi terbaik dirimu dan berikan kontribusi terbaik untuk Seri X Art!
        </p>
      );
    }

    return (
      <p className="mt-4 italic text-[#594C8C] text-sm">
        💛 Jangan menyerah. Setiap proses adalah pembelajaran. 
        Mungkin bukan kali ini, tapi kesempatan terbaik sedang menunggumu di depan.
      </p>
    );
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center relative"
      style={{
        background: "linear-gradient(135deg, #A171D5, #F1D2B1, #CC445C)",
      }}
    >

      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-xl text-center">
        <h1 className="text-3xl font-bold mb-6 text-[#594C8C]">
          Pengumuman Staff Seri X Art Exhibition 2026
        </h1>

        <input
          type="text"
          placeholder="Masukkan NIM"
          value={nim}
          onChange={(e) => setNim(e.target.value)}
          className="border-2 rounded-xl px-4 py-2 w-full mb-4 border-[#A171D5]"
        />

        <button
          onClick={handleCheck}
          disabled={loading}
          className="px-6 py-2 rounded-xl text-white font-semibold bg-[#DF9621]"
        >
          {loading ? "Memeriksa..." : "Cek Pengumuman"}
        </button>

        {error && (
          <p className="text-red-600 mt-4">{error}</p>
        )}

        {data && (
          <div className="mt-6 text-left bg-[#F1D2B1] p-4 rounded-xl">
            <h2 className="text-xl font-bold mb-2 text-[#CC445C]">
              {data.Status}
            </h2>

            <p><strong>Nama:</strong> {data.Nama}</p>
            <p><strong>NIM:</strong> {data.NIM}</p>
            <p><strong>Fakultas:</strong> {data.Fakultas}</p>
            <p><strong>Divisi:</strong> {data.Divisi}</p>

            {renderQuote()}

            {data.Status === "LOLOS" && (
              <div className="mt-4">
                <a
                  href={data.Narahubung_WA}
                  target="_blank"
                  className="inline-block px-6 py-2 rounded-xl text-white font-semibold bg-[#154748]"
                >
                  💬 Chat {data.Narahubung_Nama}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}