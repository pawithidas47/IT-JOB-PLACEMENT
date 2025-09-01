<template>
  <div>
    <NavbarEmployer />

    <div class="container py-6">
      <div class="card mx-auto" style="max-width: 920px">
        <h4 class="title">📝 โพสต์งานใหม่</h4>

        <form @submit.prevent="submitJob" class="grid gap-5">
          <!-- ชื่องาน / หมวดหมู่ -->
          <div class="form-group grid grid-2 gap-4">
            <div>
              <label class="label">ชื่องาน <span class="req">*</span></label>
              <input v-model.trim="job.title" class="input" placeholder="เช่น ออกแบบโปสเตอร์กิจกรรม" required />
            </div>

            <div>
              <label class="label">หมวดหมู่ <span class="req">*</span></label>
              <select v-model="job.category" class="select" required>
                <option disabled value="">— เลือกหมวดหมู่ —</option>
                <option value="การตลาดดิจิทัล">การตลาดดิจิทัล</option>
                <option value="งานแปล / เขียนบทความ">งานแปล / เขียนบทความ</option>
                <option value="งานตัดต่อวิดีโอ / สร้างคอนเทนต์">งานตัดต่อวิดีโอ / สร้างคอนเทนต์</option>
                <option value="งานออกแบบ UX/UI">งานออกแบบ UX/UI</option>
                <option value="งานออกแบบกราฟิก / มัลติมีเดีย">งานออกแบบกราฟิก / มัลติมีเดีย</option>
                <option value="คีย์ข้อมูล / ป้อนข้อมูล">คีย์ข้อมูล / ป้อนข้อมูล</option>
                <option value="ดูแลระบบเครือข่าย">ดูแลระบบเครือข่าย</option>
                <option value="พัฒนาเว็บไซต์">พัฒนาเว็บไซต์</option>
                <option value="พัฒนาแอปพลิเคชัน">พัฒนาแอปพลิเคชัน</option>
                <option value="ผู้ดูแลเพจ / โซเชียลมีเดีย">ผู้ดูแลเพจ / โซเชียลมีเดีย</option>
                <option value="ที่ปรึกษาด้านเทคโนโลยี">ที่ปรึกษาด้านเทคโนโลยี</option>
                <option value="สนับสนุนงานไอที">สนับสนุนงานไอที (IT Support)</option>
                <option value="อื่น ๆ">อื่น ๆ</option>
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
              <input v-model.trim="job.vacancy" class="input" placeholder="เช่น 2 อัตรา" />
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
            <template v-if="ui.kind==='งานชิ้นเดียว'">
              <div class="pill-fixed">งานชิ้นเดียว</div>
              <div class="mt-2">
                <label class="label sub">วันส่งงาน (ถ้ามี)</label>
                <input type="date" v-model="ui.dueDate" class="input"/>
              </div>
            </template>
            <template v-else>
              <div class="chips">
                <button type="button" class="chip" :class="{active: ui.durationPreset==='ต่อเนื่อง'}"
                        @click="ui.durationPreset='ต่อเนื่อง'">ต่อเนื่อง</button>
                <button type="button" class="chip" :class="{active: ui.durationPreset==='1 เดือน'}"
                        @click="ui.durationPreset='1 เดือน'">1 เดือน</button>
                <button type="button" class="chip" :class="{active: ui.durationPreset==='3 เดือน'}"
                        @click="ui.durationPreset='3 เดือน'">3 เดือน</button>
                <button type="button" class="chip" :class="{active: ui.durationPreset==='6 เดือน'}"
                        @click="ui.durationPreset='6 เดือน'">6 เดือน</button>
              </div>
            </template>
          </div>

          <!-- ค่าจ้าง -->
          <div>
            <label class="label">ค่าจ้าง</label>
            <div class="grid grid-2 gap-4">
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
                <select v-model.number="job.salary_value" class="select">
                  <option disabled :value="null">เลือกราคา</option>
                  <option v-for="v in salaryAmountOptions" :key="v" :value="v">
                    {{ v.toLocaleString() }} บาท
                  </option>
                </select>
              </div>
            </div>
            <div class="hint" v-if="job.salary_type==='เหมางาน'">* ราคาเป็นต่อชิ้นงาน</div>
          </div>

          <!-- วัน-เวลาทำงาน -->
          <div>
            <label class="label">วัน-เวลาทำงาน</label>

            <div v-if="ui.kind==='งานชิ้นเดียว'" class="pill-muted">ตามตกลง/ขึ้นกับงาน</div>

            <template v-else>
              <div class="chips mb-2">
                <button type="button" class="chip" @click="selectWeekdays">เลือก จ.-ศ.</button>
                <button type="button" class="chip" @click="selectEveryday">เลือกทุกวัน</button>
                <button type="button" class="chip" @click="toggleAllDays">สลับเลือกทุกวัน</button>
              </div>

              <div class="days">
                <button v-for="d in days" :key="d.key" type="button"
                        class="day" :class="{active: ui.daysSelected.includes(d.key)}"
                        @click="toggleDay(d.key)">{{ d.label }}</button>
              </div>

              <div class="grid grid-2 gap-4 mt-2">
                <div>
                  <label class="label sub">เริ่ม (ไม่บังคับ)</label>
                  <input
                    type="time" lang="th" step="60"
                    v-model="ui.startTime"
                    class="input"
                    placeholder="เช่น 09:00"
                  />
                </div>
                <div>
                  <label class="label sub">เลิก (ไม่บังคับ)</label>
                  <input
                    type="time" lang="th" step="60"
                    v-model="ui.endTime"
                    class="input"
                    placeholder="เช่น 18:00"
                  />
                </div>
              </div>
            </template>
          </div>

          <!-- สรุปก่อนโพสต์ -->
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
              <div class="sum-title">ค่าจ้าง </div>
              <div class="sum-val">{{ jSalaryString || '—' }}</div>
            </div>
          </div>

          <!-- ปุ่มโพสต์ -->
          <button class="btn-primary" type="submit">📮 โพสต์งาน</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import NavbarEmployer from "@/components/NavbarEmployer.vue";

export default {
  name: "PostJobBetter",
  components: { NavbarEmployer },
  data() {
    return {
      user: null,
      job: {
        title: "",
        category: "",
        description: "",
        qualification: "",
        vacancy: "",
        salary_type: "",
        salary_value: null,
      },
      ui: {
        kind: "งานชิ้นเดียว",         // ค่าเริ่มต้น
        durationPreset: "ต่อเนื่อง",
        dueDate: "",
        daysSelected: ["จ", "อ", "พ", "พฤ", "ศ"],
        startTime: "",                 // ว่าง = ไม่บังคับ
        endTime: "",                   // ว่าง = ไม่บังคับ
      },
      days: [
        { key: "อา", label: "อา" },
        { key: "จ",  label: "จ"  },
        { key: "อ",  label: "อ"  },
        { key: "พ",  label: "พ"  },
        { key: "พฤ", label: "พฤ" },
        { key: "ศ",  label: "ศ"  },
        { key: "ส",  label: "ส"  },
      ],
    };
  },
  computed: {
    // ตัวเลือกเงินเดือนตามประเภท
    salaryAmountOptions() {
      const t = this.job.salary_type;
      if (t === "รายชั่วโมง") return [50, 60, 80, 100, 120, 150, 200];
      if (t === "รายวัน")    return [300, 500, 800, 1000, 1500, 2000];
      if (t === "รายเดือน")  return [8000, 10000, 12000, 15000, 18000, 20000, 25000];
      if (t === "เหมางาน")   return [300, 500, 800, 1000, 1500, 2000, 3000, 5000];
      return [];
    },

    // สรุประยะเวลา
    jDurationString() {
      if (this.ui.kind === "งานชิ้นเดียว") {
        return this.ui.dueDate
          ? `งานชิ้นเดียว (ส่งภายใน ${this.thaiDate(this.ui.dueDate)})`
          : "งานชิ้นเดียว";
      }
      return this.ui.durationPreset || "";
    },

    // สรุปวัน + เวลา (ไทย 24 ชม.)
    jWorktimeString() {
      if (this.ui.kind === "งานชิ้นเดียว") return "ตามตกลง/ขึ้นกับงาน";

      const ds = this.ui.daysSelected.slice();
      if (!ds.length) return "";

      let dayPart = ds.join(", ");
      const isWeekdays = ds.length === 5 && ["จ","อ","พ","พฤ","ศ"].every(k => ds.includes(k));
      const isEveryday = ds.length === 7;

      if (isEveryday) dayPart = "ทุกวัน";
      else if (isWeekdays) dayPart = "จ.-ศ.";

      const hasBothTime = this.ui.startTime && this.ui.endTime;
      const timePart = hasBothTime ? `${this.timeTH(this.ui.startTime)} – ${this.timeTH(this.ui.endTime)}` : "";

      return [dayPart, timePart].filter(Boolean).join(" • ");
    },

    // สรุปค่าจ้าง
    jSalaryString() {
      const t = this.job.salary_type;
      if (!t || t === "ตามตกลง") return "ตามตกลง";
      if (this.job.salary_value != null) {
        return `${t} ${Number(this.job.salary_value).toLocaleString()} บาท`;
      }
      return t;
    },
  },
  mounted() {
    const u = localStorage.getItem("user");
    if (!u) return this.$router.push("/login");
    this.user = JSON.parse(u);

    // เริ่มต้นให้เป็นงานชิ้นเดียว + ค่าจ้าง "เหมางาน"
    this.setKind("งานชิ้นเดียว", "เหมางาน");
  },
  methods: {
    // ใช้เวลา 24 ชม. + "น."
    timeTH(t) {
      if (!t) return "";
      // t เป็น "HH:MM" อยู่แล้วจาก input type="time"
      return `${t} น.`;
    },

    setKind(kind, salaryType) {
      this.ui.kind = kind;
      this.job.salary_type = salaryType;
      if (kind === "งานชิ้นเดียว") {
        this.ui.durationPreset = "งานชิ้นเดียว";
      } else {
        if (this.ui.durationPreset === "งานชิ้นเดียว") this.ui.durationPreset = "ต่อเนื่อง";
      }
    },

    toggleDay(key) {
      const i = this.ui.daysSelected.indexOf(key);
      if (i >= 0) this.ui.daysSelected.splice(i, 1);
      else this.ui.daysSelected.push(key);
    },
    selectWeekdays() { this.ui.daysSelected = ["จ", "อ", "พ", "พฤ", "ศ"]; },
    selectEveryday() { this.ui.daysSelected = ["อา","จ","อ","พ","พฤ","ศ","ส"]; },
    toggleAllDays() {
      this.ui.daysSelected = this.ui.daysSelected.length === 7 ? [] : ["อา","จ","อ","พ","พฤ","ศ","ส"];
    },

    thaiDate(iso) {
      const d = new Date(iso);
      return isNaN(d) ? iso : d.toLocaleDateString("th-TH", { day: "2-digit", month: "2-digit", year: "numeric" });
    },

    buildSalaryString(type, value) {
      if (!type || type === "ตามตกลง") return "ตามตกลง";
      if (value != null) return `${type} ${Number(value).toLocaleString()}`;
      return type;
    },

    async submitJob() {
      if (!this.job.title || !this.job.category) return;

      const payload = {
        j_title: this.job.title,
        j_description: this.job.description,
        j_type: this.job.category,
        j_amount: this.job.vacancy || null,

        j_salary: this.buildSalaryString(this.job.salary_type, this.job.salary_value),
        j_salary_type: this.job.salary_type || null,
        j_salary_value: this.job.salary_type === "ตามตกลง" ? null : (this.job.salary_value ?? null),

        // ✅ ถ้าไม่กรอกเวลา จะส่งเฉพาะช่วงวัน
        j_worktime: this.jWorktimeString || null,
        j_deliverable: "",
        j_qualification: this.job.qualification || null,
        j_duration: this.jDurationString || null,
        employer_id: this.user.employer_id,
      };

      try {
        await this.$axios.post("http://localhost:3001/api/jobs", payload);
        alert("✅ โพสต์งานสำเร็จ");
        this.$router.push("/employer/dashboard");
      } catch (err) {
        console.error("❌ โพสต์ล้มเหลว:", err);
        alert("โพสต์ไม่สำเร็จ");
      }
    },
  },
};
</script>

<style scoped>
.form-group { margin-bottom: 20px; }
.label { font-weight: 700; margin-bottom: 6px; display: block; }
.input, .select, textarea.input { margin: 0; }

.container { padding: 24px 16px; }
.card {
  background:#fff; border:1px solid #eef2f7; border-radius:18px;
  padding: 24px 22px; box-shadow: 0 12px 28px rgba(17,24,39,.06);
}
.title { color:#ff6600; font-weight:800; margin:2px 0 18px; }

.grid { display:grid; }
.grid-2 { grid-template-columns: repeat(2, minmax(0,1fr)); }
.gap-4 { gap:16px; }
.gap-5 { gap:20px; }
.mt-2 { margin-top:8px; }

.label { font-weight:700; color:#0f172a; font-size:.95rem; margin-bottom:6px; }
.label.sub { font-weight:600; color:#475569; }
.req { color:#ef4444; }
.input, .select, textarea.input {
  width:100%; border:1px solid #e5e7eb; border-radius:12px; padding:10px 14px;
  font-size:.95rem; outline:none; transition:.15s;
}
.input:focus, .select:focus, textarea.input:focus {
  border-color:#ffd4b3; box-shadow:0 0 0 4px rgba(255,102,0,.12);
}

.chips { display:flex; flex-wrap:wrap; gap:8px; }
.chip {
  border:1px solid #e6e9f0; background:#fff; padding:8px 12px; border-radius:999px;
  font-weight:700; color:#0f172a; transition:.15s; cursor:pointer;
}
.chip:hover { box-shadow:0 6px 18px rgba(16,24,40,.06); transform: translateY(-1px); }
.chip.active { background:#fff5e6; border-color:#ffb380; color:#ff6600; }

.days { display:flex; flex-wrap:wrap; gap:8px; }
.day {
  border:1px solid #e5e7eb; background:#fff; color:#0f172a; border-radius:10px; padding:8px 10px;
  min-width:42px; text-align:center; font-weight:700; cursor:pointer;
}
.day.active { background:#0ea5e9; color:#fff; border-color:#0ea5e9; }

.summary {
  display:grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap:14px;
  border:1px dashed #dbe2ea; border-radius:14px; padding:14px; background:#f8fafc;
}
.sum-item { background:#fff; border:1px solid #eaeef6; border-radius:12px; padding:12px; }
.sum-title { color:#64748b; font-weight:700; font-size:.85rem; margin-bottom:4px; }
.sum-val { color:#0f172a; font-weight:800; }

.pill-fixed{
  display:inline-block; padding:8px 12px; border-radius:999px;
  background:#eef2ff; color:#1e3a8a; border:1px solid #c7d2fe; font-weight:800;
}
.pill-muted{
  display:inline-block; padding:8px 12px; border-radius:999px;
  background:#f1f5f9; color:#0f172a; border:1px dashed #cbd5e1; font-weight:700;
}
.hint{ color:#64748b; font-size:.85rem; margin-top:6px }

.btn-primary {
  width:100%; border:none; background:#ff6600; color:#fff; font-weight:800;
  padding:12px 18px; border-radius:14px; transition:.15s; cursor:pointer;
}
.btn-primary:hover { background:#e65c00; box-shadow:0 8px 20px rgba(255,102,0,.25); transform:translateY(-1px); }

@media (max-width: 900px) {
  .grid-2 { grid-template-columns: 1fr; }
  .summary { grid-template-columns: 1fr; }
}
</style>
