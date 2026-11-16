import json

with open(r'd:\RBAMS\extracted_data.json', encoding='utf-8') as f:
    raw = json.load(f)

dept_meta = {
    'Finance': {
        'code': 'FIN',
        'head': 'Hendrawan Kusuma, SE, Ak, CA',
        'color': '#00f3ff',
        'badgeColor': 'cyan',
        'icon': 'DollarSign',
        'objective': 'Pengelolaan likuiditas, AR/AP, dan kepatuhan perpajakan FMCG nasional.',
        'kri_metric': 'AR Overdue > 60 Days: Rp 4.2M (Threshold: < Rp 2M)'
    },
    'Sales': {
        'code': 'SLS',
        'head': 'Rian Pratama, MBA',
        'color': '#f000ff',
        'badgeColor': 'magenta',
        'icon': 'TrendingUp',
        'objective': 'Penetrasi distribusi General Trade (GT) dan Modern Trade (MT).',
        'kri_metric': 'Store Churn Rate: 7.2% (Target: < 5%)'
    },
    'Marketing': {
        'code': 'MKT',
        'head': 'Clarissa Anggraini',
        'color': '#38bdf8',
        'badgeColor': 'sky',
        'icon': 'Megaphone',
        'objective': 'Brand equity, product launch inovasi SKU, efektivitas trade promotion.',
        'kri_metric': 'Trade Promo Variance: 3.4% (Threshold: < 2%)'
    },
    'Delivery': {
        'code': 'DLV',
        'head': 'Suryadi Hartono',
        'color': '#f97316',
        'badgeColor': 'orange',
        'icon': 'Navigation',
        'objective': 'Ketepatan waktu drop point toko retail dan integritas muatan armada.',
        'kri_metric': 'Lead Time Transit: +2.4 Hari dari SLA'
    },
    'Warehouse': {
        'code': 'WHS',
        'head': 'Dedi Mulyanto',
        'color': '#10b981',
        'badgeColor': 'emerald',
        'icon': 'Warehouse',
        'objective': 'Akurasi inventory stok (WMS), FEFO tracking, dan utilisasi kapasitas racking.',
        'kri_metric': 'Inventory Shrinkage: 0.42% (Threshold: < 0.2%)'
    },
    'Purchasing': {
        'code': 'PUR',
        'head': 'Maya Indriani, MM',
        'color': '#a855f7',
        'badgeColor': 'purple',
        'icon': 'ShoppingBag',
        'objective': 'Pengadaan bahan baku kemasan, evaluasi vendor, dan harga kontrak kompetitif.',
        'kri_metric': 'Supplier Delivery Delay: 8.5% (Threshold: < 4%)'
    },
    'IT': {
        'code': 'ITD',
        'head': 'Agus Firmansyah, S.Kom, CISSP',
        'color': '#06b6d4',
        'badgeColor': 'cyan',
        'icon': 'Cpu',
        'objective': 'Ketersediaan sistem ERP/WMS, keamanan siber, disaster recovery backup.',
        'kri_metric': 'ERP/WMS Uptime: 98.7% (SLA: > 99.5%)'
    },
    'HR': {
        'code': 'HRD',
        'head': 'Sri Wahyuni, S.Psi, CHRP',
        'color': '#ec4899',
        'badgeColor': 'pink',
        'icon': 'Users',
        'objective': 'Produktivitas tenaga kerja sales/pabrik, kepatuhan K3, retensi talent kunci.',
        'kri_metric': 'Factory Overtime Ratio: 12.8% (Target: < 8%)'
    },
    'Legal': {
        'code': 'LGL',
        'head': 'Farhan Nugroho, SH, MH',
        'color': '#6366f1',
        'badgeColor': 'indigo',
        'icon': 'ShieldAlert',
        'objective': 'Kepatuhan izin edar BPOM, halal, perjanjian distributor, litigasi hukum.',
        'kri_metric': 'Pending Distributor Disputes: 3 Kasus'
    },
    'Audit Internal': {
        'code': 'IAU',
        'head': '..........................................',
        'color': '#14b8a6',
        'badgeColor': 'teal',
        'icon': 'CheckCircle2',
        'objective': 'Pelaksanaan Annual Audit Plan berbasis risiko dan validasi tata kelola ERM.',
        'kri_metric': 'Audit Plan Coverage: 28% of High Risk Items'
    }
}

content = "// RBAMS Master Dataset & Configurations\n"
content += "// Extracted from Risk_Register_FMCG_Dummy 2026.xlsx for PT. Agung Putra Nirantara\n\n"
content += "export const COMPANY_INFO = {\n"
content += "  name: 'PT. Agung Putra Nirantara',\n"
content += "  systemName: 'Risk Based Audit Management System (RBAMS)',\n"
content += "  codeName: 'RBAMS-CORE v2.6',\n"
content += "  yearCurrent: 2026,\n"
content += "  yearBaseline: 2025,\n"
content += "  industry: 'Fast Moving Consumer Goods (FMCG) Distribution & Manufacturing',\n"
content += "  auditHead: '..........................................',\n"
content += "  ermHead: 'Dra. Ratna Paramita, CRMA',\n"
content += "  chiefAuditExecutive: '..........................................',\n"
content += "  presidentDirector: 'Agung Putra Nirantara, MBA',\n"
content += "  internalAuditManager: 'Rizki Zulkarnain S.EI.,CIPFM',\n"
content += "  auditCommitteeChair: 'Rizki Zulkarnain S.EI.,CIPFM'\n"
content += "};\n\n"

content += "export const DEPARTMENT_META = " + json.dumps(dept_meta, indent=2, ensure_ascii=False) + ";\n\n"
content += "export const INITIAL_RISKS = " + json.dumps(raw['risks'], indent=2, ensure_ascii=False) + ";\n\n"
content += "export const RISK_PROFILES = " + json.dumps(raw['profiles'], indent=2, ensure_ascii=False) + ";\n"

with open(r'd:\RBAMS\rbams-ui\src\data\riskData.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('Success generating riskData.js!')
