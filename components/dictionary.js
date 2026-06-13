/**
 * Global Localization Dictionary Manifest
 */
const LocaleDictionary = {
    "eng": {
        title: "Shift Handover Manifest",
        subtitle: "Record, archive, and cross-reference operational status updates securely.",
        btnTemplate: "Load Template",
        btnExportJson: "Export JSON",
        btnExportCsv: "Export CSV",
        btnWipe: "Wipe Form Data",
        btnCommit: "Finalize & Commit Handover",
        logHeader: "System Telemetry Log",
        fields: {
            date: "Handover Date",
            time: "Handover Time",
            shift: "Assigned Shift Rotation",
            outgoing: "Outgoing Operator (Relieving Officer)",
            incoming: "Incoming Operator (Relief Officer)",
            rating: "Overall Shift Operational Rating",
            accomplishments: "Key Accomplishments & Completed Operations",
            actionItems: "Open Action Items (Carry Over)",
            incidents: "Unusual Incidents or Anomalies",
            equipment: "Hardware / Equipment Readiness Status",
            inventory: "Logistics & Supply Level Notes"
        },
        placeholders: {
            outgoing: "Enter full name or callsign",
            incoming: "Enter full name or callsign",
            accomplishments: "Detail tasks finalized during this rotation...",
            actionItems: "Tasks requiring follow-up or active monitoring...",
            incidents: "Document any system failures, safety breaches, or discrepancies...",
            equipment: "State of physical machinery, terminal devices, or network clusters...",
            inventory: "Critical inventory levels, supply depletions, or requests filed..."
        },
        shifts: {
            morning: "Morning Shift (08:00 - 16:00)",
            swing: "Swing Shift (16:00 - 24:00)",
            graveyard: "Graveyard Shift (00:00 - 08:00)"
        },
        alerts: {
            confirmReset: "Are you sure you want to discard all unsubmitted document data?",
            successArchive: "🎉 Handover record archived and mirrored to logging window!",
            errorQuota: "Error: Client browser memory allocation limits reached. Archive failed."
        }
    },
    "zh-cn": {
        title: "大班交接管理清单",
        subtitle: "安全地记录、归档并交叉比对系统运行的即时状态与变更。",
        btnTemplate: "载入快捷模板",
        btnExportJson: "导出成 JSON",
        btnExportCsv: "导出成 CSV",
        btnWipe: "清空表单数据",
        btnCommit: "签署并提交交接表单",
        logHeader: "系统流水日志总线",
        fields: {
            date: "交接日期",
            time: "交接时间",
            shift: "当前排班班次",
            outgoing: "交班负责人员 (交班人)",
            incoming: "接班负责人员 (接班人)",
            rating: "本班次运行状态安全评估",
            accomplishments: "主要完成工作与具体进展事项",
            actionItems: "遗留值守任务 (需下一班跟进)",
            incidents: "异常事件、警告或突发故障报告",
            equipment: "硬件资产及核心设备运行备忘",
            inventory: "关键物资仓储及备品备件库存备注"
        },
        placeholders: {
            outgoing: "请输入交班人员姓名或岗位编号",
            incoming: "请输入接班人员姓名或岗位编号",
            accomplishments: "请详细列出当前班次已完成或上线的业务内容...",
            actionItems: "请输入需要交接给下一班持续监控或未决的事项...",
            incidents: "若有故障告警、网路抖动或设备断连，请在此详细记录...",
            equipment: "请输入物理服务器机架、PDA终端或交换机物理状态...",
            inventory: "若物资耗尽或已提交采购，请记录备件耗损状况..."
        },
        shifts: {
            morning: "早班值乘 (08:00 - 16:00)",
            swing: "中班值乘 (16:00 - 24:00)",
            graveyard: "晚班值乘 (00:00 - 08:00)"
        },
        alerts: {
            confirmReset: "确认要清空当前表单内填写的所有数据吗？未提交的内容将会丢失。",
            successArchive: "🎉 交接记录已成功归档并实时同步！",
            errorQuota: "错误：浏览器本地存储空间已满，数据归档操作失败！"
        }
    },
    "zh-tr": {
        title: "大班交接管理清單",
        subtitle: "安全地記錄、存檔並交叉比對系統運行的即時狀態與變更。",
        btnTemplate: "載入快捷模板",
        btnExportJson: "導出成 JSON",
        btnExportCsv: "導出成 CSV",
        btnWipe: "清空表單數據",
        btnCommit: "簽署並提交交接表單",
        logHeader: "系統流水日誌總線",
        fields: {
            date: "交接日期",
            time: "交接時間",
            shift: "當前排班班次",
            outgoing: "交班負責人員 (交班人)",
            incoming: "接班負責人員 (接班人)",
            rating: "本班次運行狀態安全評估",
            accomplishments: "主要完成工作與具體進展事項",
            actionItems: "遺留值守任務 (需下一班跟進)",
            incidents: "異常事件、警告或突發故障報告",
            equipment: "硬體資產及核心設備運行備忘",
            inventory: "關鍵物資倉儲及備品備件庫存備註"
        },
        placeholders: {
            outgoing: "請輸入交班人員姓名或崗位編號",
            incoming: "請輸入接班人員姓名或崗位編號",
            accomplishments: "請詳細列出當前班次已完成或上線的業務內容...",
            actionItems: "請輸入需要交接給下一班持續監控或未決的事項...",
            incidents: "若有故障告警、網路抖動或設備斷連，請在此詳細記錄...",
            equipment: "請輸入物理伺服器機架、PDA終端或交換機物理狀態...",
            inventory: "若物資耗盡或已提交採購，請記錄備件耗損狀況..."
        },
        shifts: {
            morning: "早班值乘 (08:00 - 16:00)",
            swing: "中班值乘 (16:00 - 24:00)",
            graveyard: "晚班值乘 (00:00 - 08:00)"
        },
        alerts: {
            confirmReset: "確認要清空當前表單內填寫的所有數據嗎？未提交的內容將會丟失。",
            successArchive: "🎉 交接記錄已成功存檔並即時同步！",
            errorQuota: "錯誤：瀏覽器本地存儲空間已滿，數據存檔操作失敗！"
        }
    },
    "ru": {
        title: "Журнал Передачи Смены",
        subtitle: "Надежная запись, архивирование и сопоставление данных о состоянии систем.",
        btnTemplate: "Загрузить Шаблон",
        btnExportJson: "Экспорт в JSON",
        btnExportCsv: "Экспорт в CSV",
        btnWipe: "Очистить Форму",
        btnCommit: "Утвердить и Отправить",
        logHeader: "Системная Телеметрия",
        fields: {
            date: "Дата Передачи",
            time: "Время Передачи",
            shift: "Назначенная Смена",
            outgoing: "Сдающий Смену (Оператор)",
            incoming: "Принимающий Смену (Оператор)",
            rating: "Общая Оценка Стабильности",
            accomplishments: "Основные Достижения и Выполненные Задачи",
            actionItems: "Текущие Задачи (Перенос на след. смену)",
            incidents: "Инциденты, Сбои или Аномалии",
            equipment: "Статус Готовности Оборудования",
            inventory: "Заметки по Логистике и Запасам"
        },
        placeholders: {
            outgoing: "Введите полное имя или позывной",
            incoming: "Введите полное имя или позывной",
            accomplishments: "Подробно опишите выполненные за смену задачи...",
            actionItems: "Задачи, требующие контроля следующей смены...",
            incidents: "Задокументируйте системные сбои или нарушения безопасности...",
            equipment: "Состояние серверов, терминалов или сетевых коммутаторов...",
            inventory: "Критические уровни запасов, запросы на закупку..."
        },
        shifts: {
            morning: "Утренняя Смена (08:00 - 16:00)",
            swing: "Дневная Смена (16:00 - 24:00)",
            graveyard: "Ночная Смена (00:00 - 08:00)"
        },
        alerts: {
            confirmReset: "Вы уверены, что хотите очистить форму? Все несохраненные данные будут утеряны.",
            successArchive: "🎉 Запись передачи смены успешно заархивирована и синхронизирована!",
            errorQuota: "Ошибка: Превышен лимит памяти браузера. Архивация не удалась."
        }
    },
    "es": {
        title: "Manifiesto de Entrega de Turno",
        subtitle: "Registre, archive y coteje de forma segura las actualizaciones de estado operacional.",
        btnTemplate: "Cargar Plantilla",
        btnExportJson: "Exportar JSON",
        btnExportCsv: "Exportar CSV",
        btnWipe: "Limpiar Datos",
        btnCommit: "Finalizar y Comprometer Entrega",
        logHeader: "Registro de Telemetría",
        fields: {
            date: "Fecha de Entrega",
            time: "Hora de Entrega",
            shift: "Rotación de Turno Asignada",
            outgoing: "Operador Saliente (Oficial Saliente)",
            incoming: "Operador Entrante (Oficial de Relevo)",
            rating: "Evaluación General del Turno",
            accomplishments: "Principales Logros y Operaciones Completadas",
            actionItems: "Tareas Pendientes (Seguimiento)",
            incidents: "Incidentes Inusuales o Anomalías",
            equipment: "Estado de Preparación del Hardware / Equipos",
            inventory: "Notas de Logística y Niveles de Suministro"
        },
        placeholders: {
            outgoing: "Ingrese el nombre completo o indicativo",
            incoming: "Ingrese el nombre completo o indicativo",
            accomplishments: "Detalle las tareas finalizadas durante esta rotación...",
            actionItems: "Tareas que requieren seguimiento o monitoreo activo...",
            incidents: "Documente fallas del sistema, brechas de seguridad o discrepancias...",
            equipment: "Estado de la maquinaria física, dispositivos terminales o clústeres...",
            inventory: "Niveles críticos de inventario, depletación de suministros..."
        },
        shifts: {
            morning: "Turno Mañana (08:00 - 16:00)",
            swing: "Turno Tarde (16:00 - 24:00)",
            graveyard: "Turno Noche (00:00 - 08:00)"
        },
        alerts: {
            confirmReset: "¿Está seguro de que desea descartar todos los datos del documento no enviados?",
            successArchive: "🎉 ¡Registro de entrega archivado y sincronizado en la ventana de registro!",
            errorQuota: "Error: Se alcanzaron los límites de asignación de memoria del navegador. Archivo fallido."
        }
    }
};
