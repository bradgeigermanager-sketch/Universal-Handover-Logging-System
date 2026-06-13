/**
 * Universal Handover System - Core Logic (Hardened Security & Tiered Archival)
 */

const CONFIG = {
    KEYS: { 
        LOGS: 'handover_logs', 
        HISTORY: 'handover_history',
        ARCHIVE: 'handover_logs_archive'
    },
    MAX_LOGS: 50,
    TARGET_ORIGIN: window.location.origin // Locks down the broadcast frame vector to avoid open wildcards '*'
};

document.addEventListener('DOMContentLoaded', () => {
    initializeForm();
    setupEventListeners();
    addLog('System Message', 'Universal Handover Core initialized. Frame communication domain secured.', 'info');
});

function initializeForm() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    document.getElementById('date').value = `${year}-${month}-${day}`;
    document.getElementById('time').value = now.toTimeString().substring(0, 5);
}

function setupEventListeners() {
    const form = document.getElementById('handoverForm');
    if (form) form.addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const rawData = Object.fromEntries(formData.entries());
    
    // Explicit Destructuring & XSS String Neutralization
    const sanitizedData = {
        id: generateUUID(),
        date: rawData.date,
        time: rawData.time,
        shift: rawData.shift,
        outgoingName: sanitizeString(rawData.outgoingName),
        incomingName: sanitizeString(rawData.incomingName),
        status: e.target.querySelector('input[name="status"]:checked')?.value || 'Normal',
        accomplishments: sanitizeString(rawData.accomplishments),
        actionItems: sanitizeString(rawData.actionItems),
        incidents: sanitizeString(rawData.incidents),
        equipmentStatus: sanitizeString(rawData.equipmentStatus),
        inventoryNotes: sanitizeString(rawData.inventoryNotes),
        submittedAt: new Date().toISOString()
    };

    if (saveToHistory(sanitizedData)) {
        const statusMap = { 'Normal': 'success', 'Warning': 'warning', 'Critical': 'error' };
        addLog(
            `Handover Confirmed (${sanitizedData.shift})`, 
            `Outgoing: ${sanitizedData.outgoingName || 'Anonymous'} ➡️ Incoming: ${sanitizedData.incomingName || 'Anonymous'}\nRecord UUID: ${sanitizedData.id.substring(0,8)}`, 
            statusMap[sanitizedData.status] || 'success'
        );
        alert('🎉 Handover record archived and mirrored to logging window!');
    }
}

function sanitizeString(str) {
    if (!str) return '';
    return str.replace(/</g, '&lt;').replace(/>/g, '&gt;').trim();
}

function addLog(title, message, level = 'info') {
    const logEntry = {
        id: generateUUID(),
        timestamp: Date.now(),
        title: title,
        message: message,
        level: level
    };

    try {
        let logs = JSON.parse(localStorage.getItem(CONFIG.KEYS.LOGS) || '[]');
        logs.push(logEntry);

        // Tiered Archival Optimization Strategy
        if (logs.length > CONFIG.MAX_LOGS) {
            const oldestLog = logs.shift();
            let archive = JSON.parse(localStorage.getItem(CONFIG.KEYS.ARCHIVE) || '[]');
            archive.push(oldestLog);
            localStorage.setItem(CONFIG.KEYS.ARCHIVE, JSON.stringify(archive));
        }

        localStorage.setItem(CONFIG.KEYS.LOGS, JSON.stringify(logs));
    } catch (error) {
        console.error('Storage buffer overflow or write write anomaly:', error);
    }

    const iframe = document.getElementById('logFrame');
    if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage({
            type: 'NEW_LOG',
            payload: logEntry
        }, CONFIG.TARGET_ORIGIN);
    }
}

function saveToHistory(record) {
    try {
        const history = JSON.parse(localStorage.getItem(CONFIG.KEYS.HISTORY) || '[]');
        history.push(record);
        localStorage.setItem(CONFIG.KEYS.HISTORY, JSON.stringify(history));
        return true;
    } catch (error) {
        console.error('Master Ledger Engine fault:', error);
        alert('Error: Client browser memory allocation limits reached. Archive failed.');
        return false;
    }
}

function loadTemplate() {
    const todayStr = new Date().toISOString().split('T')[0];
    const template = {
        date: todayStr,
        time: '08:30',
        shift: 'Morning',
        outgoingName: 'John Doe (Tech_01)',
        incomingName: 'Jane Smith (Tech_02)',
        status: 'Warning',
        accomplishments: '1. Executed standard server rack patrols. Hardware green.\n2. Successfully deployed user hotfix bundle V1.2.0.',
        actionItems: '1. Coordinate with network vendors regarding cross-links at 15:00.\n2. Verify climate levels in primary power containment units.',
        incidents: '10:15 Switch-B triggered transient spikes on CPU allocation. Settled out after 2 minutes.',
        equipmentStatus: 'Terminal unit Pda-03 features minor layout hairline fracture. Operational status retained.',
        inventoryNotes: 'A4 physical media completely depleted. Logistics manifest filed.'
    };

    populateForm(template);
    addLog('Template Ingestion', 'Production environment parameters applied to form components.', 'info');
}

function populateForm(data) {
    const form = document.getElementById('handoverForm');
    if (!form) return;

    for (const key in data) {
        if (form.elements[key]) {
            const el = form.elements[key];
            if (el.type === 'radio' || el instanceof RadioNodeList) {
                const radio = form.querySelector(`input[name="${key}"][value="${data[key]}"]`);
                if (radio) radio.checked = true;
            } else {
                el.value = data[key];
            }
        }
    }
}

function exportData(format) {
    const form = document.getElementById('handoverForm');
    if (!form) return;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    data.status = form.querySelector('input[name="status"]:checked')?.value || 'Normal';
    
    let content, mimeType, filename;
    const timestamp = Date.now();

    if (format === 'json') {
        content = JSON.stringify(data, null, 2);
        mimeType = 'application/json';
        filename = `HandoverData_${timestamp}.json`;
    } else if (format === 'csv') {
        const headers = ['Date', 'Time', 'Shift', 'Outgoing', 'Incoming', 'Status_Rating', 'Key_Accomplishments', 'Action_Items', 'Incidents', 'Equipment_Log', 'Inventory_Notes'];
        const values = Object.values(data).map(v => `"${String(v).replace(/"/g, '""')}"`);
        content = '\uFEFF' + [headers.join(','), values.join(',')].join('\n'); // Forces UTF-8 BOM encoding for clean Excel import
        mimeType = 'text/csv;charset=utf-8';
        filename = `HandoverManifest_${timestamp}.csv`;
    }

    downloadFile(content, mimeType, filename);
    addLog('Data Exported', `Active layout properties compiled into target format: ${format.toUpperCase()}`, 'info');
}

function downloadFile(content, mimeType, filename) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function resetForm() {
    if (confirm('Are you sure you want to discard all unsubmitted document data?')) {
        document.getElementById('handoverForm').reset();
        initializeForm();
        addLog('Form Cleanse', 'Data entry form cleared by operator context.', 'warning');
    }
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
