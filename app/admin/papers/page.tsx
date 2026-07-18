"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, FileText, Trash2, Download, Search, Filter, Plus } from "lucide-react";
import Link from "next/link";

const BG = "#081420", S1 = "#0C1A2B", S2 = "#0F2032", S3 = "#14283E";
const GOLD = "#60a5fa", GOLD_DIM = "rgba(96,165,250,0.10)", GOLD_B = "rgba(96,165,250,0.22)";
const BORDER = "rgba(255,255,255,0.07)", BORDER2 = "rgba(255,255,255,0.12)";
const TEXT = "#FFFFFF", MUTED = "rgba(255,255,255,0.50)", FAINT = "rgba(255,255,255,0.22)";
const FH = "'Roboto Condensed', sans-serif", FB = "'Inter', sans-serif";

const GRADES   = ["Grade 8","Grade 9","Grade 10","Grade 11","Grade 12"];
const MONTHS   = ["January","March","June","September","November"];
const YEARS    = Array.from({ length: 15 }, (_, i) => 2025 - i);
const TYPES    = ["Exam","Memo","Both"];
const LANGS    = ["English","Afrikaans","IsiZulu","IsiXhosa"];
const SUBJECTS_LIST = [
  { label:"Mathematics",           code:"math"   },
  { label:"Physical Sciences",     code:"sci"    },
  { label:"English Home Language", code:"eng_hl" },
  { label:"English FAL",           code:"eng_fal"},
  { label:"IsiZulu HL",            code:"zul_hl" },
  { label:"Life Orientation",      code:"lo"     },
  { label:"History",               code:"hist"   },
  { label:"Geography",             code:"geog"   },
  { label:"Life Sciences",         code:"bio"    },
  { label:"Accounting",            code:"acc"    },
  { label:"Business Studies",      code:"bus"    },
  { label:"Economics",             code:"eco"    },
];

type Paper = {
  id: string; subject: string; subjectCode: string; grade: string;
  year: number; month: string; type: string; language: string;
  fileName: string; fileUrl: string; fileSize: number | null; uploadedAt: string;
};

function fmtSize(bytes: number | null) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminPapersPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [search, setSearch] = useState("");
  const [filterGrade, setFilterGrade] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    subject: "Mathematics", subjectCode: "math", grade: "Grade 8",
    year: "2024", month: "June", type: "Exam", language: "English",
  });
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/papers");
    const data = await res.json();
    setPapers(data.papers ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const flash = (text: string, ok = true) => {
    setMsg({ text, ok });
    setTimeout(() => setMsg(null), 3500);
  };

  const handleSubjectChange = (label: string) => {
    const found = SUBJECTS_LIST.find(s => s.label === label);
    setForm(f => ({ ...f, subject: label, subjectCode: found?.code ?? label.toLowerCase() }));
  };

  const upload = async () => {
    if (!file) { flash("Please select a file.", false); return; }
    setUploading(true);
    const fd = new FormData();
    fd.append("file",        file);
    fd.append("subject",     form.subject);
    fd.append("subjectCode", form.subjectCode);
    fd.append("grade",       form.grade);
    fd.append("year",        form.year);
    fd.append("month",       form.month);
    fd.append("type",        form.type);
    fd.append("language",    form.language);

    const res = await fetch("/api/admin/papers", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (data.success) {
      flash(`Uploaded: ${file.name}`);
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      setShowForm(false);
      load();
    } else {
      flash(data.error || "Upload failed.", false);
    }
  };

  const deletePaper = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    const res = await fetch(`/api/admin/papers?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) { flash("Deleted."); load(); }
    else flash(data.error || "Delete failed.", false);
  };

  const filtered = papers.filter(p => {
    if (filterGrade !== "All" && p.grade !== filterGrade) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.subject.toLowerCase().includes(q) || p.grade.toLowerCase().includes(q) ||
             String(p.year).includes(q) || p.month.toLowerCase().includes(q) ||
             p.type.toLowerCase().includes(q);
    }
    return true;
  });

  const inp: React.CSSProperties = {
    width: "100%", background: S3, border: `1px solid ${BORDER}`, borderRadius: 10,
    padding: "10px 14px", color: TEXT, fontFamily: FB, fontSize: 13, outline: "none",
    boxSizing: "border-box",
  };

  const typeColor = (t: string) => t === "Exam" ? "#3B82F6" : t === "Memo" ? "#10B981" : "#F59E0B";

  return (
    <div style={{ padding: 28, fontFamily: FB, background: BG, minHeight: "100%" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: FH, fontSize: 24, fontWeight: 800, color: TEXT, margin: 0, letterSpacing: "-0.03em" }}>
            Past Papers
          </h1>
          <p style={{ fontSize: 13, color: MUTED, margin: "4px 0 0" }}>
            Upload and manage exam papers for students to download
          </p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 12, background: GOLD_DIM, border: `1px solid ${GOLD_B}`, color: GOLD, fontFamily: FB, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
        >
          <Plus size={15} /> Upload Paper
        </button>
      </div>

      {/* Flash */}
      {msg && (
        <div style={{ marginBottom: 16, padding: "12px 16px", borderRadius: 10, background: msg.ok ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${msg.ok ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`, color: msg.ok ? "#10B981" : "#EF4444", fontFamily: FB, fontSize: 13 }}>
          {msg.text}
        </div>
      )}

      {/* Upload form */}
      {showForm && (
        <div style={{ background: S1, border: `1px solid ${GOLD_B}`, borderRadius: 18, padding: 24, marginBottom: 24 }}>
          <div style={{ fontFamily: FH, fontSize: 16, fontWeight: 700, color: GOLD, marginBottom: 18 }}>Upload New Paper</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 12 }}>
            <div>
              <div style={{ fontFamily: FB, fontSize: 11, color: MUTED, marginBottom: 5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Subject</div>
              <select value={form.subject} onChange={e => handleSubjectChange(e.target.value)} style={inp}>
                {SUBJECTS_LIST.map(s => <option key={s.code}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontFamily: FB, fontSize: 11, color: MUTED, marginBottom: 5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Grade</div>
              <select value={form.grade} onChange={e => setForm(f => ({ ...f, grade: e.target.value }))} style={inp}>
                {GRADES.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontFamily: FB, fontSize: 11, color: MUTED, marginBottom: 5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Year</div>
              <select value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} style={inp}>
                {YEARS.map(y => <option key={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontFamily: FB, fontSize: 11, color: MUTED, marginBottom: 5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Month</div>
              <select value={form.month} onChange={e => setForm(f => ({ ...f, month: e.target.value }))} style={inp}>
                {MONTHS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontFamily: FB, fontSize: 11, color: MUTED, marginBottom: 5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Type</div>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={inp}>
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontFamily: FB, fontSize: 11, color: MUTED, marginBottom: 5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Language</div>
              <select value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))} style={inp}>
                {LANGS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {/* File input */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: FB, fontSize: 11, color: MUTED, marginBottom: 5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>File (PDF or DOCX)</div>
            <div
              style={{ border: `2px dashed ${file ? GOLD_B : BORDER}`, borderRadius: 12, padding: "24px", textAlign: "center", cursor: "pointer", background: file ? GOLD_DIM : "transparent", transition: "all 0.2s" }}
              onClick={() => fileRef.current?.click()}
            >
              <Upload size={24} style={{ color: file ? GOLD : FAINT, marginBottom: 8 }} />
              <div style={{ fontFamily: FB, fontSize: 13, color: file ? GOLD : MUTED }}>
                {file ? file.name : "Click to select file or drag & drop"}
              </div>
              {file && <div style={{ fontFamily: FB, fontSize: 11, color: FAINT, marginTop: 4 }}>{fmtSize(file.size)}</div>}
              <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }}
                onChange={e => setFile(e.target.files?.[0] ?? null)} />
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setShowForm(false)} style={{ padding: "10px 20px", borderRadius: 10, background: "transparent", border: `1px solid ${BORDER}`, color: MUTED, fontFamily: FB, fontSize: 13, cursor: "pointer" }}>
              Cancel
            </button>
            <button onClick={upload} disabled={uploading || !file} style={{ flex: 1, padding: "11px", borderRadius: 10, background: uploading ? S3 : GOLD_DIM, border: `1px solid ${GOLD_B}`, color: GOLD, fontFamily: FB, fontSize: 13, fontWeight: 700, cursor: uploading ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {uploading ? "Uploading…" : <><Upload size={14} /> Upload Paper</>}
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: FAINT }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)} placeholder="Search papers…"
            style={{ ...inp, paddingLeft: 36, width: "100%", boxSizing: "border-box" }}
          />
        </div>
        <select value={filterGrade} onChange={e => setFilterGrade(e.target.value)} style={{ ...inp, width: "auto", minWidth: 140 }}>
          <option>All</option>
          {GRADES.map(g => <option key={g}>{g}</option>)}
        </select>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total Papers", value: papers.length },
          { label: "Exams", value: papers.filter(p => p.type === "Exam" || p.type === "Both").length },
          { label: "Memos", value: papers.filter(p => p.type === "Memo" || p.type === "Both").length },
          { label: "Grades Covered", value: new Set(papers.map(p => p.grade)).size },
        ].map(({ label, value }) => (
          <div key={label} style={{ background: S1, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "16px" }}>
            <div style={{ fontFamily: FB, fontSize: 11, color: MUTED }}>{label}</div>
            <div style={{ fontFamily: FH, fontSize: 24, fontWeight: 800, color: GOLD, marginTop: 6 }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 48, color: MUTED, fontFamily: FB }}>Loading papers…</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 48, color: FAINT, border: `1px dashed ${BORDER}`, borderRadius: 16 }}>
          <FileText size={36} style={{ marginBottom: 12, opacity: 0.4 }} />
          <div style={{ fontFamily: FH, fontSize: 16, fontWeight: 700, color: MUTED, marginBottom: 6 }}>
            {papers.length === 0 ? "No papers uploaded yet" : "No papers match your search"}
          </div>
          <div style={{ fontFamily: FB, fontSize: 13 }}>
            {papers.length === 0 ? "Click \"Upload Paper\" to add the first past paper." : "Try adjusting your filters."}
          </div>
        </div>
      ) : (
        <div style={{ background: S1, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                {["Subject","Grade","Year / Month","Type","Language","Size","Uploaded",""].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontFamily: FB, fontSize: 11, fontWeight: 700, color: FAINT, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id} style={{ borderTop: i > 0 ? `1px solid ${BORDER}` : "none" }}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontFamily: FH, fontSize: 14, fontWeight: 700, color: TEXT }}>{p.subject}</div>
                    <div style={{ fontFamily: FB, fontSize: 11, color: FAINT }}>{p.fileName}</div>
                  </td>
                  <td style={{ padding: "14px 16px", fontFamily: FB, fontSize: 13, color: MUTED }}>{p.grade}</td>
                  <td style={{ padding: "14px 16px", fontFamily: FB, fontSize: 13, color: MUTED }}>{p.year} · {p.month}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontFamily: FB, fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: `${typeColor(p.type)}15`, color: typeColor(p.type) }}>{p.type}</span>
                  </td>
                  <td style={{ padding: "14px 16px", fontFamily: FB, fontSize: 13, color: MUTED }}>{p.language}</td>
                  <td style={{ padding: "14px 16px", fontFamily: FB, fontSize: 12, color: FAINT }}>{fmtSize(p.fileSize)}</td>
                  <td style={{ padding: "14px 16px", fontFamily: FB, fontSize: 12, color: FAINT }}>
                    {new Date(p.uploadedAt).toLocaleDateString("en-ZA")}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <a href={p.fileUrl} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 8, background: "rgba(59,130,246,0.10)", border: "1px solid rgba(59,130,246,0.25)", color: "#3B82F6", textDecoration: "none" }}>
                        <Download size={13} />
                      </a>
                      <button onClick={() => deletePaper(p.id, p.fileName)} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 8, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.20)", color: "#EF4444", cursor: "pointer" }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
