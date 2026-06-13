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

/**
 * 通用交接管理系统 - 核心业务逻辑 (安全加固与分层归档版)
 */

const CONFIG = {
    KEYS: { 
        LOGS: 'handover_logs', 
        HISTORY: 'handover_history',
        ARCHIVE: 'handover_logs_archive'
    },
    MAX_LOGS: 50,
    TARGET_ORIGIN: window.location.origin // 锁定通信源，杜绝跨站通配符 '*' 漏洞
};

document.addEventListener('DOMContentLoaded', () => {
    initializeForm();
    setupEventListeners();
    addLog('系统消息', '通用交接系统内核初始化成功，安全通信域已锁定。', 'info');
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
    
    // 显式提取与字段 XSS 无害化过滤
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
            `交接确认 (${sanitizedData.shift})`, 
            `交班人: ${sanitizedData.outgoingName || '未填写'} ➡️ 接班人: ${sanitizedData.incomingName || '未填写'}\n流水号: ${sanitizedData.id.substring(0,8)}`, 
            statusMap[sanitizedData.status] || 'success'
        );
        alert('🎉 交接记录已成功归档并实时同步！');
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

        // 超过50条时，将最老的日志向冷数据归档区迁移
        if (logs.length > CONFIG.MAX_LOGS) {
            const oldestLog = logs.shift();
            let archive = JSON.parse(localStorage.getItem(CONFIG.KEYS.ARCHIVE) || '[]');
            archive.push(oldestLog);
            localStorage.setItem(CONFIG.KEYS.ARCHIVE, JSON.stringify(archive));
        }

        localStorage.setItem(CONFIG.KEYS.LOGS, JSON.stringify(logs));
    } catch (error) {
        console.error('存储空间满或写入失败:', error);
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
        console.error('归档数据库写入失败:', error);
        alert('错误：浏览器存储空间已满，数据归档失败！');
        return false;
    }
}

function loadTemplate() {
    const todayStr = new Date().toISOString().split('T')[0];
    const template = {
        date: todayStr,
        time: '08:30',
        shift: 'Morning',
        outgoingName: '张三 (Tech_01)',
        incomingName: '李四 (Tech_02)',
        status: 'Warning',
        accomplishments: '1. 完成核心机房日常巡检，硬件无异常。\n2. 成功部署用户模块 V1.2.0 热补丁。',
        actionItems: '1. 跟进下午 3 点与外部供应商的网络联调。\n2. 注意观察备份机房空调运行温度。',
        incidents: '上午 10:15 交换机 B 触发短暂 CPU 占满告警，持续约 2 分钟，目前已恢复。',
        equipmentStatus: '巡检终端 Pda-03 屏幕有轻微裂痕，但不影响正常功能。',
        inventoryNotes: 'A4 打印纸已耗尽，已向行政部提交采购申请。'
    };

    populateForm(template);
    addLog('模板载入', '快捷交接模板已成功覆盖至当前表单。', 'info');
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
        filename = `交接数据_${timestamp}.json`;
    } else if (format === 'csv') {
        const headers = ['交接日期', '交接时间', '班次', '交班人', '接班人', '状态评估', '主要完成事项', '需跟进事项', '异常报告', '设备状态', '库存备注'];
        const values = Object.values(data).map(v => `"${String(v).replace(/"/g, '""')}"`);
        content = '\uFEFF' + [headers.join(','), values.join(',')].join('\n'); // 强加 BOM 头防御 Excel 乱码
        mimeType = 'text/csv;charset=utf-8';
        filename = `交接表单_${timestamp}.csv`;
    }

    downloadFile(content, mimeType, filename);
    addLog('数据导出', `表单内容已成功导出为 ${format.toUpperCase()} 文件。`, 'info');
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
    if (confirm('确认要清空当前表单内填写的所有数据吗？')) {
        document.getElementById('handoverForm').reset();
        initializeForm();
        addLog('表单重置', '当前运行表单已被操作员手动清空。', 'warning');
    }
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
