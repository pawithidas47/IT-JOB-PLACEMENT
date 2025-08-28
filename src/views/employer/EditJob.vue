<template>
  <div>
    <NavbarEmployer />

    <div class="container py-6">
      <div class="card mx-auto" style="max-width: 920px">
        <h4 class="title">✏️ แก้ไขงาน</h4>

        <div v-if="loaded">
          <form @submit.prevent="submitEdit" class="grid gap-5">
            <!-- ชื่องาน / หมวดหมู่ -->
            <div class="grid grid-2 gap-4">
              <div>
                <label class="label">ชื่องาน <span class="req">*</span></label>
                <input v-model.trim="job.title" class="input" required />
              </div>

              <div>
                <label class="label">หมวดหมู่ <span class="req">*</span></label>
                <select v-model="job.category" class="select" required>
                  <option disabled value="">— เลือกหมวดหมู่ —</option>
                  <option value="ออกแบบและมัลติมีเดีย">ออกแบบและมัลติมีเดีย</option>
                  <option value="UX/UI Design">UX/UI Design</option>
                  <option value="พัฒนาเว็บไซต์">พัฒนาเว็บไซต์</option>
                  <option value="พัฒนาแอปพลิเคชัน">พัฒนาแอปพลิเคชัน</option>
                  <option value="เขียนบทความ/ แปลบทความ">เขียน/ แปลบทความ</option>
                  <option value="คีย์ข้อมูล / Data Entry">คีย์ข้อมูล / Data Entry</option>
                  <option value="แอดมินเพจ / ดูแลโซเชียลมีเดีย">แอดมินเพจ / โซเชียลมีเดีย</option>
                  <option value="การตลาดดิจิทัล">การตลาดดิจิทัล</option>
                  <option value="IT Support">IT Support</option>
                  <option value="ดูแลระบบเครือข่าย">ดูแลระบบเครือข่าย</option>
                  <option value="ตัดต่อวิดีโอ / สร้างคอนเทนต์">ตัดต่อวิดีโอ / คอนเทนต์</option>
                  <option value="ที่ปรึกษาด้านเทคโนโลยี">ที่ปรึกษาด้านเทคโนโลยี</option>
                </select>
              </div>
            </div>

            <!-- รายละเอียด / คุณสมบัติ -->
            <div class="grid grid-2 gap-4">
              <div>
                <label class="label">รายละเอียดงาน</label>
                <textarea v-model.trim="job.description" class="input" rows="4"
                          placeholder="สรุปลักษณะงานโดยรวม (bullet ได้)"></textarea>
              </div>
              <div>
                <label class="label">คุณสมบัติผู้สมัคร</label>
                <textarea v-model.trim="job.qualification" class="input" rows="4"
                          placeholder="เช่น มีโน้ตบุ๊ก, ใช้ Photoshop ได้, ทำงานเป็นทีม"></textarea>
              </div>
            </div>

            <!-- จำนวนที่รับ -->
            <div class="grid grid-2 gap-4">
              <div>
                <label class="label">จำนวนที่รับ</label>
                <input v-model.trim="job.vacancy" class="input" placeholder="เช่น 3 อัตรา" />
              </div>
            </div>

            <!-- ชนิดงาน -->
            <div>
              <label class="label">ชนิดงาน</label>
              <div class="chips">
                <button type="button" class="chip" :class="{active: ui.kind==='งานชิ้นเดียว'}"
                        @click="setKind('งานชิ้นเดียว','เหมางาน')">งานชิ้นเดียว</button>
                <button type="button" class="chip" :class="{active: ui.kind==='รายชั่วโมง'}"
                        @click="setKind('รายชั่วโมง','รายชั่วโมง')">รายชั่วโมง</button>
                <button type="button" class="chip" :class="{active: ui.kind==='พาร์ทไทม์(รายวัน)'}"
                        @click="setKind('พาร์ทไทม์(รายวัน)','รายวัน')">พาร์ทไทม์ (รายวัน)</button>
                <button type="button" class="chip" :class="{active: ui.kind==='ฟูลไทม์(รายเดือน)'}"
                        @click="setKind('ฟูลไทม์(รายเดือน)','รายเดือน')">ฟูลไทม์ (รายเดือน)</button>
              </div>
            </div>

            <!-- ระยะเวลางาน -->
            <div>
              <label class="label">ระยะเวลางาน</label>
              <div class="chips">
                <button type="button" class="chip" :class="{active: ui.durationPreset==='ต่อเนื่อง'}"
                        @click="ui.durationPreset='ต่อเนื่อง'">ต่อเนื่อง</button>
                <button type="button" class="chip" :class="{active: ui.durationPreset==='1 เดือน'}"
                        @click="ui.durationPreset='1 เดือน'">1 เดือน</button>
                <button type="button" class="chip" :class="{active: ui.durationPreset==='3 เดือน'}"
                        @click="ui.durationPreset='3 เดือน'">3 เดือน</button>
                <button type="button" class="chip" :class="{active: ui.durationPreset==='6 เดือน'}"
                        @click="ui.durationPreset='6 เดือน'">6 เดือน</button>
                <button type="button" class="chip" :class="{active: ui.durationPreset==='งานชิ้นเดียว'}"
                        @click="ui.durationPreset='งานชิ้นเดียว'">งานชิ้นเดียว</button>
              </div>

              <div v-if="ui.durationPreset==='งานชิ้นเดียว'" class="mt-2">
                <label class="label sub">วันส่งงาน (ถ้ามี)</label>
                <input type="date" v-model="ui.dueDate" class="input"/>
              </div>
            </div>

            <!-- วัน-เวลาทำงาน -->
            <div>
              <label class="label">วัน-เวลาทำงาน</label>

              <div class="chips mb-2">
                <button type="button" class="chip" @click="selectWeekdays">เลือก จ.-ศ.</button>
                <button type="button" class="chip" @click="toggleAllDays">สลับเลือกทุกวัน</button>
              </div>

              <div class="days">
                <button v-for="d in days" :key="d.key" type="button"
                        class="day" :class="{active: ui.daysSelected.includes(d.key)}"
                        @click="toggleDay(d.key)">{{ d.label }}</button>
              </div>

              <div class="grid grid-2 gap-4 mt-2">
                <div>
                  <label class="label sub">เริ่ม</label>
                  <input type="time" v-model="ui.startTime" class="input" />
                </div>
                <div>
                  <label class="label sub">เลิก</label>
                  <input type="time" v-model="ui.endTime" class="input" />
                </div>
              </div>
            </div>

            <!-- ค่าตอบแทน -->
            <div>
              <label class="label">ค่าตอบแทน</label>
              <div class="grid grid-3 gap-4">
                <div>
                  <select v-model="job.salary_type" class="select">
                    <option disabled value="">ประเภทค่าจ้าง</option>
                    <option value="รายชั่วโมง">รายชั่วโมง</option>
                    <option value="รายวัน">รายวัน</option>
                    <option value="รายเดือน">รายเดือน</option>
                    <option value="เหมางาน">เหมางาน</option>
                    <option value="ตามตกลง">ตามตกลง</option>
                  </select>
                </div>
                <div v-if="job.salary_type !== 'ตามตกลง'">
                  <input type="number" min="0" class="input" v-model.number="job.salary_min" placeholder="ขั้นต่ำ" />
                </div>
                <div v-if="job.salary_type !== 'ตามตกลง'">
                  <input type="number" min="0" class="input" v-model.number="job.salary_max" placeholder="ขั้นสูง" />
                </div>
              </div>
            </div>

            <!-- สรุปก่อนบันทึก -->
            <div class="summary">
              <div class="sum-item">
                <div class="sum-title">ระยะเวลา </div>
                <div class="sum-val">{{ jDurationString || '—' }}</div>
              </div>
              <div class="sum-item">
                <div class="sum-title">วัน-เวลาทำงาน </div>
                <div class="sum-val">{{ jWorktimeString || '—' }}</div>
              </div>
              <div class="sum-item">
                <div class="sum-title">ค่าตอบแทน </div>
                <div class="sum-val">{{ jSalaryString || '—' }}</div>
              </div>
            </div>

            <!-- ปุ่ม -->
            <div class="grid gap-4">
              <button class="btn-primary" type="submit">💾 บันทึกการแก้ไข</button>
              <button class="btn-outline" type="button" @click="cancelEdit">ยกเลิก</button>
            </div>
          </form>
        </div>

        <div v-else class="text-center text-muted py-5">
          <i class="bi bi-hourglass-split fs-2"></i>
          <p class="mt-3">กำลังโหลดข้อมูลงาน...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NavbarEmployer from "@/components/NavbarEmployer.vue";

export default {
  name: "EditJobBetter",
  components: { NavbarEmployer },
  data() {
    return {
      loaded: false,
      apiJob: null, // เก็บของเดิมจาก API
      job: {
        title: "",
        category: "",
        description: "",
        qualification: "",
        vacancy: "",
        salary_type: "",
        salary_min: null,
        salary_max: null,
      },
      ui: {
        kind: "งานชิ้นเดียว",
        durationPreset: "งานชิ้นเดียว",
        dueDate: "",
        daysSelected: ["จ", "อ", "พ", "พฤ", "ศ"],
        startTime: "09:00",
        endTime: "17:00",
      },
      days: [
        { key: "อา", label: "อา" },
        { key: "จ", label: "จ" },
        { key: "อ", label: "อ" },
        { key: "พ", label: "พ" },
        { key: "พฤ", label: "พฤ" },
        { key: "ศ", label: "ศ" },
        { key: "ส", label: "ส" },
      ],
    };
  },
  computed: {
    jDurationString() {
      const p = this.ui.durationPreset;
      if (!p) return "";
      if (p === "งานชิ้นเดียว") {
        if (this.ui.dueDate) return `งานชิ้นเดียว (ส่งภายใน ${this.thaiDate(this.ui.dueDate)})`;
        return "งานชิ้นเดียว";
      }
      return p === "ต่อเนื่อง" ? "ต่อเนื่อง" : p;
    },
    jWorktimeString() {
      const ds = this.ui.daysSelected.slice();
      if (!ds.length) return "";
      const isWeekdays = ds.length === 5 && ["จ", "อ", "พ", "พฤ", "ศ"].every((k) => ds.includes(k));
      const dayPart = isWeekdays ? "จ.-ศ." : ds.join(", ");
      const tPart = this.ui.startTime && this.ui.endTime ? `${this.ui.startTime} – ${this.ui.endTime}` : "";
      return [dayPart, tPart].filter(Boolean).join(" ");
    },
    jSalaryString() {
      const t = this.job.salary_type;
      if (!t) return "";
      if (t === "ตามตกลง") return "ตามตกลง";
      const min = this.job.salary_min != null && this.job.salary_min !== "" ? Number(this.job.salary_min).toLocaleString() : null;
      const max = this.job.salary_max != null && this.job.salary_max !== "" ? Number(this.job.salary_max).toLocaleString() : null;
      if (min && max) return `${t} ${min} – ${max}`;
      if (min) return `${t} ${min}+`;
      if (max) return `${t} สูงสุด ${max}`;
      return t;
    },
  },
  async mounted() {
    const id = this.$route.params.id;
    try {
      const { data } = await axios.get(`http://localhost:3001/api/jobs/${id}`);
      this.apiJob = data;
      this.hydrateFormFromApi(data); // เติมค่าลงฟอร์มให้เหมือนหน้าโพส
      this.loaded = true;
    } catch (e) {
      console.error("❌ โหลดข้อมูลงานล้มเหลว:", e);
      alert("ไม่สามารถโหลดข้อมูลงานได้");
      this.$router.push("/employer/dashboard");
    }
  },
  methods: {
    // ---------- Helpers ----------
    thaiDate(iso) {
      const d = new Date(iso);
      if (isNaN(d)) return iso;
      return d.toLocaleDateString("th-TH", { day: "2-digit", month: "2-digit", year: "numeric" });
    },
    toNum(v) {
      if (v == null || v === "") return null;
      const n = Number(String(v).replace(/[^\d.-]/g, ""));
      return Number.isFinite(n) ? n : null;
    },
    parseLegacySalary(txt) {
      if (!txt || typeof txt !== "string") return {};
      const m = txt.match(/(รายชั่วโมง|รายวัน|รายเดือน|เหมางาน|ตามตกลง)?\s*([\d,]+)?\s*(?:[-–]\s*([\d,]+))?/);
      if (!m) return {};
      return {
        type: m[1] || "",
        min: m[2] ? this.toNum(m[2]) : null,
        max: m[3] ? this.toNum(m[3]) : null,
      };
    },
    parseWorktime(str) {
      // พาร์สแบบหยาบๆ รองรับ "จ.-ศ. 09:00 – 17:00" หรือ "จ,อ,พ 10:00 – 18:00"
      if (!str) return;
      const parts = String(str).split(" ");
      const dayPart = parts[0] || "";
      const timeMatch = str.match(/(\d{1,2}:\d{2}).*?(\d{1,2}:\d{2})/);
      if (dayPart.includes("จ.-ศ.")) this.ui.daysSelected = ["จ", "อ", "พ", "พฤ", "ศ"];
      else {
        const ds = dayPart.split(",").map(s => s.trim()).filter(Boolean);
        if (ds.length) this.ui.daysSelected = ds;
      }
      if (timeMatch) {
        this.ui.startTime = timeMatch[1];
        this.ui.endTime = timeMatch[2];
      }
    },

    // ---------- Mapping API -> Form ----------
    hydrateFormFromApi(j) {
      // ชื่อ/หมวด/รายละเอียด/คุณสมบัติ/จำนวน
      this.job.title         = j.j_title || "";
      this.job.category      = j.j_type || "";
      this.job.description   = j.j_description || "";
      this.job.qualification = j.j_qualification || "";
      this.job.vacancy       = j.j_amount || "";

      // ค่าจ้าง: รองรับทั้งฟิลด์ใหม่/เก่า
      const legacy = this.parseLegacySalary(j.j_salary);
      this.job.salary_type = j.j_salary_type || j.salary_type || legacy.type || "";
      this.job.salary_min  = this.toNum(j.j_salary_min ?? j.salary_min ?? legacy.min);
      this.job.salary_max  = this.toNum(j.j_salary_max ?? j.salary_max ?? legacy.max);

      // ระยะเวลา
      if (j.j_duration) {
        if (/ต่อเนื่อง/.test(j.j_duration)) this.ui.durationPreset = "ต่อเนื่อง";
        else if (/งานชิ้นเดียว/.test(j.j_duration)) this.ui.durationPreset = "งานชิ้นเดียว";
        else this.ui.durationPreset = j.j_duration; // "1 เดือน" / "3 เดือน" / "6 เดือน"
      }

      // วัน-เวลาทำงาน
      this.parseWorktime(j.j_worktime);

      // ชนิดงาน ↔ ประเภทค่าจ้าง (ผูกเบาๆ)
      if (this.job.salary_type === "รายชั่วโมง") this.ui.kind = "รายชั่วโมง";
      else if (this.job.salary_type === "รายวัน") this.ui.kind = "พาร์ทไทม์(รายวัน)";
      else if (this.job.salary_type === "รายเดือน") this.ui.kind = "ฟูลไทม์(รายเดือน)";
      else this.ui.kind = "งานชิ้นเดียว";
    },

    // ---------- UI Actions ----------
    setKind(kind, salaryType) {
      this.ui.kind = kind;
      if (!this.job.salary_type || this.job.salary_type === "เหมางาน" || this.job.salary_type === "รายชั่วโมง" || this.job.salary_type === "รายวัน" || this.job.salary_type === "รายเดือน")
        this.job.salary_type = salaryType; // ปรับให้สอดคล้อง (ผู้ใช้ยังแก้ได้)
    },
    toggleDay(key) {
      const i = this.ui.daysSelected.indexOf(key);
      if (i >= 0) this.ui.daysSelected.splice(i, 1);
      else this.ui.daysSelected.push(key);
    },
    selectWeekdays() {
      this.ui.daysSelected = ["จ", "อ", "พ", "พฤ", "ศ"];
    },
    toggleAllDays() {
      if (this.ui.daysSelected.length === 7) this.ui.daysSelected = [];
      else this.ui.daysSelected = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];
    },

    // ---------- Submit ----------
    async submitEdit() {
      const id = this.$route.params.id;

      const payload = {
        j_title: this.job.title,
        j_description: this.job.description,
        j_type: this.job.category,
        j_amount: this.job.vacancy || null,

        j_salary_type: this.job.salary_type || null,
        j_salary_min:  this.job.salary_type === "ตามตกลง" ? null : (this.job.salary_min ?? null),
        j_salary_max:  this.job.salary_type === "ตามตกลง" ? null : (this.job.salary_max ?? null),

        j_worktime: this.jWorktimeString || null,
        j_deliverable: this.apiJob?.j_deliverable || "", // กัน undefined
        j_qualification: this.job.qualification || null,
        j_duration: this.jDurationString || null,
      };

      try {
        await axios.put(`http://localhost:3001/api/jobs/${id}`, payload);
        alert("✅ แก้ไขงานสำเร็จ");
        this.$router.push(`/employer/jobs/${id}`);
      } catch (err) {
        console.error("❌ แก้ไขงานล้มเหลว:", err?.response?.data || err.message);
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    },
    cancelEdit() {
      const id = this.$route.params.id;
      this.$router.push(`/employer/jobs/${id}`);
    },
  },
};
</script>

<style scoped>
/* Layout & card */
.container { padding: 24px 16px; }
.card {
  background:#fff; border:1px solid #eef2f7; border-radius:18px;
  padding: 24px 22px; box-shadow: 0 12px 28px rgba(17,24,39,.06);
}
.title { color:#ff6600; font-weight:800; margin:2px 0 18px; }

/* Grid helpers */
.grid { display:grid; }
.grid-2 { grid-template-columns: repeat(2, minmax(0,1fr)); }
.grid-3 { grid-template-columns: repeat(3, minmax(0,1fr)); }
.gap-4 { gap:16px; }
.gap-5 { gap:20px; }

/* Form controls */
.label { font-weight:700; color:#0f172a; font-size:.95rem; margin-bottom:6px; display:block; }
.label.sub { font-weight:600; color:#475569; }
.req { color:#ef4444; }
.input, .select, textarea.input {
  width:100%; border:1px solid #e5e7eb; border-radius:12px; padding:10px 14px;
  font-size:.95rem; outline:none; transition:.15s;
}
.input:focus, .select:focus, textarea.input:focus {
  border-color:#ffd4b3; box-shadow:0 0 0 4px rgba(255,102,0,.12);
}

/* Chips */
.chips { display:flex; flex-wrap:wrap; gap:8px; }
.chip {
  border:1px solid #e6e9f0; background:#fff; padding:8px 12px; border-radius:999px;
  font-weight:700; color:#0f172a; transition:.15s;
}
.chip:hover { box-shadow:0 6px 18px rgba(16,24,40,.06); transform: translateY(-1px); }
.chip.active { background:#fff5e6; border-color:#ffb380; color:#ff6600; }

/* Days selector */
.days { display:flex; flex-wrap:wrap; gap:8px; }
.day {
  border:1px solid #e5e7eb; background:#fff; color:#0f172a; border-radius:10px; padding:8px 10px;
  min-width:42px; text-align:center; font-weight:700;
}
.day.active { background:#0ea5e9; color:#fff; border-color:#0ea5e9; }

/* Summary */
.summary {
  display:grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap:14px;
  border:1px dashed #dbe2ea; border-radius:14px; padding:14px; background:#f8fafc;
}
.sum-item { background:#fff; border:1px solid #eaeef6; border-radius:12px; padding:12px; }
.sum-title { color:#64748b; font-weight:700; font-size:.85rem; }
.sum-val { color:#0f172a; font-weight:800; }

/* Buttons */
.btn-primary {
  width:100%; border:none; background:#ff6600; color:#fff; font-weight:800;
  padding:12px 18px; border-radius:14px; transition:.15s; text-align:center;
}
.btn-primary:hover { background:#e65c00; box-shadow:0 8px 20px rgba(255,102,0,.25); transform:translateY(-1px); }

.btn-outline {
  width:100%; border:1px solid #e5e7eb; background:#fff; color:#0f172a; font-weight:700;
  padding:12px 18px; border-radius:14px;
}
.btn-outline:hover { background:#f8fafc; }
  
@media (max-width: 900px) {
  .grid-2, .grid-3 { grid-template-columns: 1fr; }
  .summary { grid-template-columns: 1fr; }
}
</style>
