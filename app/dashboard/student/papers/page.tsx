"use client";

import { useState, useEffect } from "react";
import { FileText, Download, Search, BookOpen, Filter } from "lucide-react";
import Link from "next/link";

const BG = "#0C0C0C", S1 = "#111111", S2 = "#171717", S3 = "#1E1E1E";
const BORDER = "rgba(255,255,255,0.07)", BORDER2 = "rgba(255,255,255,0.12)";
const TEXT = "#FFFFFF", MUTED = "rgba(255,255,255,0.50)", FAINT = "rgba(255,255,255,0.22)";
const FH = "'Bricolage Grotesque', sans-serif", FB = "'Inter', sans-serif";

const GRADES = ["All Grades","Grade 8","Grade 9","Grade 10","Grade 11","Grade 12"];
const TYPES  = ["All Types","Exam","Memo","Both"];

type Paper = {
  id: string; subject: string; subjectCode: string; grade: string;
  year: number; month: string; type: string; language: string;
  fileName: string; fileUrl: string; fileSize: number | null; uploadedAt: string;
};

function fmtSize(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const typeColor = (t: string) => t === "Exam" ? "#3B82F6" : t === "Memo" ? "#10B981" : "#F59E0B";
const typeIcon  = (t: string) => t === "Memo" ? "📝" : "📄";

function SubjectIcon({ code }: { code: string }) {
  const icons: Record<string,string> = {
    math:"🔢", sci:"⚗️", eng_hl:"📖", eng_fal:"📖", zul_hl:"🗣️",
    lo:"🌱", hist:"🏛️", geog:"🌍", bio:"🔬", acc:"💰", bus:"📊", eco:"📈",
  };
  return <span style={{ fontSize: 20 }}>{icons[code] ?? "📄"}</span>;
}

export default function PastPapersPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterGrade, setFilterGrade] = useState("All Grades");
  const [filterType,  setFilterType]  = useState("All Types");
  const [filterYear,  setFilterYear]  = useState("All Years");

  useEffect(() => {
    fetch("/api/papers")
      .then(r => r.json())
      .then(d => { setPapers(d.papers ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const years = ["All Years", ...Array.from(new Set(papers.map(p => String(p.year)))).sort((a,b) => Number(b)-Number(a))];

  const filtered = papers.filter(p => {
    if (filterGrade !== "All Grades" && p.grade !== filterGrade) return false;
    if (filterType  !== "All Types"  && p.type  !== filterType)  return false;
    if (filterYear  !== "All Years"  && String(p.year) !== filterYear) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.subject.toLowerCase().includes(q) || p.grade.toLowerCase().includes(q) ||
             String(p.year).includes(q) || p.month.toLowerCase().includes(q);
    }
    return true;
  });

  // Group by subject
  const grouped: Record<string, Paper[]> = {};
  for (const p of filtered) {
    if (!grouped[p.subject]) grouped[p.subject] = [];
    grouped[p.subject].push(p);
  }

  const inp: React.CSSProperties = {
    background: S2, border: `1px solid ${BORDER}`, borderRadius: 10,
    padding: "10px 14px", color: TEXT, fontFamily: FB, fontSize: 13, outline: "none",
  };

  return (
    <div style={{ padding: 24, fontFamily: FB, background: BG, minHeight: "100%" }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BookOpen size={18} style={{ color: "#3B82F6" }} />
          </div>
          <div>
            <h1 style={{ fontFamily: FH, fontSize: 22, fontWeight: 800, color: TEXT, margin: 0, letterSpacing: "-0.03em" }}>Past Papers</h1>
            <p style={{ fontSize: 12, color: FAINT, margin: 0, marginTop: 2 }}>Download exam papers and memos · CAPS curriculum</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total Papers", value: papers.length, color: "#3B82F6" },
          { label: "Subjects", value: new Set(papers.map(p => p.subject)).size, color: "#8B5CF6" },
          { label: "Years Available", value: new Set(papers.map(p => p.year)).size, color: "#10B981" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: S1, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "14px 16px" }}>
            <div style={{ fontFamily: FB, fontSize: 11, color: MUTED }}>{label}</div>
            <div style={{ fontFamily: FH, fontSize: 24, fontWeight: 800, color, marginTop: 4 }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 180, position: "relative" }}>
          <Search size={13} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: FAINT }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by subject, grade, year…"
            style={{ ...inp, width: "100%", paddingLeft: 34, boxSizing: "border-box" }} />
        </div>
        <select value={filterGrade} onChange={e => setFilterGrade(e.target.value)} style={inp}>
          {GRADES.map(g => <option key={g}>{g}</option>)}
        </select>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} style={inp}>
          {TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={filterYear} onChange={e => setFilterYear(e.target.value)} style={inp}>
          {years.map(y => <option key={y}>{y}</option>)}
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 48, color: MUTED }}>Loading past papers…</div>
      ) : Object.keys(grouped).length === 0 ? (
        <div style={{ textAlign: "center", padding: 56, color: FAINT, border: `1px dashed ${BORDER}`, borderRadius: 18 }}>
          <FileText size={40} style={{ marginBottom: 14, opacity: 0.35 }} />
          <div style={{ fontFamily: FH, fontSize: 18, fontWeight: 700, color: MUTED, marginBottom: 8 }}>
            {papers.length === 0 ? "No past papers available yet" : "No papers match your filters"}
          </div>
          <div style={{ fontFamily: FB, fontSize: 13 }}>
            {papers.length === 0 ? "Your school admin will upload papers here." : "Try adjusting your search or filters."}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {Object.entries(grouped).map(([subject, subjectPapers]) => (
            <div key={subject} style={{ background: S1, border: `1px solid ${BORDER}`, borderRadius: 18, overflow: "hidden" }}>
              {/* Subject header */}
              <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 12 }}>
                <SubjectIcon code={subjectPapers[0].subjectCode} />
                <div>
                  <div style={{ fontFamily: FH, fontSize: 16, fontWeight: 700, color: TEXT }}>{subject}</div>
                  <div style={{ fontFamily: FB, fontSize: 12, color: FAINT }}>{subjectPapers.length} paper{subjectPapers.length !== 1 ? "s" : ""}</div>
                </div>
              </div>

              {/* Papers list */}
              <div style={{ padding: "8px 0" }}>
                {subjectPapers.map((p, i) => (
                  <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderTop: i > 0 ? `1px solid ${BORDER}` : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 18 }}>{typeIcon(p.type)}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontFamily: FB, fontSize: 13, fontWeight: 600, color: TEXT }}>
                            {p.grade} · {p.month} {p.year}
                          </span>
                          <span style={{ fontFamily: FB, fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 5, background: `${typeColor(p.type)}15`, color: typeColor(p.type) }}>
                            {p.type}
                          </span>
                          <span style={{ fontFamily: FB, fontSize: 10, color: FAINT }}>
                            {p.language}
                          </span>
                        </div>
                        <div style={{ fontFamily: FB, fontSize: 11, color: FAINT, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {p.fileName} {p.fileSize ? `· ${fmtSize(p.fileSize)}` : ""}
                        </div>
                      </div>
                    </div>
                    <a
                      href={p.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      download={p.fileName}
                      style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, background: "rgba(59,130,246,0.10)", border: "1px solid rgba(59,130,246,0.25)", color: "#3B82F6", fontFamily: FB, fontSize: 12, fontWeight: 700, textDecoration: "none", marginLeft: 12 }}
                    >
                      <Download size={13} /> Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Study tip */}
      {papers.length > 0 && (
        <div style={{ marginTop: 24, padding: "16px 20px", borderRadius: 14, background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.20)", display: "flex", gap: 12, alignItems: "flex-start" }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
          <div>
            <div style={{ fontFamily: FH, fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 4 }}>Study tip from SIDI</div>
            <div style={{ fontFamily: FB, fontSize: 12, color: MUTED, lineHeight: 1.6 }}>
              Past papers are the best way to prepare for exams. Work through them under exam conditions, then check the memo.
              Use <Link href="/dashboard/student/sidi" style={{ color: "#6366F1", textDecoration: "none" }}>SIDI</Link> to help understand any questions you got wrong.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
