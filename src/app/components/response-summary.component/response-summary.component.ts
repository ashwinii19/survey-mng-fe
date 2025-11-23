import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { SurveyResponseService } from '../../services/survey-response.service';

import jsPDF from 'jspdf';
import PptxGenJS from 'pptxgenjs';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-response-summary',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './response-summary.component.html',
  styleUrls: ['./response-summary.component.css']
})
export class ResponseSummaryComponent implements OnInit, AfterViewInit {

  surveyId!: number;
  summary: any = null;
  questionStats: any[] = [];
  loading = false;

  // loader / export flags (kept as you had)
  isExporting = false;
  exportMessage = '';

  // NEW: flag to freeze charts once they have rendered after a page refresh
  private chartsFrozen = false;

  palette: string[] = [
    '#14b8a6', '#0ea5e9', '#6366f1',
    '#f59e0b', '#ef4444', '#10b981',
    '#ec4899', '#84cc16'
  ];

  constructor(
    private route: ActivatedRoute,
    private responseService: SurveyResponseService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.surveyId = Number(this.route.snapshot.paramMap.get('surveyId'));
    this.loadSummary();
    this.loadStats();
  }

  ngAfterViewInit(): void {}

  /* ---------------- data loaders ---------------- */
  loadSummary() {
    this.responseService.getSurveySummary(this.surveyId).subscribe({
      next: (res: any) => this.summary = res,
      error: (err: any) => console.error('Failed to load summary', err)
    });
  }

  loadStats() {
    this.loading = true;
    this.responseService.getQuestionStats(this.surveyId).subscribe({
      next: async (res: any) => {
        this.questionStats = Array.isArray(res) ? res : [];
        // ensure arrays exist
        this.questionStats.forEach((q: any) => {
          q.responses = q.responses ?? [];
          q.textAnswers = q.textAnswers ?? [];
          q.optionCounts = q.optionCounts ?? {};
          q.totalResponses = q.totalResponses ?? 0;
        });
        this.loading = false;

        // schedule freezing of charts once they finish their initial render after refresh
        // we do this only once per page load
        if (!this.chartsFrozen) {
          // small delay so chart components get a chance to mount
          await this.delay(150);
          this.scheduleFreezeCharts();
        }
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Failed to load stats', err);
      }
    });
  }

  /* -------------- template helpers -------------- */
  hasOptions(q: any): boolean {
    return !!(q && q.optionCounts && Object.keys(q.optionCounts || {}).length > 0);
  }

  calculatePercentage(val: any, total: number): number {
    const num = Number(val);
    if (!total || isNaN(num)) return 0;
    return (num / total) * 100;
  }

  buildPieData(q: any): ChartData<'pie'> {
    const labels = Object.keys(q.optionCounts || {});
    const values = Object.values(q.optionCounts || {}).map(v => Number(v ?? 0));
    return { labels, datasets: [{ data: values, backgroundColor: labels.map((_, i) => this.palette[i % this.palette.length]) }] };
  }

  buildBarData(q: any): ChartData<'bar'> {
    const labels = Object.keys(q.optionCounts || {});
    const values = Object.values(q.optionCounts || {}).map(v => Number(v ?? 0));
    return { labels, datasets: [{ label: q.questionText, data: values, backgroundColor: labels.map((_, i) => this.palette[i % this.palette.length]) }] };
  }

  // NOTE: keep responsive but disable animation to keep charts visually stable
  pieOptions: ChartOptions<'pie'> = { responsive: true, maintainAspectRatio: false, animation: false, plugins: { legend: { position: 'bottom' } } };
  barOptions: ChartOptions<'bar'> = { responsive: true, maintainAspectRatio: false, animation: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } };

  private delay(ms: number) { return new Promise<void>(r => setTimeout(r, ms)); }

  /**
   * tryForceChartUpdate -> will do nothing if charts are frozen.
   * If not frozen, attempt safe Chart.js update calls.
   */
  private tryForceChartUpdate() {
    if (this.chartsFrozen) {
      // once frozen, avoid changing charts (keeps the visual exact)
      return;
    }

    try {
      const ChartGlobal: any = (window as any).Chart;
      if (ChartGlobal) {
        if (typeof ChartGlobal.getChart === 'function') {
          document.querySelectorAll('canvas').forEach((node) => {
            try {
              const ch = ChartGlobal.getChart(node as HTMLCanvasElement);
              if (ch && typeof ch.update === 'function') {
                // ensure animations remain disabled during forced updates
                if (ch.options) ch.options.animation = false;
                ch.update();
              }
            } catch (e) { /* ignore single-canvas errors */ }
          });
        } else if (ChartGlobal.instances && typeof ChartGlobal.instances === 'object') {
          try {
            Object.values(ChartGlobal.instances).forEach((inst: any) => { try { inst.update?.(); } catch (e) { } });
          } catch (e) { /* ignore */ }
        }
      }
    } catch (e) { /* ignore any Chart global access errors */ }
    finally {
      try { window.dispatchEvent(new Event('resize')); } catch (e) { /* ignore */ }
    }
  }

  /* Wait until the actual canvas element has width/height > 0 or timeout */
  private async waitForCanvasReady(sel: string, timeout = 3000): Promise<HTMLCanvasElement | null> {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const el = document.querySelector(sel) as HTMLElement | null;
      if (el) {
        let c: HTMLCanvasElement | null = null;
        if (el.tagName.toLowerCase() === 'canvas') c = el as HTMLCanvasElement;
        else c = el.querySelector('canvas');

        if (c) {
          const rect = c.getBoundingClientRect();
          const dpr = window.devicePixelRatio || 1;
          if (c.width >= Math.round(rect.width * dpr) && c.height >= Math.round(rect.height * dpr) && rect.width > 2 && rect.height > 2) {
            return c;
          }
        }
      }
      await this.delay(120);
    }
    const final = document.querySelector(sel) as unknown as HTMLCanvasElement | null;
    if (final && final.tagName && final.tagName.toLowerCase() === 'canvas') return final;
    const nested = document.querySelector(sel)?.querySelector?.('canvas') as HTMLCanvasElement | null;
    return nested ?? null;
  }

  /**
   * Capture a canvas at high resolution preserving displayed size.
   * Returns string or undefined.
   */
  private canvasToHighResDataUrl(canvas: HTMLCanvasElement, scaleFactor = 2): string | undefined {
    try {
      if (!canvas) return undefined;
      const rect = canvas.getBoundingClientRect();
      const dispW = Math.max(1, Math.round(rect.width));
      const dispH = Math.max(1, Math.round(rect.height));
      const dpr = window.devicePixelRatio || 1;

      const targetW = Math.max(1, Math.round(dispW * dpr * scaleFactor));
      const targetH = Math.max(1, Math.round(dispH * dpr * scaleFactor));

      const tmp = document.createElement('canvas');
      tmp.width = targetW;
      tmp.height = targetH;
      const ctx = tmp.getContext('2d')!;
      ctx.imageSmoothingEnabled = true;

      // draw source canvas scaled into temp canvas
      ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, targetW, targetH);
      return tmp.toDataURL('image/png', 1.0);
    } catch (err) {
      console.warn('canvasToHighResDataUrl failed', err);
      return undefined;
    }
  }

  /**
   * Wait until all chart elements are in a "ready" state, by polling each question's canvas.
   * This is the core of "Option A" — loader stays until charts are fully rendered.
   */
  private async waitForAllChartsReady(maxWaitMs = 6000): Promise<boolean> {
    const start = Date.now();
    const selectors: string[] = [];
    for (let i = 0; i < this.questionStats.length; i++) {
      const q = this.questionStats[i];
      const qid = String(q.questionId ?? q.id ?? (i + 1));
      selectors.push(`#pie-${qid}`);
      selectors.push(`#bar-${qid}`);
    }
    if (!selectors.length) return true;

    while (Date.now() - start < maxWaitMs) {
      this.tryForceChartUpdate();
      let allReady = true;
      for (const sel of selectors) {
        const canvas = await this.waitForCanvasReady(sel, 400);
        if (!canvas) { allReady = false; break; }
        try {
          const tmp = document.createElement('canvas');
          tmp.width = 1; tmp.height = 1;
          tmp.getContext('2d')!.drawImage(canvas, 0, 0, 1, 1);
        } catch (e) {
          allReady = false;
          break;
        }
      }
      if (allReady) return true;
      await this.delay(180);
    }
    return false;
  }

  /**
   * Collect chart images (high-res) for each question.
   * If canvas capture fails for a chart, fallback to html2canvas of the wrapper element.
   * Returns: Record<qid, { pie?: string, bar?: string }>
   */
  private async collectChartImages(): Promise<Record<string, { pie?: string, bar?: string }>> {
    // nudge charts first
    this.tryForceChartUpdate();
    await this.delay(150);

    const map: Record<string, { pie?: string, bar?: string }> = {};

    for (let i = 0; i < this.questionStats.length; i++) {
      const q = this.questionStats[i];
      const qid = String(q.questionId ?? q.id ?? (i + 1));
      map[qid] = {};

      const pieSel = `#pie-${qid}`;
      const barSel = `#bar-${qid}`;

      const pieCanvas = await this.waitForCanvasReady(pieSel, 1200);
      const barCanvas = await this.waitForCanvasReady(barSel, 1200);

      if (pieCanvas) {
        const data = this.canvasToHighResDataUrl(pieCanvas, 2);
        if (data) map[qid].pie = data;
      }

      if (barCanvas) {
        const data = this.canvasToHighResDataUrl(barCanvas, 2);
        if (data) map[qid].bar = data;
      }

      // fallback to html2canvas on wrapper if direct canvas capture failed
      if (!map[qid].pie) {
        try {
          const wrap = document.querySelector(`#pie-${qid}`) as HTMLElement | null;
          if (wrap) {
            const snapshot = await html2canvas(wrap, { scale: 3, useCORS: true, backgroundColor: null });
            map[qid].pie = snapshot.toDataURL('image/png', 1.0);
          }
        } catch (e) { console.warn('html2canvas fallback pie failed for', qid, e); }
      }
      if (!map[qid].bar) {
        try {
          const wrap = document.querySelector(`#bar-${qid}`) as HTMLElement | null;
          if (wrap) {
            const snapshot = await html2canvas(wrap, { scale: 3, useCORS: true, backgroundColor: null });
            map[qid].bar = snapshot.toDataURL('image/png', 1.0);
          }
        } catch (e) { console.warn('html2canvas fallback bar failed for', qid, e); }
      }
    }

    return map;
  }

  /**
   * Schedule freeze: wait until charts are ready, then freeze them (disable updates).
   * This ensures charts render on refresh, then remain constant for exports until user refreshes page.
   */
  private async scheduleFreezeCharts() {
    try {
      // Wait up to 5s for charts to be ready
      await this.waitForAllChartsReady(5000);

      // Once ready, disable animations and perform a final update to capture the rendered state
      try {
        const ChartGlobal: any = (window as any).Chart;
        if (ChartGlobal && typeof ChartGlobal.getChart === 'function') {
          document.querySelectorAll('canvas').forEach((node) => {
            try {
              const ch = ChartGlobal.getChart(node as HTMLCanvasElement);
              if (ch) {
                if (ch.options) ch.options.animation = false;
                // ensure dropdown legend/rendering stable
                ch.update();
              }
            } catch (e) { /* ignore per-canvas errors */ }
          });
        }
      } catch (e) { /* ignore */ }

      // mark frozen so further updates do nothing
      this.chartsFrozen = true;
      // add a class to root so CSS or screenshot logic can adapt if necessary
      try { document.getElementById('response-summary-root')?.classList.add('charts-frozen'); } catch (e) { /* ignore */ }
    } catch (e) {
      console.warn('scheduleFreezeCharts failed', e);
      // still mark as frozen to prevent attempts to mutate charts
      this.chartsFrozen = true;
    }
  }

  /*************************************************************************
   * EXPORT — EXCEL
   *************************************************************************/
  exportExcel() {
  if (!this.summary && !this.questionStats.length) {
    this.exportMessage = 'No data to export';
    setTimeout(() => (this.exportMessage = ''), 1200);
    return;
  }

  try {
    const wb = XLSX.utils.book_new();

    /* -------------------------------------------------
     * COMBINED SHEET (Summary + Questions + Answers)
     * ------------------------------------------------- */

    const rows: any[] = [];

    // ---------- SUMMARY ----------
    rows.push(['Survey Title', this.summary?.surveyTitle ?? `Survey ${this.surveyId}`]);
    rows.push(['Generated At', new Date().toLocaleString()]);
    rows.push([]);

    rows.push(['Metric', 'Value']);
    rows.push(['Total Employees', this.summary?.totalEmployees ?? 0]);
    rows.push(['Submitted', this.summary?.submittedCount ?? 0]);
    rows.push(['Pending', this.summary?.pendingCount ?? 0]);
    rows.push([
      'Submission %',
      this.summary?.totalEmployees
        ? ((this.summary.submittedCount / this.summary.totalEmployees) * 100).toFixed(1) + '%'
        : '0%'
    ]);

    rows.push([]);
    rows.push([]); // gap before questions

    // ---------- HEADER ----------
    rows.push(['Question', 'Question Type', 'Option/Answer', 'Count', 'Percentage']);

    // ---------- QUESTION & ANSWERS ----------
    this.questionStats.forEach((q: any) => {
      const question = q.questionText;
      const type = q.questionType;
      const total = q.totalResponses || 0;

      /** OPTION QUESTIONS */
      if (this.hasOptions(q)) {
        for (const [opt, cnt] of Object.entries(q.optionCounts || {})) {
          const num = Number(cnt ?? 0);
          const pct = total ? ((num / total) * 100).toFixed(1) + '%' : '0%';

          rows.push([
            question,
            type,
            opt,
            num,
            pct
          ]);
        }
      }
      /** TEXT / TEXTAREA QUESTIONS */
      else {
        const answers: string[] = q.textAnswers ?? [];

        if (!answers.length) {
          rows.push([question, type, 'No answers', '', '']);
        } else {
          answers.forEach((ans: string) => {
            rows.push([question, type, ans, '', '']);
          });
        }
      }

      // blank separator row after each question
      rows.push([]);
    });

    // Convert to sheet
    const sheet = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, sheet, 'Survey Export');

    // Save file
    const fileName = `SurveyResponses-${this.surveyId}-${new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/:/g, '-')}.xlsx`;

    XLSX.writeFile(wb, fileName);

    this.exportMessage = 'Excel downloaded';
  } catch (err) {
    console.error('Excel export failed', err);
    this.exportMessage = 'Excel export failed';
  } finally {
    setTimeout(() => (this.exportMessage = ''), 1400);
  }
}


  /*************************************************************************
   * EXPORT — PDF (one question per page)
   * Option A flow: loader remains until charts are fully rendered, then export.
   *************************************************************************/
  async exportPDF() {
    if (!this.summary || !this.questionStats.length) {
      this.exportMessage = 'No data';
      setTimeout(() => this.exportMessage = '', 1000);
      return;
    }

    // Step 1: Start loader
    this.isExporting = true;
    this.exportMessage = 'Preparing export...';

    // Give the UI a short tick to show loader
    await this.delay(120);

    // Step 2: Force chart update + wait until all charts are ready (Option A)
    this.exportMessage = 'Waiting for charts to finish rendering...';
    const ready = await this.waitForAllChartsReady(8000); // wait up to 8s
    if (!ready) {
      // still continue but warn in console
      console.warn('Some charts did not become fully ready within timeout — proceeding with best-effort capture.');
    }

    // Step 3: capture high-res images
    this.exportMessage = 'Capturing charts...';
    const chartImgs = await this.collectChartImages();

    // Step 4: build PDF
    try {
      const logoBase64 = await this.loadImageBase64('assets/images/aurionpro-logo.jpg');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 12;
      const usableW = pageW - margin * 2;

      // Cover / summary page
      if (logoBase64) try { pdf.addImage(logoBase64, 'PNG', margin, margin, 28, 12); } catch (e) { /* ignore */ }
      pdf.setFontSize(18);
      pdf.text(this.summary.surveyTitle ?? `Survey ${this.surveyId}`, margin + 40, margin + 8);
      pdf.setFontSize(11);
      let y = margin + 26;
      pdf.text(`Total Employees: ${this.summary.totalEmployees ?? 0}`, margin, y); y += 7;
      pdf.text(`Submitted: ${this.summary.submittedCount ?? 0}`, margin, y); y += 7;
      pdf.text(`Pending: ${this.summary.pendingCount ?? 0}`, margin, y); y += 7;
      const perc = this.summary.totalEmployees ? ((this.summary.submittedCount / this.summary.totalEmployees) * 100).toFixed(1) : '0.0';
      pdf.text(`Submission %: ${perc}%`, margin, y);

      // Questions: one per page
      for (let i = 0; i < this.questionStats.length; i++) {
        const q = this.questionStats[i];
        const qid = String(q.questionId ?? q.id ?? (i + 1));
        pdf.addPage();
        let py = margin;

        pdf.setFontSize(12);
        pdf.text(`Q${i + 1}. ${q.questionText || 'Question'}`, margin, py); py += 8;
        pdf.setFontSize(10);
        pdf.text(`Type: ${q.questionType ?? ''}`, margin, py); py += 6;
        pdf.text(`Total Responses: ${q.totalResponses ?? 0}`, margin, py); py += 8;

        if (this.hasOptions(q)) {
          const pie = chartImgs[qid]?.pie;
          const bar = chartImgs[qid]?.bar;
          const chartW = (usableW - 8) / 2;
          const chartH = 80;

          if (pie) try { pdf.addImage(pie, 'PNG', margin, py, chartW, chartH); } catch (e) { console.warn('pdf.addImage pie failed', e); }
          if (bar) try { pdf.addImage(bar, 'PNG', margin + chartW + 8, py, chartW, chartH); } catch (e) { console.warn('pdf.addImage bar failed', e); }
          py += chartH + 8;

          // Option summary (Option — Count (Pct))
          pdf.setFontSize(10);
          const total = q.totalResponses || 0;
          for (const [opt, cnt] of Object.entries(q.optionCounts || {})) {
            const cntNum = Number(cnt ?? 0);
            const pctText = total > 0 ? `${((cntNum / total) * 100).toFixed(1)}%` : '0%';
            const line = `${opt} — ${cntNum} (${pctText})`;
            const wrapped = pdf.splitTextToSize(line, usableW);
            pdf.text(wrapped, margin, py);
            py += (wrapped.length * 6);
            if (py > pageH - margin - 20) { pdf.addPage(); py = margin; }
          }
        } else {
          // TEXT: show answer lines (bulleted)
          pdf.setFontSize(11);
          const answers: string[] = q.textAnswers ?? [];
          if (answers.length === 0) {
            pdf.text('No answers', margin, py); py += 6;
          } else {
            pdf.setFontSize(10);
            for (const a of answers) {
              const wrapped = pdf.splitTextToSize('• ' + (a ?? ''), usableW);
              pdf.text(wrapped, margin, py);
              py += (wrapped.length * 6);
              if (py > pageH - margin - 20) { pdf.addPage(); py = margin; }
            }
          }
        }
      }

      const filename = `SurveyResponses-${this.surveyId}-${Date.now()}.pdf`;

      // Step 5: finalize & save
      this.exportMessage = 'Finalizing PDF...';
      pdf.save(filename);

      // Step 6: success -> show confirm (OK refreshes page)
      this.isExporting = false;
      this.exportMessage = '';
      const ok = window.confirm('Export successful. Click OK to refresh the page and re-render charts.');
      if (ok) window.location.reload();

    } catch (err) {
      console.error('PDF export failed', err);
      this.isExporting = false;
      this.exportMessage = '';
      alert('PDF export failed');
    } finally {
      try { document.getElementById('response-summary-root')?.classList.remove('pdf-capture'); } catch {}
      this.isExporting = false;
      this.exportMessage = '';
    }
  }

  /*************************************************************************
   * EXPORT — PPTX (one question per slide)
   *************************************************************************/
async exportPPT() {
  if (!this.summary || !this.questionStats.length) {
    this.exportMessage = 'No data';
    setTimeout(() => (this.exportMessage = ''), 1000);
    return;
  }

  this.isExporting = true;
  this.exportMessage = 'Preparing PPT...';
  await this.delay(120);

  this.exportMessage = 'Waiting for charts to finish rendering...';
  await this.waitForAllChartsReady(8000);

  this.exportMessage = 'Capturing charts...';
  const chartImgs = await this.collectChartImages();

  try {
    const logoBase64 = await this.loadImageBase64('assets/images/aurionpro-logo.jpg');
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_WIDE';

    const margin = 0.4;

    /* -------------------------------------------------------
     * COVER SLIDE (same spacing as PDF)
     * ------------------------------------------------------- */
    const cover = pptx.addSlide();

    if (logoBase64) {
      cover.addImage({ data: logoBase64, x: margin, y: margin, w: 2.5 });
    }

    cover.addText(this.summary.surveyTitle ?? `Survey ${this.surveyId}`, {
      x: margin,
      y: 1.4,
      fontSize: 28,
      bold: true,
      color: '#009B8C'
    });

    cover.addText(
      [
        `Total Employees: ${this.summary.totalEmployees ?? 0}`,
        `Submitted: ${this.summary.submittedCount ?? 0}`,
        `Pending: ${this.summary.pendingCount ?? 0}`,
        `Submission %: ${
          this.summary.totalEmployees
            ? ((this.summary.submittedCount / this.summary.totalEmployees) * 100).toFixed(1)
            : '0.0'
        }%`
      ].join('\n'),
      { x: margin, y: 2.2, fontSize: 16 }
    );

    /* -------------------------------------------------------
     * QUESTION SLIDES (MATCH PDF EXACTLY)
     * ------------------------------------------------------- */
    for (let i = 0; i < this.questionStats.length; i++) {
      const q = this.questionStats[i];
      const qid = String(q.questionId ?? q.id ?? i + 1);

      let slide = pptx.addSlide();

      /* Header */
      slide.addText(`Q${i + 1}. ${q.questionText}`, {
        x: margin,
        y: margin,
        fontSize: 20,
        bold: true
      });

      slide.addText(`Type: ${q.questionType ?? ''}`, {
        x: margin,
        y: 1.0,
        fontSize: 14
      });

      slide.addText(`Total Responses: ${q.totalResponses ?? 0}`, {
        x: margin,
        y: 1.5,
        fontSize: 14
      });

      const pie = chartImgs[qid]?.pie;
      const bar = chartImgs[qid]?.bar;

      const chartW = 5.5;
      const chartH = 3.8;

      /* PIE & BAR same as PDF */
      if (pie) {
        slide.addImage({ data: pie, x: margin, y: 2.2, w: chartW, h: chartH });
      }

      if (bar) {
        slide.addImage({
          data: bar,
          x: margin + chartW + 0.3,
          y: 2.2,
          w: chartW,
          h: chartH
        });
      }

      /* OPTION QUESTIONS (table like PDF) */
      if (this.hasOptions(q)) {
        const total = q.totalResponses || 0;

        const rows: any[] = [
          [
            { text: 'Option', options: { bold: true } },
            { text: 'Count', options: { bold: true } },
            { text: 'Percent', options: { bold: true } }
          ]
        ];

        for (const [opt, cnt] of Object.entries(q.optionCounts || {})) {
          const c = Number(cnt ?? 0);
          const pct = total ? `${((c / total) * 100).toFixed(1)}%` : '0%';
          rows.push([{ text: opt }, { text: String(c) }, { text: pct }]);
        }

        slide.addTable(rows, {
          x: margin,
          y: 6.3,
          w: 11.2,
          fontSize: 12
        });

        continue;
      }

      /* -------------------------------------------------------
       * TEXT / TEXTAREA QUESTIONS → Auto Pagination
       * ------------------------------------------------------- */
      let answers: string[] = q.textAnswers || [];

      let currentY = 2.2;
      const lineHeight = 0.38;
      const maxY = 7.0;

      if (answers.length === 0) {
        slide.addText('No answers', {
          x: margin,
          y: currentY,
          fontSize: 14
        });
        continue;
      }

      for (const ans of answers) {
        // If overflow → new slide with same header
        if (currentY > maxY) {
          slide = pptx.addSlide();
          slide.addText(`Q${i + 1}. ${q.questionText}`, {
            x: margin,
            y: margin,
            fontSize: 20,
            bold: true
          });
          currentY = 1.2;
        }

        slide.addText(`• ${ans}`, {
          x: margin,
          y: currentY,
          fontSize: 14,
          color: '#333'
        });

        currentY += lineHeight;
      }
    }

    /* FINAL SAVE */
    this.exportMessage = 'Finalizing PPT...';
    await pptx.writeFile({ fileName: `SurveyResponses-${this.surveyId}-${Date.now()}.pptx` });

    this.isExporting = false;
    this.exportMessage = '';
    if (confirm('Export successful. Click OK to refresh.')) window.location.reload();
  } catch (err) {
    console.error('PPT export failed', err);
    this.isExporting = false;
    this.exportMessage = '';
    alert('PPT export failed');
  }
}



  /* helper: convert image path to base64 */
  private loadImageBase64(path: string): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = img.width; c.height = img.height;
        c.getContext('2d')!.drawImage(img, 0, 0);
        resolve(c.toDataURL('image/png'));
      };
      img.onerror = () => resolve('');
      img.src = path;
    });
  }

  private exportSuccess() {
    // kept if you want a secondary alert elsewhere
    setTimeout(() => { alert('Export successful'); }, 250);
  }

  navigateToSurveyList() {
    this.router.navigate(['/app/surveys']);
  }

  // kept for potential manual upscale usage
  private upscaleCanvas(c: HTMLCanvasElement): HTMLCanvasElement {
    const scale = 3; // High resolution
    const tmp = document.createElement("canvas");
    tmp.width = c.width * scale;
    tmp.height = c.height * scale;

    const ctx = tmp.getContext("2d")!;
    ctx.scale(scale, scale);
    ctx.drawImage(c, 0, 0);

    return tmp;
  }
}
