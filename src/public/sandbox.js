const apiKey = 'yy'; // 🔐 أدخل API Key صالح هنا

function createTable(data, columns) {
  if (!data.length) return '<p>لا توجد بيانات</p>';

  const headers = columns.map(c => `<th>${c.label}</th>`).join('');
  const rows = data.map((item, i) => {
    const row = columns.map(c => `<td>${item[c.key] ?? '-'}</td>`).join('');
    return `<tr class="clickable-row" data-id="${item.id}">${row}</tr>`;
  }).join('');

  return `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
}

async function fetchData(endpoint, elementId, columns, onRowClick) {
  try {
    const res = await fetch(endpoint, {
      headers: { 'x-api-key': apiKey },
    });
    const data = await res.json();
    const dataset = data.data || data;
    const html = createTable(dataset, columns);
    document.getElementById(elementId).innerHTML = html;

    if (onRowClick) {
      const rows = document.querySelectorAll(`#${elementId} .clickable-row`);
      rows.forEach(row => {
        row.addEventListener('click', () => {
          const id = row.getAttribute('data-id');
          onRowClick(id);
        });
      });
    }
  } catch (err) {
    document.getElementById(elementId).innerHTML = '<p style="color:red;">خطأ في تحميل البيانات</p>';
  }
}

function loadAll() {
  fetchData('/integration/shipments', 'shipmentsTable', [
    { key: 'tracking_number', label: 'رقم التتبع' },
    { key: 'status_name', label: 'الحالة' },
    { key: 'recipient_name', label: 'العميل' },
    { key: 'to_city', label: 'المدينة' },
    { key: 'created_at', label: 'تاريخ الإنشاء' },
  ], viewShipmentDetails);

  fetchData('/integration/drivers', 'driversTable', [
    { key: 'name', label: 'الاسم' },
    { key: 'phone', label: 'الهاتف' },
    { key: 'is_available', label: 'متاح؟' },
    { key: 'current_city', label: 'المدينة' },
  ]);

  fetchData('/integration/settlements', 'settlementsTable', [
    { key: 'period_start', label: 'من' },
    { key: 'period_end', label: 'إلى' },
    { key: 'tenant_share', label: 'مستحق التاجر' },
    { key: 'bbox_share', label: 'نصيب BBox' },
    { key: 'status', label: 'الحالة' },
    { key: 'created_at', label: 'تاريخ الإنشاء' },
  ]);
}

async function generateSettlement() {
  try {
    const res = await fetch('/integration/settlements/generate', {
      method: 'POST',
      headers: { 'x-api-key': apiKey },
    });
    const json = await res.json();
    alert('✅ تم توليد تسوية جديدة: ' + json.settlement_id);
    loadAll();
  } catch (err) {
    alert('❌ فشل في توليد التسوية');
  }
}

async function viewShipmentDetails(id) {
  try {
    const res = await fetch(`/integration/shipments/${id}`, {
      headers: { 'x-api-key': apiKey },
    });
    const shipment = await res.json();

    document.getElementById('detail_tracking').value = shipment.tracking_number || '';
    document.getElementById('detail_recipient').value = shipment.recipient_info?.name || '';
    document.getElementById('detail_address').value = `${shipment.to_address?.street}, ${shipment.to_address?.city}`;
    document.getElementById('detail_status').value = shipment.status_name;
    document.getElementById('detail_total').value = (shipment.total_amount || 0) + ' SDG';

    const historyList = document.getElementById('statusHistory');
    historyList.innerHTML = shipment.status_history.map(h => {
      return `<li>[${new Date(h.created_at).toLocaleString()}] ${h.status_name} - ${h.note || ''}</li>`;
    }).join('');

    document.getElementById('shipmentDetails').style.display = 'block';
  } catch (err) {
    alert('❌ فشل في تحميل تفاصيل الشحنة');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('generateBtn').addEventListener('click', generateSettlement);
  loadAll();
});
