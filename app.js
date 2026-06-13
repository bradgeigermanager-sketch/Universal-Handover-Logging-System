/**
 * Hardened Universal Handover System - Dynamic Localization Engine Orchestrator
 */

const CONFIG = {
    KEYS: { LOGS: 'handover_logs', HISTORY: 'handover_history', ARCHIVE: 'handover_logs_archive' },
    MAX_LOGS: 50,
    TARGET_ORIGIN: window.location.origin
};

let currentLang = 'eng'; // Base Initialization Target Fallback

document.addEventListener('DOMContentLoaded', () => {
    initializeLanguageRouting();
    initializeForm();
    setupEventListeners();
});

/**
 * Parses user preferences and routes layout targets to specific localization folders
 */
function initializeLanguageRouting() {
    const selector = document.getElementById('langSelector');
    
    // Fallback detection: checks browser defaults before applying hardcoded targets
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('zh-tw') || browserLang.startsWith('zh-hk')) currentLang = 'zh-tr';
    else if (browserLang.startsWith('zh')) currentLang = 'zh-cn';
    else if (browserLang.startsWith('ru')) currentLang = 'ru';
    else if (browserLang.startsWith('es')) currentLang = 'es';
    
    selector.value = currentLang;
    applyLocalizationMatrix(currentLang);

    selector.addEventListener('change', (e) => {
        currentLang = e.target.value;
        applyLocalizationMatrix(currentLang);
        addLog('System', `Locale shifted to: ${currentLang.toUpperCase()}`, 'info');
    });
}

/**
 * Traverses layout DOM structure to patch string objects from the configuration dictionary
 */
function applyLocalizationMatrix(lang) {
    const dictionary = LocaleDictionary[lang] || LocaleDictionary['eng'];
    
    // 1. Process standard translation strings via elements featuring data-lang selectors
    document.querySelectorAll('[data-lang]').forEach(element => {
        const path = element.getAttribute('data-lang');
        const text = getNestedProperty(dictionary, path);
        if (text) element.textContent = text;
    });

    // 2. Clear and apply input field placeholder text mappings
    for (const key in dictionary.placeholders) {
        const inputEl = document.getElementById(key) || document.getElementById(key + 'Status');
        if (inputEl) inputEl.placeholder = dictionary.placeholders[key];
    }

    // 3. Translate select option boxes
    document.getElementById('opt_morning').textContent = dictionary.shifts.morning;
    document.getElementById('opt_swing').textContent = dictionary.shifts.swing;
    document.getElementById('opt_graveyard').textContent = dictionary.shifts.graveyard;

    // 4. Update the iframe viewport targeting the specific language sub-directory
    const iframe = document.getElementById('logFrame');
    if (iframe) {
        iframe.src = `${lang}/log_viewer.html`;
    }
}

function getNestedProperty(obj, path) {
    return path.split('.').reduce((prev, curr) => prev ? prev[curr] : null, obj);
}

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
    const dictionary = LocaleDictionary[currentLang];
    const formData = new FormData(e.target);
    const rawData = Object.fromEntries(formData.entries());
    
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
        addLog(`Submission / 提交 / Передача`, `Record Sync Completed for ID: ${sanitizedData.id.substring(0,8)}`, 'success');
        alert(dictionary.alerts.successArchive);
    }
}

function sanitizeString(str) {
    if (!str) return '';
    return str.replace(/</g, '&lt;').replace(/>/g, '&gt;').trim();
}

function addLog(title, message, level = 'info') {
    const logEntry = { id: generateUUID(), timestamp: Date.now(), title: title, message: message, level: level };

    try {
        let logs = JSON.parse(localStorage.getItem(CONFIG.KEYS.LOGS) || '[]');
        logs.push(logEntry);
        if (logs.length > CONFIG.MAX_LOGS) {
            const oldestLog = logs.shift();
            let archive = JSON.parse(localStorage.getItem(CONFIG.KEYS.ARCHIVE) || '[]');
            archive.push(oldestLog);
            localStorage.setItem(CONFIG.KEYS.ARCHIVE, JSON.stringify(archive));
        }
        localStorage.setItem(CONFIG.KEYS.LOGS, JSON.stringify(logs));
    } catch (e) { console.error(e); }

    const iframe = document.getElementById('logFrame');
    if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage({ type: 'NEW_LOG', payload: logEntry }, CONFIG.TARGET_ORIGIN);
    }
}

function saveToHistory(record) {
    try {
        const history = JSON.parse(localStorage.getItem(CONFIG.KEYS.HISTORY) || '[]');
        history.push(record);
        localStorage.setItem(CONFIG.KEYS.HISTORY, JSON.stringify(history));
        return true;
    } catch (error) {
        alert(LocaleDictionary[currentLang].alerts.errorQuota);
        return false;
    }
}

function resetForm() {
    if (confirm(LocaleDictionary[currentLang].alerts.confirmReset)) {
        document.getElementById('handoverForm').reset();
        initializeForm();
    }
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

// Global hook shortcuts for the dynamic template loaders
function loadTemplate() {
    const todayStr = new Date().toISOString().split('T')[0];
    const template = {
        date: todayStr, time: '08:00', shift: 'Morning',
        outgoingName: 'Operator_01', incomingName: 'Operator_02', status: 'Normal',
        accomplishments: 'System check verified.', actionItems: 'Monitor latency.',
        incidents: 'None.', equipmentStatus: 'Nominal.', inventoryNotes: 'Stable.'
    };
    
    const form = document.getElementById('handoverForm');
    for (const key in template) {
        if (form.elements[key]) form.elements[key].value = template[key];
    }
    addLog('System', 'Template parameters deployed.', 'info');
}

function exportData(format) {
    const form = document.getElementById('handoverForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const timestamp = Date.now();
    let content, mimeType, filename;

    if (format === 'json') {
        content = JSON.stringify(data, null, 2);
        mimeType = 'application/json';
        filename = `Handover_${timestamp}.json`;
    } else {
        const headers = Object.keys(data);
        const values = Object.values(data).map(v => `"${String(v).replace(/"/g, '""')}"`);
        content = '\uFEFF' + [headers.join(','), values.join(',')].join('\n');
        mimeType = 'text/csv;charset=utf-8';
        filename = `Handover_${timestamp}.csv`;
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
