import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DashboardService } from '../../services/dashboard.service';
import { DashboardResponse } from '../../models/dashboard-response';

import { FiltersPanel } from '../filters-panel/filters-panel';
import DepartmentCharts from '../department-charts/department-charts';
import SubmittedTable from '../submitted-table/submitted-table';
import PendingTable from '../pending-table/pending-table';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import PptxGenJS from 'pptxgenjs';
import * as XLSX from 'xlsx';

/* ------------------------------------------------------------- */

@Component({
  selector: 'app-dashboard-root',
  standalone: true,
  imports: [CommonModule, FormsModule, FiltersPanel, DepartmentCharts, SubmittedTable, PendingTable],
  templateUrl: './dashboard-root.html',
  styleUrls: ['./dashboard-root.css']
})
export default class DashboardRoot implements OnInit {

  /* ------------------ DATA ------------------ */
  dashboard?: DashboardResponse;
  surveys: any[] = [];
  departments: any[] = [];

  submittedEmployeesRaw: string[] = [];
  pendingEmployeesRaw: string[] = [];

  submittedEmployees: Array<{ employeeId: string, employeeName: string }> = [];
  pendingEmployees: Array<{ employeeId: string, employeeName: string }> = [];

  selectedSurveyId: number | null = null;
  selectedDepartmentId: number | null = null;

  showResults = false;
  showAssignmentAlert = false;  // 👈 alert for NOT_ASSIGNED or invalid department selection
  assignmentMessage = "";       // 👈 show message like “Survey not assigned to HR”

  totalEmployees = 0;
  submittedCount = 0;
  remainingCount = 0;
  submissionRate = 0;

  isExporting = false;
  exportMessage = '';

  constructor(private svc: DashboardService) {}

  /* ------------------ INIT ------------------ */
  ngOnInit(): void {
    this.loadFilters();
  }

  /* =============================================================
      LOAD SURVEYS + DEPARTMENTS
  ============================================================= */
  private loadFilters(): void {

    // ---------------- Surveys ----------------
    this.svc.getSurveys().subscribe({
      next: (res: any[]) => {
        this.surveys = res ?? [];

        if (this.surveys.length > 0) {
          const sorted = [...this.surveys].sort((a, b) => {
            const aDate = new Date(a.createdAt ?? a.publishedAt ?? 0).getTime();
            const bDate = new Date(b.createdAt ?? b.publishedAt ?? 0).getTime();
            return aDate - bDate;
          });
          this.selectedSurveyId = sorted[0]?.id ?? null;
        }
      },
      error: () => {
        console.warn("Failed to load surveys (401)");
      }
    });

    // ---------------- Departments ----------------
    this.svc.getDepartments().subscribe({
      next: (res: any[]) => {
        this.departments = res ?? [];
      },
      error: () => {
        console.warn("Failed to load departments (401)");
      }
    });
  }

  /* =============================================================
      HANDLES FILTER VALIDATION FROM FILTER-PANEL (Frontend)
  ============================================================= */
  onFilterChange(canApply: boolean) {
    if (!canApply) {
      this.showResults = false;
      this.dashboard = undefined;

      this.showAssignmentAlert = true;
      this.assignmentMessage = "This survey is not assigned to the selected department.";

      return;
    }

    this.showAssignmentAlert = false;
    this.assignmentMessage = "";

    this.showResults = true;
    this.loadDashboard();
  }

  /* =============================================================
      LOAD DASHBOARD DATA  → FIXED ERROR HANDLING
  ============================================================= */
  private loadDashboard(): void {

    const sId = this.selectedSurveyId ?? undefined;
    const dId = this.selectedDepartmentId ?? undefined;

    this.svc.getDashboard(sId as any, dId as any).subscribe({
      next: (res: any) => {

        // Backend might send: { error: "NOT_ASSIGNED" }
        if (res?.error) {
          this.showResults = false;
          this.showAssignmentAlert = true;

          if (res.error === "NOT_ASSIGNED") {
            this.assignmentMessage = "This survey is not assigned to the selected department.";
          } else {
            this.assignmentMessage = res.error;
          }

          return;
        }

        // NO ERROR → NORMAL FLOW
        this.showAssignmentAlert = false;
        this.assignmentMessage = "";

        this.dashboard = res;

        this.submittedEmployeesRaw = res?.submittedEmployees ?? [];
        this.pendingEmployeesRaw = res?.pendingEmployees ?? [];

        this.submittedEmployees = this.parseList(this.submittedEmployeesRaw);
        this.pendingEmployees = this.parseList(this.pendingEmployeesRaw);

        this.computeKPIs();
        this.showResults = true;
      },

      /* ------------------ SERVER 500 FIX ------------------ */
      error: (err) => {
        console.warn("Backend Dashboard Error: ", err);

        this.showResults = false;
        this.dashboard = undefined;
        this.showAssignmentAlert = true;

        const msg = err?.error?.message ?? err?.error?.error ?? "";

        if (typeof msg === "string" && msg.toLowerCase().includes("assigned")) {
          this.assignmentMessage = "This survey is not assigned to the selected department.";
        } else {
          this.assignmentMessage = "Failed to load dashboard. Please check assignments.";
        }
      }
    });
  }

  /* =============================================================
      Parse Employee List
  ============================================================= */
  private parseList(list: string[]): Array<{ employeeId: string, employeeName: string }> {
    return list.map(s => {
      const parts = s.split('-').map(p => p.trim());

      if (parts.length >= 2) {
        return { employeeId: parts[1], employeeName: parts[0] };
      }
      return { employeeId: '', employeeName: s };
    });
  }

  /* =============================================================
      COMPUTE KPIs
  ============================================================= */
  private computeKPIs() {
    if (!this.dashboard) {
      this.totalEmployees = 0;
      this.submittedCount = 0;
      this.remainingCount = 0;
      this.submissionRate = 0;
      return;
    }

    this.totalEmployees = Number(this.dashboard.totalEmployees ?? 0);
    this.submittedCount = Number(this.dashboard.totalSubmitted ?? 0);
    this.remainingCount = Number(this.dashboard.totalPending ?? 0);

    this.submissionRate =
      this.totalEmployees > 0
        ? Math.round((this.submittedCount / this.totalEmployees) * 100)
        : 0;
  }

  /* ---------------------------
     Expand helper (used by both PDF and PPT)
  --------------------------- */
  private expandForExport(selectors: string[]) {
    const backups: Array<{el: HTMLElement, style: Partial<CSSStyleDeclaration>}> = [];
    selectors.forEach(sel => {
      const els = Array.from(document.querySelectorAll(sel)) as HTMLElement[];
      els.forEach(el => {
        backups.push({
          el,
          style: {
            overflow: el.style.overflow,
            maxHeight: el.style.maxHeight,
            height: el.style.height
          }
        });
        el.style.overflow = 'visible';
        el.style.maxHeight = 'none';
        el.style.height = 'auto';
      });
    });
    return backups;
  }

  private restoreAfterExport(backups: Array<{el: HTMLElement, style: Partial<CSSStyleDeclaration>}>) {
    backups.forEach(b => {
      const s = b.style;
      if (s.overflow !== undefined) b.el.style.overflow = s.overflow as string;
      if (s.maxHeight !== undefined) b.el.style.maxHeight = s.maxHeight as string;
      if (s.height !== undefined) b.el.style.height = s.height as string;
    });
  }

  /* ---------------------------
     EXPORT: Excel (.xlsx)
  --------------------------- */
  exportExcel() {
  if (!this.dashboard) {
    this.exportMessage = "No data to export";
    setTimeout(() => (this.exportMessage = ""), 2000);
    return;
  }

  try {
    const wb = XLSX.utils.book_new();

    const surveyTitle =
      this.surveys.find((s) => (s.id ?? s.surveyId) === this.selectedSurveyId)
        ?.title ?? "All Surveys";

    const deptName =
      this.departments.find(
        (d) => (d.id ?? d.departmentId) === this.selectedDepartmentId
      )?.name ?? "All Departments";

    /* -------------------------------------------------------------------
       SHEET 1 — COMPLETE SUMMARY (Survey, Dept, KPI + Lists)
    --------------------------------------------------------------------*/
    const summaryAoa: any[] = [
      ["Survey Name", surveyTitle],
      ["Department Name", deptName],
      [],
      ["Metric", "Value"],
      ["Total Employees", this.totalEmployees],
      ["Submitted", this.submittedCount],
      ["Pending", this.remainingCount],
      ["Submission Rate (%)", this.submissionRate + "%"],
      [],
      ["Submitted Employee ID", "Submitted Employee Name"],
      ...this.submittedEmployees.map((e) => [e.employeeId, e.employeeName]),
      [],
      ["Pending Employee ID", "Pending Employee Name"],
      ...this.pendingEmployees.map((e) => [e.employeeId, e.employeeName]),
    ];

    const wsSummary = XLSX.utils.aoa_to_sheet(summaryAoa);
    wsSummary["!cols"] = [{ wch: 20 }, { wch: 40 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");


    /* -------------------------------------------------------------------
       SHEET 2 — Department Stats
    --------------------------------------------------------------------*/
    const deptData = (this.dashboard?.departmentStats ?? []).map((d: any) => ({
      Department: d.departmentName ?? d.name ?? "",
      Total: d.totalEmployees ?? d.total ?? 0,
      Submitted: d.submitted ?? 0,
      Pending: d.pending ?? 0,
      ResponseRate: d.responseRate ?? d.responseRatePct ?? 0,
    }));

    const wsDept = XLSX.utils.json_to_sheet(deptData);
    XLSX.utils.book_append_sheet(wb, wsDept, "Department Stats");


    /* -------------------------------------------------------------------
       SHEET 3 — Submitted Employees
    --------------------------------------------------------------------*/
    const submittedRows = this.submittedEmployees.map((s) => ({
      EmployeeID: s.employeeId,
      EmployeeName: s.employeeName,
    }));

    const wsSubmitted = XLSX.utils.json_to_sheet(submittedRows);
    wsSubmitted["!cols"] = [{ wch: 12 }, { wch: 35 }];
    XLSX.utils.book_append_sheet(wb, wsSubmitted, "Submitted Employees");


    /* -------------------------------------------------------------------
       SHEET 4 — Pending Employees
    --------------------------------------------------------------------*/
    const pendingRows = this.pendingEmployees.map((p) => ({
      EmployeeID: p.employeeId,
      EmployeeName: p.employeeName,
    }));

    const wsPending = XLSX.utils.json_to_sheet(pendingRows);
    wsPending["!cols"] = [{ wch: 12 }, { wch: 35 }];
    XLSX.utils.book_append_sheet(wb, wsPending, "Pending Employees");


    /* -------------------------------------------------------------------
       SHEET 5 — Combined Employee List
    --------------------------------------------------------------------*/
    const combined = [
      ["Type", "Employee ID", "Employee Name"],
      ...this.submittedEmployees.map((e) => ["Submitted", e.employeeId, e.employeeName]),
      ...this.pendingEmployees.map((e) => ["Pending", e.employeeId, e.employeeName]),
    ];

    const wsCombined = XLSX.utils.aoa_to_sheet(combined);
    wsCombined["!cols"] = [{ wch: 14 }, { wch: 14 }, { wch: 35 }];
    XLSX.utils.book_append_sheet(wb, wsCombined, "All Employees");


    /* -------------------------------------------------------------------
       SAVE FILE
    --------------------------------------------------------------------*/
    const fileName = `Dashboard-${new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/:/g, "-")}.xlsx`;

    XLSX.writeFile(wb, fileName);

    this.exportMessage = "Excel downloaded";
  } catch (err) {
    console.error("Excel export error:", err);
    this.exportMessage = "Excel export failed";
  } finally {
    setTimeout(() => (this.exportMessage = ""), 3000);
  }
}

  /* ---------------------------
     EXPORT: PDF (ONLY dashboard, hide buttons, no gradient)
  --------------------------- */
//   async exportPDF() {
//   if (!this.dashboard) return;

//   this.isExporting = true;
//   this.exportMessage = "Exporting PDF...";

//   const dashboardEl = document.getElementById("dashboard-section")!;
//   dashboardEl.classList.add("pdf-capture");

//   const backups = this.expandForExport([
//     ".table-wrapper",
//     ".employee-list-wrapper",
//     ".row",
//     ".col-md-6",
//     "#dashboard-section",
//   ]);

//   try {
//     const canvas = await html2canvas(dashboardEl, {
//       scale: 2.4,
//       backgroundColor: "#ffffff"
//     });

//     this.restoreAfterExport(backups);
//     dashboardEl.classList.remove("pdf-capture");

//     const pdf = new jsPDF("p", "mm", "a4");
//     const imgData = canvas.toDataURL("image/png");

//     const pageWidth = pdf.internal.pageSize.getWidth();
//     const imgHeight = (canvas.height * pageWidth) / canvas.width;
//     let heightLeft = imgHeight;
//     let position = 0;

//     pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
//     heightLeft -= pdf.internal.pageSize.height;

//     while (heightLeft > 0) {
//       pdf.addPage();
//       position -= pdf.internal.pageSize.height;
//       pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
//       heightLeft -= pdf.internal.pageSize.height;
//     }

//     pdf.save(`Dashboard-${Date.now()}.pdf`);
//     this.exportSuccess();

//   } catch (err) {
//     console.error(err);
//     alert("PDF Export Failed");
//   }

//   this.isExporting = false;
// }

async exportPDF() {
  if (!this.dashboard) return;

  this.isExporting = true;
  this.exportMessage = "Exporting PDF...";

  const dashboardEl = document.getElementById("dashboard-section")!;
  dashboardEl.classList.add("pdf-capture");

  const backups = this.expandForExport([
    ".table-wrapper",
    ".employee-list-wrapper",
    ".row",
    ".col-md-6",
    "#dashboard-section",
  ]);

  try {
    const canvas = await html2canvas(dashboardEl, {
      scale: 2.4,
      backgroundColor: "#ffffff"
    });

    this.restoreAfterExport(backups);
    dashboardEl.classList.remove("pdf-capture");

    const pdf = new jsPDF("p", "mm", "a4");

    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();

    const margin = 10;
    const usableW = pageW - margin * 2;
    const usableH = pageH - margin * 2;

    const imgWidth = usableW;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const fullImg = canvas;

    let remainingHeight = imgHeight;
    let currentY = 0;

    // Create temporary canvas for slicing
    const sliceCanvas = document.createElement("canvas");
    const sliceCtx = sliceCanvas.getContext("2d")!;
    sliceCanvas.width = fullImg.width;
    sliceCanvas.height = (usableH * fullImg.width) / usableW;

    let pageIndex = 0;

    while (remainingHeight > 0) {
      const sliceHeight = sliceCanvas.height / 1.0;
      sliceCtx.clearRect(0, 0, sliceCanvas.width, sliceCanvas.height);

      sliceCtx.drawImage(
        fullImg,
        0,
        currentY,
        fullImg.width,
        sliceHeight,
        0,
        0,
        sliceCanvas.width,
        sliceCanvas.height
      );

      const slicedImg = sliceCanvas.toDataURL("image/png");

      if (pageIndex > 0) pdf.addPage();

      pdf.addImage(
        slicedImg,
        "PNG",
        margin,
        margin,
        usableW,
        usableH
      );

      currentY += sliceHeight;
      remainingHeight -= usableH;
      pageIndex++;
    }

    pdf.save(`Dashboard-${Date.now()}.pdf`);
    this.exportSuccess();

  } catch (err) {
    console.error(err);
    alert("PDF Export Failed");
  }

  this.isExporting = false;
}


  /* ---------------------------
     EXPORT: PPT (ONLY dashboard area, expands tables)
  --------------------------- */
 async exportPPT() {
  if (!this.dashboard) return;

  this.isExporting = true;
  this.exportMessage = "Exporting PPT...";

  const dashboardEl = document.getElementById("dashboard-section")!;
  dashboardEl.classList.add("ppt-capture");

  const backups = this.expandForExport([
    ".table-wrapper",
    ".employee-list-wrapper",
    ".row",
    ".col-md-6",
    "#dashboard-section"
  ]);

  try {
    /* ----------------------- CAPTURE KPI + CHART IMAGES ----------------------- */
    const capture = async (selector: string) => {
      const el = document.querySelector(selector) as HTMLElement;
      if (!el) return null;

      const canvas = await html2canvas(el, {
        scale: 3,
        backgroundColor: "#ffffff"
      });

      return canvas.toDataURL("image/png");
    };

    const kpiImg = await capture("#ppt-kpi-section");
    const chartImg = await capture("#ppt-chart-section");

    this.restoreAfterExport(backups);
    dashboardEl.classList.remove("ppt-capture");

    /* ------------------------------ CREATE PPT ------------------------------ */
    const ppt = new PptxGenJS();
    ppt.layout = "LAYOUT_WIDE";

    const slideW = 13.33;
    const slideH = 7.5;

    /* ---------------------------- Slide 1: KPI + Logo ---------------------------- */
/* ---------------------------- Slide 1: KPI + Logo ---------------------------- */
const s1 = ppt.addSlide();

/* --- Logo (Top Left) --- */
s1.addImage({
  path: "assets/images/aurionpro-logo.jpg",
  x: 0.4,
  y: 0.3,
  w: 2.6,     // medium-normal logo size
});

/* --- BIG CLEAN GAP + Heading --- */
s1.addText("Dashboard Summary", {
  x: 0.4,
  y: 1.9,      // MUCH bigger gap
  fontSize: 34,
  bold: true,
  color: "#009B8C"
});

/* --- KPI IMAGE (Medium Sized) --- */
if (kpiImg) {
  s1.addImage({
    data: kpiImg,
    x: 0.5,
    y: 3.0,          // placed lower for gap
    w: slideW - 3,   // reduced width → medium
    h: 3.2           // reduced height → medium
  });
}



    /* ----------------------------- Slide 2: Chart ----------------------------- */
    const s2 = ppt.addSlide();
    s2.addText("Department Chart", {
      x: 0.4, y: 0.3, fontSize: 28, bold: true, color: "#009B8C"
    });

    if (chartImg) {
      s2.addImage({
        data: chartImg,
        x: 0.3,
        y: 1.0,
        w: slideW - 0.6,
        h: slideH - 1.2
      });
    }

    /* ====================================================================== */
    /*                     PAGINATION FOR SUBMITTED EMPLOYEES                */
    /* ====================================================================== */

    const submitted = this.submittedEmployeesRaw;
    let submittedChunks = [];

    for (let i = 0; i < submitted.length; i += 10) {
      submittedChunks.push(submitted.slice(i, i + 10));
    }

    submittedChunks.forEach((chunk, index) => {
      const slide = ppt.addSlide();
      slide.addText(`Submitted Employees (Page ${index + 1})`, {
        x: 0.4,
        y: 0.3,
        fontSize: 26,
        bold: true,
        color: "#009B8C"
      });

      const rows = chunk.map((emp, i) => [{ text: `${i + 1}` }, { text: emp }]);

      slide.addTable(
        [
          [{ text: "Sr.No", options: { bold: true } }, { text: "Employee", options: { bold: true } }],
          ...rows
        ],
        {
          x: 0.5,
          y: 1.2,
          w: slideW - 1,
          border: { pt: 1, color: "999999" },
          fontSize: 18,
          fill: { color: "F8F9FA" }
        }
      );
    });

    /* ====================================================================== */
    /*                     PAGINATION FOR PENDING EMPLOYEES                  */
    /* ====================================================================== */

    const pending = this.pendingEmployeesRaw;
    let pendingChunks = [];

    for (let i = 0; i < pending.length; i += 10) {
      pendingChunks.push(pending.slice(i, i + 10));
    }

    pendingChunks.forEach((chunk, index) => {
      const slide = ppt.addSlide();

      slide.addText(`Pending Employees (Page ${index + 1})`, {
        x: 0.4,
        y: 0.3,
        fontSize: 26,
        bold: true,
        color: "#009B8C"
      });

      const rows = chunk.map((emp, i) => [{ text: `${i + 1}` }, { text: emp }]);

      slide.addTable(
        [
          [{ text: "Sr.No", options: { bold: true } }, { text: "Employee", options: { bold: true } }],
          ...rows
        ],
        {
          x: 0.5,
          y: 1.2,
          w: slideW - 1,
          border: { pt: 1, color: "999999" },
          fontSize: 18,
          fill: { color: "F8F9FA" }
        }
      );
    });

    /* ---------------------------- SAVE PPT ---------------------------- */
    await ppt.writeFile({ fileName: `Dashboard-${Date.now()}.pptx` });
    this.exportSuccess();

  } catch (err) {
    console.error(err);
    alert("PPT Export Failed");
  }

  this.isExporting = false;
}



  private loadImageBase64(path: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.src = path;
  });
}

private exportSuccess() {
  setTimeout(() => {
    alert("Export Successful");
    window.location.reload();
  }, 300);
}

}
