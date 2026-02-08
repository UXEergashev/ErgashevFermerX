// Translations for FermerX - Uzbek, Russian, English

export const translations = {
    uz: {
        // Common
        common: {
            appName: 'FermerX',
            logout: 'Chiqish',
            save: 'Saqlash',
            cancel: 'Bekor qilish',
            delete: 'O\'chirish',
            edit: 'Tahrirlash',
            add: 'Qo\'shish',
            close: 'Yopish',
            loading: 'Yuklanmoqda...',
            noData: 'Ma\'lumot yo\'q',
            confirm: 'Tasdiqlash',
            yes: 'Ha',
            no: 'Yo\'q',
            search: 'Qidirish',
            filter: 'Filtrlash',
            all: 'Barchasi',
            total: 'Jami',
            date: 'Sana',
            amount: 'Miqdor',
            price: 'Narx',
            sum: 'so\'m',
            kg: 'kg',
            ha: 'ga',
            piece: 'dona',
            type: 'tur',
            units: {
                kg: 'kg',
                ton: 'tonna',
                piece: 'dona',
                bag: 'qop',
                liter: 'litr'
            },
            period: 'Davr',
            totalProfit: 'Jami foyda',
            totalIncome: 'Jami daromad',
            totalExpenses: 'Jami xarajat',
            profitableCrops: 'Foydali ekinlar',
            profitableLands: 'Foydali yerlar',
            losingLands: 'Zarar keltirayotgan yerlar',
            expectedYield: 'Taxminiy hosil',
            notes: 'Qo\'shimcha ma\'lumot',
            error: 'Xatolik'
        },

        // Navigation
        nav: {
            home: 'Asosiy',
            crops: 'Ekinlar',
            land: 'Yer',
            finance: 'Moliya',
            warehouse: 'Ombor',
            analytics: 'Tahlil',
            reports: 'Hisobotlar'
        },

        // Auth
        auth: {
            login: 'Kirish',
            loginTitle: 'Tizimga kirish',
            register: 'Ro\'yxatdan o\'tish',
            phone: 'Telefon raqam',
            password: 'Parol',
            confirmPassword: 'Parolni tasdiqlash',
            name: 'Ism',
            phonePlaceholder: '+998901234567',
            passwordPlaceholder: 'Parolni kiriting',
            namePlaceholder: 'Ismingizni kiriting',
            noAccount: 'Hisobingiz yo\'qmi?',
            hasAccount: 'Hisobingiz bormi?',
            fillAllFields: 'Barcha maydonlarni to\'ldiring',
            passwordMismatch: 'Parollar mos kelmadi',
            phoneExists: 'Bu telefon raqam ro\'yxatdan o\'tgan',
            userNotFound: 'Foydalanuvchi topilmadi',
            wrongPassword: 'Parol noto\'g\'ri',
            waiting: 'Kutilmoqda...'
        },

        // Dashboard
        dashboard: {
            title: 'Asosiy sahifa',
            greeting: 'Assalomu alaykum',
            totalLand: 'Jami yer maydoni',
            plantedArea: 'Ekilgan maydon',
            emptyLand: 'Bo\'sh yer',
            activeCrops: 'Faol ekinlar',
            warehouseItems: 'Ombor mahsulotlari',
            totalExpenses: 'Umumiy xarajatlar',
            totalIncome: 'Umumiy daromad',
            balance: 'Balans'
        },

        // Crops
        crops: {
            title: 'Ekinlar boshqaruvi',
            addCrop: 'Ekin qo\'shish',
            editCrop: 'Ekinni tahrirlash',
            cropName: 'Ekin nomi',
            plantDate: 'Ekish sanasi',
            harvestDate: 'Yig\'im-terim sanasi',
            area: 'Maydon (ga)',
            status: 'Holat',
            selectLand: 'Yer tanlang',
            expenses: 'Xarajatlar',
            addExpense: 'Xarajat qo\'shish',
            expenseType: 'Xarajat turi',
            expenseAmount: 'Xarajat summasi',
            expenseDate: 'Xarajat sanasi',
            expenseNote: 'Izoh',
            statuses: {
                planned: 'Rejalashtirilgan',
                planted: 'Ekilgan',
                growing: 'O\'sish jarayonida',
                harvesting: 'Yig\'im-terim',
                completed: 'Yakunlangan'
            },
            expenseTypes: {
                seeds: 'Urug\'lik',
                fertilizer: 'O\'g\'it',
                pesticide: 'Pestitsid',
                labor: 'Ishchi kuchi',
                fuel: 'Yoqilg\'i',
                equipment: 'Jihozlar',
                water: 'Suv',
                other: 'Boshqa'
            }
        },

        // Land
        land: {
            title: 'Yer boshqaruvi',
            addLand: 'Yer qo\'shish',
            editLand: 'Yerni tahrirlash',
            landName: 'Yer nomi',
            landArea: 'Yer maydoni (ga)',
            landType: 'Yer turi',
            location: 'Joylashuv',
            notes: 'Izohlar',
            planted: 'Ekilgan',
            empty: 'Bo\'sh',
            landTypes: {
                owned: 'Shaxsiy',
                rented: 'Ijaraga olingan',
                shared: 'Sheriklik'
            }
        },

        // Finance
        finance: {
            title: 'Xarajatlar va daromadlar',
            addTransaction: 'Tranzaksiya qo\'shish',
            expenses: 'Xarajatlar',
            income: 'Daromadlar',
            transactionType: 'Tur',
            category: 'Kategoriya',
            description: 'Tavsif',
            expense: 'Xarajat',
            incomeType: 'Daromad',
            autoCreated: 'Avtomatik yaratilgan',
            sourcePlaceholder: 'Masalan: Bug\'doy sotuvi',
            categories: {
                seeds: 'Urug\'lik',
                fertilizer: 'O\'g\'it',
                pesticide: 'Pestitsid',
                labor: 'Ishchi kuchi',
                fuel: 'Yoqilg\'i',
                equipment: 'Jihozlar',
                transport: 'Transport',
                water: 'Suv',
                sale: 'Sotuv',
                other: 'Boshqa'
            }
        },

        // Warehouse
        warehouse: {
            title: 'Ombor boshqaruvi',
            addItem: 'Mahsulot qo\'shish',
            editItem: 'Mahsulotni tahrirlash',
            itemName: 'Mahsulot nomi',
            quantity: 'Miqdori',
            unit: 'O\'lchov birligi',
            minStock: 'Minimal zaxira',
            currentStock: 'Joriy zaxira',
            lowStock: 'Kam qolgan',
            inStock: 'Mavjud',
            addStock: 'Zaxirani to\'ldirish',
            removeStock: 'Zaxirani chiqarish',
            sell: 'Sotish',
            salePrice: 'Sotuv narxi',
            saleQuantity: 'Sotish miqdori',
            saleTotal: 'Jami summa',
            namePlaceholder: 'Masalan: Bug\'doy',
            categories: {
                harvest: 'Hosil',
                fertilizer: 'O\'g\'it',
                seeds: 'Urug\'',
                other: 'Boshqa'
            }
        },



        // Analytics
        analytics: {
            title: 'Tahlillar',
            profit: 'Foyda',
            loss: 'Zarar',
            noDataYet: 'Hali ma\'lumot yo\'q',
            overview: 'Umumiy',
            trends: 'Mavsumlar',
            dynamic12Month: '12 oylik dinamika',
            detailedData: 'Batafsil ma\'lumotlar',
            profitPerHa: '1 ga/foyda',
            cropsAnalysis: 'Ekinlar tahlili',
            landsAnalysis: 'Yerlar tahlili',
            seasonalDynamics: 'Mavsumiy dinamika',
            last12MonthsDynamics: 'Oxirgi 12 oy dinamikasi',
            profitAnalysisByCrops: 'Ekinlar bo\'yicha foyda tahlili',
            monthlyData: 'Oylik ma\'lumotlar',
            analysisHint: 'Xarajat va daromadlar qo\'shilgandan so\'ng tahlil ko\'rinadi',
            noDataAvailable: 'Ma\'lumotlar mavjud emas',
            month: 'Oy'
        },

        // Reports
        reports: {
            title: 'Hisobotlar',
            generate: 'Hisobot yaratish',
            download: 'Yuklab olish',
            dateRange: 'Sana oralig\'i',
            from: 'Dan',
            to: 'Gacha',
            reportType: 'Hisobot turi',
            financialReport: 'Moliyaviy hisobot',
            cropReport: 'Ekinlar hisoboti',
            landReport: 'Yerlar hisoboti',
            exportExcel: 'Excel ga eksport',
            exportPDF: 'PDF ga eksport',
            monthlyReport: '1 oylik hisobot',
            yearlyReport: '1 yillik hisobot',
            preparing: 'Hisobot tayyorlanmoqda...',
            generalInfo: 'Umumiy ma\'lumot',
            warehouseSales: 'Ombor sotuvlari',
            topCrops: 'Eng ko\'p hosilli ekinlar',
            recentExpenses: 'So\'nggi xarajatlar',
            recentIncome: 'So\'nggi daromadlar',
            downloadFullReport: 'To\'liq hisobotni yuklab olish',
            fullReportDesc: 'Barcha ma\'lumotlar bilan to\'liq hisobot',
            reportSections: '6 ta bo\'lim: Umumiy, Ekinlar, Xarajatlar, Daromadlar, Ombor, Yer maydoni',
            googleSheetsHint: 'Google Sheets uchun CSV faylni yuklab oling va Google Drive-ga upload qiling',
            reportPeriod: 'Hisobot davri',
            created: 'Yaratilgan',
            startHint: 'Hisobot yaratish uchun yuqoridagi tugmalardan birini bosing',
            startDesc: '1 oylik yoki 1 yillik hisobotni tanlang va barcha ma\'lumotlarni Excel faylida yuklab oling'
        },
        settings: {
            title: 'Sozlamalar',
            appearance: 'Ko\'rinish',
            darkMode: 'Tungi rejim',
            lightMode: 'Kungi rejim',
            languageSelection: 'Tilni tanlash',
            notifications: 'Bildirishnomalar',
            privacy: 'Maxfiylik',
            profile: 'Profil'
        }
    },

    ru: {
        // Common
        common: {
            appName: 'FermerX',
            logout: 'Выйти',
            save: 'Сохранить',
            cancel: 'Отмена',
            delete: 'Удалить',
            edit: 'Редактировать',
            add: 'Добавить',
            close: 'Закрыть',
            loading: 'Загрузка...',
            noData: 'Нет данных',
            confirm: 'Подтвердить',
            yes: 'Да',
            no: 'Нет',
            search: 'Поиск',
            filter: 'Фильтр',
            all: 'Все',
            total: 'Итого',
            date: 'Дата',
            amount: 'Количество',
            price: 'Цена',
            sum: 'сум',
            kg: 'кг',
            ha: 'га',
            piece: 'шт',
            type: 'тип',
            units: {
                kg: 'кг',
                ton: 'тонна',
                piece: 'шт',
                bag: 'мешок',
                liter: 'литр'
            },
            period: 'Период',
            totalProfit: 'Общая прибыль',
            totalIncome: 'Общий доход',
            totalExpenses: 'Общие расходы',
            profitableCrops: 'Прибыльные культуры',
            profitableLands: 'Прибыльные земли',
            losingLands: 'Убыточные земли',
            expectedYield: 'Ожидаемый урожай',
            notes: 'Дополнительная информация',
            error: 'Ошибка'
        },

        // Navigation
        nav: {
            home: 'Главная',
            crops: 'Культуры',
            land: 'Земля',
            finance: 'Финансы',
            warehouse: 'Склад',
            analytics: 'Аналитика',
            reports: 'Отчёты'
        },

        // Auth
        auth: {
            login: 'Войти',
            loginTitle: 'Вход в систему',
            register: 'Регистрация',
            phone: 'Номер телефона',
            password: 'Пароль',
            confirmPassword: 'Подтвердите пароль',
            name: 'Имя',
            phonePlaceholder: '+998901234567',
            passwordPlaceholder: 'Введите пароль',
            namePlaceholder: 'Введите ваше имя',
            noAccount: 'Нет аккаунта?',
            hasAccount: 'Уже есть аккаунт?',
            fillAllFields: 'Заполните все поля',
            passwordMismatch: 'Пароли не совпадают',
            phoneExists: 'Этот номер уже зарегистрирован',
            userNotFound: 'Пользователь не найден',
            wrongPassword: 'Неверный пароль',
            waiting: 'Подождите...'
        },

        // Dashboard
        dashboard: {
            title: 'Главная',
            greeting: 'Добро пожаловать',
            totalLand: 'Общая площадь',
            plantedArea: 'Засеянная площадь',
            emptyLand: 'Свободная земля',
            activeCrops: 'Активные культуры',
            warehouseItems: 'Товары на складе',
            totalExpenses: 'Общие расходы',
            totalIncome: 'Общий доход',
            balance: 'Баланс'
        },

        // Crops
        crops: {
            title: 'Управление культурами',
            addCrop: 'Добавить культуру',
            editCrop: 'Редактировать культуру',
            cropName: 'Название культуры',
            plantDate: 'Дата посева',
            harvestDate: 'Дата сбора урожая',
            area: 'Площадь (га)',
            status: 'Статус',
            selectLand: 'Выберите землю',
            expenses: 'Расходы',
            addExpense: 'Добавить расход',
            expenseType: 'Тип расхода',
            expenseAmount: 'Сумма расхода',
            expenseDate: 'Дата расхода',
            expenseNote: 'Примечание',
            statuses: {
                planned: 'Запланировано',
                planted: 'Посажено',
                growing: 'Растёт',
                harvesting: 'Сбор урожая',
                completed: 'Завершено'
            },
            expenseTypes: {
                seeds: 'Семена',
                fertilizer: 'Удобрения',
                pesticide: 'Пестициды',
                labor: 'Рабочая сила',
                fuel: 'Топливо',
                equipment: 'Оборудование',
                water: 'Вода',
                other: 'Другое'
            }
        },

        // Land
        land: {
            title: 'Управление землёй',
            addLand: 'Добавить землю',
            editLand: 'Редактировать землю',
            landName: 'Название участка',
            landArea: 'Площадь (га)',
            landType: 'Тип земли',
            location: 'Местоположение',
            notes: 'Заметки',
            planted: 'Засеяно',
            empty: 'Свободно',
            landTypes: {
                owned: 'Собственность',
                rented: 'Аренда',
                shared: 'Совместная'
            }
        },

        // Finance
        finance: {
            title: 'Расходы и доходы',
            addTransaction: 'Добавить транзакцию',
            expenses: 'Расходы',
            income: 'Доходы',
            transactionType: 'Тип',
            category: 'Категория',
            description: 'Описание',
            expense: 'Расход',
            incomeType: 'Доход',
            autoCreated: 'Создано автоматически',
            sourcePlaceholder: 'Например: Продажа пшеницы',
            categories: {
                seeds: 'Семена',
                fertilizer: 'Удобрения',
                pesticide: 'Пестициды',
                labor: 'Рабочая сила',
                fuel: 'Топливо',
                equipment: 'Оборудование',
                transport: 'Транспорт',
                water: 'Вода',
                sale: 'Продажа',
                other: 'Другое'
            }
        },

        // Warehouse
        warehouse: {
            title: 'Управление складом',
            addItem: 'Добавить товар',
            editItem: 'Редактировать товар',
            itemName: 'Название товара',
            quantity: 'Количество',
            unit: 'Единица измерения',
            minStock: 'Минимальный запас',
            currentStock: 'Текущий запас',
            lowStock: 'Мало на складе',
            inStock: 'В наличии',
            addStock: 'Добавить запас',
            removeStock: 'Списать',
            sell: 'Продать',
            salePrice: 'Цена продажи',
            saleQuantity: 'Количество для продажи',
            saleTotal: 'Общая сумма',
            namePlaceholder: 'Например: Пшеница',
            categories: {
                harvest: 'Урожай',
                fertilizer: 'Удобрения',
                seeds: 'Семена',
                other: 'Другое'
            }
        },



        // Analytics
        analytics: {
            title: 'Аналитика',
            profitAnalysis: 'Анализ прибыли',
            cropProfitability: 'Рентабельность культур',
            landProfitability: 'Рентабельность земель',
            seasonalTrends: 'Сезонные тренды',
            mostProfitable: 'Самые прибыльные',
            leastProfitable: 'Наименее прибыльные',
            profit: 'Прибыль',
            loss: 'Убыток',
            noDataYet: 'Пока нет данных',
            last12MonthsDynamics: 'Динамика за последние 12 месяцев',
            profitAnalysisByCrops: 'Анализ прибыли по культурам',
            monthlyData: 'Ежемесячные данные',
            analysisHint: 'Анализ появится после добавления расходов и доходов',
            noDataAvailable: 'Данные недоступны',
            month: 'Месяц'
        },

        // Reports
        reports: {
            title: 'Отчёты',
            generate: 'Создать отчёт',
            download: 'Скачать',
            dateRange: 'Период',
            from: 'От',
            to: 'До',
            reportType: 'Тип отчёта',
            financialReport: 'Финансовый отчёт',
            cropReport: 'Отчёт по культурам',
            landReport: 'Отчёт по земле',
            exportExcel: 'Экспорт в Excel',
            exportPDF: 'Экспорт в PDF',
            monthlyReport: 'Месячный отчёт',
            yearlyReport: 'Годовой отчёт',
            preparing: 'Подготовка отчёта...',
            generalInfo: 'Общая информация',
            warehouseSales: 'Продажи со склада',
            topCrops: 'Самые урожайные культуры',
            recentExpenses: 'Недавние расходы',
            recentIncome: 'Недавние доходы',
            downloadFullReport: 'Скачать полный отчёт',
            fullReportDesc: 'Полный отчёт со всеми данными',
            reportSections: '6 разделов: Общее, Культуры, Расходы, Доходы, Склад, Земля',
            googleSheetsHint: 'Скачайте CSV файл для Google Sheets и загрузите его на Google Drive',
            reportPeriod: 'Период отчёта',
            created: 'Создан',
            startHint: 'Нажмите одну из кнопок выше, чтобы создать отчёт',
            startDesc: 'Выберите месячный или годовой отчёт и скачайте все данные в Excel'
        },
        settings: {
            title: 'Настройки',
            appearance: 'Внешний вид',
            darkMode: 'Темный режим',
            lightMode: 'Светлый режим',
            languageSelection: 'Выбор языка',
            notifications: 'Уведомления',
            privacy: 'Конфиденциальность',
            profile: 'Профиль'
        }
    },

    en: {
        // Common
        common: {
            appName: 'FermerX',
            logout: 'Logout',
            save: 'Save',
            cancel: 'Cancel',
            delete: 'Delete',
            edit: 'Edit',
            add: 'Add',
            close: 'Close',
            loading: 'Loading...',
            noData: 'No data',
            confirm: 'Confirm',
            yes: 'Yes',
            no: 'No',
            search: 'Search',
            filter: 'Filter',
            all: 'All',
            total: 'Total',
            date: 'Date',
            amount: 'Amount',
            price: 'Price',
            sum: 'sum',
            kg: 'kg',
            ha: 'ha',
            piece: 'pcs',
            type: 'type',
            units: {
                kg: 'kg',
                ton: 'ton',
                piece: 'pcs',
                bag: 'bag',
                liter: 'liter'
            },
            period: 'Period',
            totalProfit: 'Total Profit',
            totalIncome: 'Total Income',
            totalExpenses: 'Total Expenses',
            profitableCrops: 'Profitable Crops',
            profitableLands: 'Profitable Lands',
            losingLands: 'Losing Lands',
            expectedYield: 'Expected Yield',
            notes: 'Additional information',
            error: 'Error'
        },

        // Navigation
        nav: {
            home: 'Home',
            crops: 'Crops',
            land: 'Land',
            finance: 'Finance',
            warehouse: 'Warehouse',
            analytics: 'Analytics',
            reports: 'Reports'
        },

        // Auth
        auth: {
            login: 'Login',
            loginTitle: 'Sign In',
            register: 'Register',
            phone: 'Phone Number',
            password: 'Password',
            confirmPassword: 'Confirm Password',
            name: 'Name',
            phonePlaceholder: '+998901234567',
            passwordPlaceholder: 'Enter password',
            namePlaceholder: 'Enter your name',
            noAccount: 'Don\'t have an account?',
            hasAccount: 'Already have an account?',
            fillAllFields: 'Please fill all fields',
            passwordMismatch: 'Passwords do not match',
            phoneExists: 'This phone number is already registered',
            userNotFound: 'User not found',
            wrongPassword: 'Wrong password',
            waiting: 'Please wait...'
        },

        // Dashboard
        dashboard: {
            title: 'Dashboard',
            greeting: 'Welcome',
            totalLand: 'Total Land Area',
            plantedArea: 'Planted Area',
            emptyLand: 'Empty Land',
            activeCrops: 'Active Crops',
            warehouseItems: 'Warehouse Items',
            totalExpenses: 'Total Expenses',
            totalIncome: 'Total Income',
            balance: 'Balance'
        },

        // Crops
        crops: {
            title: 'Crop Management',
            addCrop: 'Add Crop',
            editCrop: 'Edit Crop',
            cropName: 'Crop Name',
            plantDate: 'Planting Date',
            harvestDate: 'Harvest Date',
            area: 'Area (ha)',
            status: 'Status',
            selectLand: 'Select Land',
            expenses: 'Expenses',
            addExpense: 'Add Expense',
            expenseType: 'Expense Type',
            expenseAmount: 'Expense Amount',
            expenseDate: 'Expense Date',
            expenseNote: 'Note',
            statuses: {
                planned: 'Planned',
                planted: 'Planted',
                growing: 'Growing',
                harvesting: 'Harvesting',
                completed: 'Completed'
            },
            expenseTypes: {
                seeds: 'Seeds',
                fertilizer: 'Fertilizer',
                pesticide: 'Pesticide',
                labor: 'Labor',
                fuel: 'Fuel',
                equipment: 'Equipment',
                water: 'Water',
                other: 'Other'
            }
        },

        // Land
        land: {
            title: 'Land Management',
            addLand: 'Add Land',
            editLand: 'Edit Land',
            landName: 'Land Name',
            landArea: 'Area (ha)',
            landType: 'Land Type',
            location: 'Location',
            notes: 'Notes',
            planted: 'Planted',
            empty: 'Empty',
            landTypes: {
                owned: 'Owned',
                rented: 'Rented',
                shared: 'Shared'
            }
        },

        // Finance
        finance: {
            title: 'Expenses & Income',
            addTransaction: 'Add Transaction',
            expenses: 'Expenses',
            income: 'Income',
            transactionType: 'Type',
            category: 'Category',
            description: 'Description',
            expense: 'Expense',
            incomeType: 'Income',
            autoCreated: 'Auto-created',
            sourcePlaceholder: 'e.g.: Wheat sale',
            categories: {
                seeds: 'Seeds',
                fertilizer: 'Fertilizer',
                pesticide: 'Pesticide',
                labor: 'Labor',
                fuel: 'Fuel',
                equipment: 'Equipment',
                transport: 'Transport',
                water: 'Water',
                sale: 'Sale',
                other: 'Other'
            }
        },

        // Warehouse
        warehouse: {
            title: 'Warehouse Management',
            addItem: 'Add Item',
            editItem: 'Edit Item',
            itemName: 'Item Name',
            quantity: 'Quantity',
            unit: 'Unit',
            minStock: 'Minimum Stock',
            currentStock: 'Current Stock',
            lowStock: 'Low Stock',
            inStock: 'In Stock',
            addStock: 'Add Stock',
            removeStock: 'Remove Stock',
            sell: 'Sell',
            salePrice: 'Sale Price',
            saleQuantity: 'Sale Quantity',
            saleTotal: 'Total Amount',
            namePlaceholder: 'e.g.: Wheat',
            categories: {
                harvest: 'Harvest',
                fertilizer: 'Fertilizer',
                seeds: 'Seeds',
                other: 'Other'
            }
        },



        // Analytics
        analytics: {
            title: 'Analytics',
            profitAnalysis: 'Profit Analysis',
            cropProfitability: 'Crop Profitability',
            landProfitability: 'Land Profitability',
            seasonalTrends: 'Seasonal Trends',
            mostProfitable: 'Most Profitable',
            leastProfitable: 'Least Profitable',
            profit: 'Profit',
            loss: 'Loss',
            noDataYet: 'No data yet',
            last12MonthsDynamics: 'Last 12 months dynamics',
            profitAnalysisByCrops: 'Profit analysis by crops',
            monthlyData: 'Monthly data',
            analysisHint: 'Analysis will appear after adding expenses and income',
            noDataAvailable: 'No data available',
            month: 'Month'
        },

        // Reports
        reports: {
            title: 'Reports',
            generate: 'Generate Report',
            download: 'Download',
            dateRange: 'Date Range',
            from: 'From',
            to: 'To',
            reportType: 'Report Type',
            financialReport: 'Financial Report',
            cropReport: 'Crop Report',
            landReport: 'Land Report',
            exportExcel: 'Export to Excel',
            exportPDF: 'Export to PDF',
            monthlyReport: 'Monthly Report',
            yearlyReport: 'Yearly Report',
            preparing: 'Preparing report...',
            generalInfo: 'General Information',
            warehouseSales: 'Warehouse Sales',
            topCrops: 'Highest Yielding Crops',
            recentExpenses: 'Recent Expenses',
            recentIncome: 'Recent Income',
            downloadFullReport: 'Download Full Report',
            fullReportDesc: 'Full report with all data',
            reportSections: '6 sections: Overview, Crops, Expenses, Income, Warehouse, Land',
            googleSheetsHint: 'Download CSV file for Google Sheets and upload to Google Drive',
            reportPeriod: 'Report period',
            created: 'Created',
            startHint: 'Click one of the buttons above to generate a report',
            startDesc: 'Select monthly or yearly report and download all data in Excel'
        },
        settings: {
            title: 'Settings',
            appearance: 'Appearance',
            darkMode: 'Dark Mode',
            lightMode: 'Light Mode',
            languageSelection: 'Language Selection',
            notifications: 'Notifications',
            privacy: 'Privacy',
            profile: 'Profile'
        }
    }
};

export const languages = [
    { code: 'uz', name: "O'zbekcha", flag: '🇺🇿' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
];

export default translations;
