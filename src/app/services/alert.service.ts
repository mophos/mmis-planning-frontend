import { Injectable } from '@angular/core';

import { default as swal, SweetAlertType, SweetAlertOptions } from 'sweetalert2';

@Injectable()
export class AlertService {

  constructor() { }

  error(text: any = null, title: any = '') {

    const option: SweetAlertOptions = {
      title: title,
      text: text,
      type: 'error',
      confirmButtonText: 'ตกลง'
    };
    swal(option);

  }

  success(title = 'ดำเนินการเสร็จเรียบร้อย', text = '') {

    const option: SweetAlertOptions = {
      title: title,
      text: text,
      type: 'success',
      confirmButtonText: 'ตกลง'
    };
    swal(option);

  }

  /**
   * แจ้งผลการนำเข้า Excel ที่มีบางรายการเข้าไม่ได้
   *
   * ต้องบอกเป็นรายแถวพร้อมเลขแถวใน Excel ไม่ใช่บอกแค่ว่า "สำเร็จ"
   * เพราะเดิมรายการที่จับคู่ไม่ได้จะหายเงียบ ๆ ผู้ใช้ไม่รู้ว่าอะไรตกหล่นและเพราะอะไร
   */
  importResult(imported: number, skipped: any[]) {
    if (!skipped || !skipped.length) {
      this.success('นำเข้าข้อมูลเรียบร้อย', `นำเข้าได้ ${imported} รายการ`);
      return;
    }

    const escape = (v: any) => String(v === undefined || v === null ? '' : v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // จำกัดที่ 20 แถว ถ้าตกหล่นเป็นร้อยแถวจะยาวจนอ่านไม่ไหวและกล่องล้นจอ
    const shown = skipped.slice(0, 20);
    const rows = shown.map(s => `<tr>
        <td style="padding:2px 6px;text-align:right;">${escape(s.row)}</td>
        <td style="padding:2px 6px;text-align:left;">${escape(s.generic_name)}</td>
        <td style="padding:2px 6px;text-align:left;">${escape(s.unit_desc)}</td>
        <td style="padding:2px 6px;text-align:left;">${escape(s.reason)}</td>
      </tr>`).join('');

    const more = skipped.length > shown.length
      ? `<div style="margin-top:6px;">และอีก ${skipped.length - shown.length} รายการ</div>` : '';

    const option: SweetAlertOptions = {
      title: 'นำเข้าข้อมูลบางส่วน',
      type: 'warning',
      width: 800,
      html: `
        <div style="text-align:left;font-size:14px;">
          <div style="margin-bottom:8px;">
            นำเข้าสำเร็จ <b>${imported}</b> รายการ ·
            ไม่ได้นำเข้า <b style="color:#c92100;">${skipped.length}</b> รายการ
          </div>
          <div style="max-height:320px;overflow:auto;">
            <table style="width:100%;border-collapse:collapse;font-size:13px;">
              <thead><tr style="background:#eee;">
                <th style="padding:4px 6px;">แถวที่</th>
                <th style="padding:4px 6px;text-align:left;">รายการ</th>
                <th style="padding:4px 6px;text-align:left;">หน่วย</th>
                <th style="padding:4px 6px;text-align:left;">สาเหตุ</th>
              </tr></thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
          ${more}
        </div>`,
      confirmButtonText: 'ตกลง'
    };
    swal(option);
  }

  serverError() {

    const option: SweetAlertOptions = {
      title: 'เกิดข้อผิดพลาด',
      text: 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์',
      type: 'error',
      confirmButtonText: 'ตกลง'
    };
    swal(option);

  }

  confirm(text = 'คุณต้องการดำเนินการนี้ ใช่หรือไม่?', ) {
    const option: SweetAlertOptions = {
      title: '',
      text: text,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ดำเนินการ!',
      cancelButtonText: 'ยกเลิก'
    };
    return swal(option);
  }
}
