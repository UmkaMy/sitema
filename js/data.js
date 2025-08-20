// ================================================
// ЦЕНТРАЛЬНАЯ СИСТЕМА УПРАВЛЕНИЯ ДАННЫМИ МАНГИ
// ================================================

// Версия данных (увеличивайте при изменениях)
const DATA_VERSION = 1;

// ================================================
// ОСНОВНАЯ БАЗА ДАННЫХ ТАЙТЛОВ
// ================================================

window.MangaData = {
    version: DATA_VERSION,
    lastUpdated: new Date().toISOString(),
    
    // Основной каталог тайтлов
    manga: [
        {
            id: 1,
            title: 'Поднятие уровня в одиночку',
            description: 'В мире, где появились врата, соединяющие наш мир с опасными подземельями, обычные люди получили способности охотников. Сунг Джин У - самый слабый охотник ранга E, но после таинственного инцидента в подземелье он получает уникальную способность повышать уровень.',
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop',
            type: 'Манхва',
            year: 2018,
            status: 'Закончен',
            rating: 9.7,
            totalEpisodes: 200,
            availableEpisodes: 200,
            
            // Жанры и категории для фильтрации
            genres: ['Экшен', 'Фэнтези', 'Сверхъестественное'],
            categories: ['ГГ имба', 'Система', 'Навыки', 'Монстры', 'Подземелья'],
            
            // Ссылки на серии (можете заменить на свои)
            episodes: {
                1: 'https://www.youtube.com/embed/UHwz6F5ymYU',
                2: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                3: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                // ... добавьте остальные серии
            },
            
            // Система донатов
            donationGoal: 10000,
            currentDonations: 8500,
            
            // Метаданные
            addedAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-20T15:30:00Z',
            addedBy: 'admin'
        },
        
        {
            id: 2,
            title: 'Начало после конца',
            description: 'Король Грей обладает непревзойденной силой, богатством и престижем в мире, управляемом способностями к боевым искусствам. Однако одиночество неизбежно следует за теми, кто обладает большой силой. Под внешней оболочкой могущественного короля находится душа человека, лишенного цели и воли.',
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop',
            type: 'Западный комикс',
            year: 2018,
            status: 'Продолжается',
            rating: 9.4,
            totalEpisodes: 180,
            availableEpisodes: 165,
            
            genres: ['Фэнтези', 'Драма', 'Экшен'],
            categories: ['Реинкарнация', 'Магия', 'Академия', 'ГГ имба'],
            
            episodes: {
                1: 'https://www.youtube.com/embed/UHwz6F5ymYU',
                2: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                // ... добавьте остальные серии
            },
            
            donationGoal: 15000,
            currentDonations: 3200,
            
            addedAt: '2024-01-10T08:00:00Z',
            updatedAt: '2024-01-21T12:00:00Z',
            addedBy: 'admin'
        },
        
        {
            id: 3,
            title: 'Всеведущий читатель',
            description: 'Ким Докджа - обычный офисный работник, который единственный дочитал веб-новел "Три способа выжить в разрушенном мире" до конца. Когда события из новеллы начинают происходить в реальности, только он знает, что будет дальше.',
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop',
            type: 'Манхва',
            year: 2020,
            status: 'Продолжается',
            rating: 9.5,
            totalEpisodes: 150,
            availableEpisodes: 120,
            
            genres: ['Фэнтези', 'Экшен', 'Психология', 'Драма'],
            categories: ['Исекай', 'Система', 'Умный ГГ', 'Апокалипсис'],
            
            episodes: {
                1: 'https://www.youtube.com/embed/UHwz6F5ymYU',
                2: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                // ... добавьте остальные серии
            },
            
            donationGoal: 12000,
            currentDonations: 5600,
            
            addedAt: '2024-01-12T14:00:00Z',
            updatedAt: '2024-01-22T09:15:00Z',
            addedBy: 'admin'
        }
    ],
    
    // ================================================
    // СПРАВОЧНИКИ ДЛЯ ФИЛЬТРОВ
    // ================================================
    
    genres: [
        'Боевые искусства', 'Гарем', 'Гендерная интрига', 'Героическое фэнтези', 'Детектив',
        'Дзёсэй', 'Додзинси', 'Драма', 'История', 'Киберпанк', 'Кодомо', 'Комедия',
        'Махо-сёдзё', 'Меха', 'Мистика', 'Мурим', 'Научная фантастика', 'Повседневность',
        'Постапокалиптика', 'Приключения', 'Психология', 'Романтика', 'Сверхъестественное',
        'Сёдзё', 'Сёдзё-ай', 'Сёнэн', 'Сёнэн-ай', 'Спорт', 'Сэйнэн', 'Трагедия',
        'Триллер', 'Ужасы', 'Фантастика', 'Фэнтези', 'Школьная жизнь', 'Экшен',
        'Элементы юмора', 'Этти', 'Юри', 'Яой', 'Военное'
    ],
    
    categories: [
        'Алхимия', 'Амнезия', 'Ангелы', 'Аниме', 'Антигерой', 'Антиутопия', 'Апокалипсис',
        'Аристократия', 'Армия', 'Артефакты', 'Боги', 'Бои на мечах', 'Борьба за власть',
        'Будущее', 'В цвете', 'Веб', 'Вестерн', 'Видеоигры', 'Владыка демонов',
        'Волшебные существа', 'Воспоминания из другого мира', 'Выживание', 'ГГ женщина',
        'ГГ имба', 'ГГ мужчина', 'ГГ не человек', 'Геймеры', 'Гильдии', 'Горничные',
        'Грузовик-сан', 'Гяру', 'Демоны', 'Дружба', 'Ёнкома', 'Жестокий мир',
        'Животные компаньоны', 'Зверолюди', 'Зомби', 'Игровые элементы', 'Исекай',
        'Космос', 'Криминал', 'Кулинария', 'Культивация', 'Лоли', 'Магическая академия',
        'Магия', 'Медицина', 'Месть', 'Монстры', 'Музыка', 'Навыки', 'Наёмники',
        'Насилие / жестокость', 'Научпоп', 'Нежить', 'Ниндзя', 'Обратный Гарем',
        'Офисные работники', 'Пародия', 'Подземелья', 'Политика', 'Полиция',
        'Путешествия во времени', 'Разумные расы', 'Ранги силы', 'Реинкарнация',
        'Роботы', 'Рыцари', 'Самураи', 'Сборник', 'Сингл', 'Система', 'Скрытие личности',
        'Спасение мира', 'Средневековье', 'Стимпанк', 'Супер герои', 'Традиционные игры',
        'Тупой ГГ', 'Умный ГГ', 'Упоротость', 'Управление территорией', 'Учебное заведение',
        'Учитель / ученик', 'Хикикомори', 'Шантаж', 'Школа', 'Любовь', 'Академия'
    ],
    
    statuses: [
        'Анонс', 'Закончен', 'Заморожен', 'Лицензировано', 'Продолжается'
    ],
    
    types: [
        'Манга', 'Манхва', 'Маньхуа', 'Западный комикс', 'Веб-комикс', 'Додзинси'
    ]
};

// ================================================
// API ФУНКЦИИ ДЛЯ РАБОТЫ С ДАННЫМИ
// ================================================

window.MangaAPI = {
    
    // Получить все тайтлы
    getAllManga() {
        return window.MangaData.manga;
    },
    
    // Получить тайтл по ID
    getMangaById(id) {
        return window.MangaData.manga.find(manga => manga.id === parseInt(id));
    },
    
    // Поиск тайтлов
    searchManga(query) {
        const searchTerm = query.toLowerCase();
        return window.MangaData.manga.filter(manga => 
            manga.title.toLowerCase().includes(searchTerm) ||
            manga.description.toLowerCase().includes(searchTerm)
        );
    },
    
    // Фильтрация тайтлов
    filterManga(filters) {
        let filtered = [...window.MangaData.manga];
        
        // Поиск по названию
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filtered = filtered.filter(manga => 
                manga.title.toLowerCase().includes(searchTerm)
            );
        }
        
        // Фильтр по жанрам
        if (filters.genres && filters.genres.length > 0) {
            filtered = filtered.filter(manga => 
                filters.genres.some(genre => manga.genres.includes(genre))
            );
        }
        
        // Фильтр по категориям
        if (filters.categories && filters.categories.length > 0) {
            filtered = filtered.filter(manga => 
                filters.categories.some(category => manga.categories.includes(category))
            );
        }
        
        // Фильтр по статусу
        if (filters.statuses && filters.statuses.length > 0) {
            filtered = filtered.filter(manga => 
                filters.statuses.includes(manga.status)
            );
        }
        
        // Фильтр по количеству глав
        if (filters.chaptersFrom || filters.chaptersTo) {
            const from = filters.chaptersFrom ? parseInt(filters.chaptersFrom) : 0;
            const to = filters.chaptersTo ? parseInt(filters.chaptersTo) : Infinity;
            filtered = filtered.filter(manga => 
                manga.totalEpisodes >= from && manga.totalEpisodes <= to
            );
        }
        
        // Сортировка
        if (filters.sortBy) {
            filtered.sort((a, b) => {
                switch (filters.sortBy) {
                    case 'rating':
                        return b.rating - a.rating;
                    case 'alphabet':
                        return a.title.localeCompare(b.title);
                    case 'updated':
                        return new Date(b.updatedAt) - new Date(a.updatedAt);
                    case 'popularity':
                    default:
                        return b.rating - a.rating; // Используем рейтинг как показатель популярности
                }
            });
        }
        
        return filtered;
    },
    
    // Добавить новый тайтл (для админки)
    addManga(mangaData) {
        // Генерируем новый ID
        const newId = Math.max(...window.MangaData.manga.map(m => m.id), 0) + 1;
        
        const newManga = {
            id: newId,
            ...mangaData,
            addedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            addedBy: 'admin',
            currentDonations: 0
        };
        
        window.MangaData.manga.push(newManga);
        this.saveData();
        
        return newManga;
    },
    
    // Обновить тайтл
    updateManga(id, updates) {
        const index = window.MangaData.manga.findIndex(manga => manga.id === parseInt(id));
        if (index !== -1) {
            window.MangaData.manga[index] = {
                ...window.MangaData.manga[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            this.saveData();
            return window.MangaData.manga[index];
        }
        return null;
    },
    
    // Удалить тайтл
    deleteManga(id) {
        const index = window.MangaData.manga.findIndex(manga => manga.id === parseInt(id));
        if (index !== -1) {
            const deleted = window.MangaData.manga.splice(index, 1)[0];
            this.saveData();
            return deleted;
        }
        return null;
    },
    
    // Получить справочники
    getGenres() {
        return window.MangaData.genres;
    },
    
    getCategories() {
        return window.MangaData.categories;
    },
    
    getStatuses() {
        return window.MangaData.statuses;
    },
    
    getTypes() {
        return window.MangaData.types;
    },
    
    // Сохранить данные в localStorage
    saveData() {
        try {
            localStorage.setItem('mangaDatabase', JSON.stringify(window.MangaData));
            window.dispatchEvent(new CustomEvent('mangaDataUpdate', { 
                detail: { 
                    action: 'save',
                    timestamp: new Date().toISOString()
                } 
            }));
        } catch (error) {
            console.error('Ошибка сохранения данных:', error);
        }
    },
    
    // Загрузить данные из localStorage
    loadData() {
        try {
            const saved = localStorage.getItem('mangaDatabase');
            if (saved) {
                const data = JSON.parse(saved);
                // Проверяем версию данных
                if (data.version === DATA_VERSION) {
                    window.MangaData = data;
                    return true;
                }
            }
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        }
        return false;
    },
    
    // Очистить все данные
    clearData() {
        localStorage.removeItem('mangaDatabase');
        window.MangaData.manga = [];
        window.dispatchEvent(new CustomEvent('mangaDataUpdate', { 
            detail: { 
                action: 'clear',
                timestamp: new Date().toISOString()
            } 
        }));
    },
    
    // Экспорт данных
    exportData() {
        return JSON.stringify(window.MangaData, null, 2);
    },
    
    // Импорт данных
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            if (data.manga && Array.isArray(data.manga)) {
                window.MangaData = {
                    ...window.MangaData,
                    ...data,
                    lastUpdated: new Date().toISOString()
                };
                this.saveData();
                return true;
            }
        } catch (error) {
            console.error('Ошибка импорта данных:', error);
        }
        return false;
    }
};

// ================================================
// ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    // Пытаемся загрузить сохраненные данные
    const loaded = window.MangaAPI.loadData();
    
    if (!loaded) {
        // Если данных нет, используем дефолтные и сохраняем их
        console.log('Используются дефолтные данные манги');
        window.MangaAPI.saveData();
    } else {
        console.log('Загружены сохраненные данные манги');
    }
    
    // Уведомляем другие компоненты о готовности данных
    window.dispatchEvent(new CustomEvent('mangaDataReady', {
        detail: {
            totalManga: window.MangaData.manga.length,
            version: window.MangaData.version
        }
    }));
});

// ================================================
// УТИЛИТЫ ДЛЯ РАЗРАБОТКИ (только для отладки)
// ================================================

window.MangaDebug = {
    // Показать все данные
    showAll() {
        console.table(window.MangaData.manga);
    },
    
    // Добавить тестовый тайтл
    addTestManga() {
        return window.MangaAPI.addManga({
            title: 'Тестовый тайтл ' + Date.now(),
            description: 'Описание тестового тайтла',
            image: 'https://via.placeholder.com/300x400/FF6B35/FFFFFF?text=Тест',
            type: 'Манга',
            year: 2024,
            status: 'Продолжается',
            rating: 8.5,
            totalEpisodes: 50,
            availableEpisodes: 10,
            genres: ['Экшен', 'Комедия'],
            categories: ['ГГ имба', 'Школа'],
            episodes: {
                1: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
            },
            donationGoal: 5000
        });
    },
    
    // Очистить все данные
    clearAll() {
        if (confirm('Удалить ВСЕ данные? Это действие нельзя отменить!')) {
            window.MangaAPI.clearData();
            location.reload();
        }
    }
};

console.log('🚀 Система управления данными манги загружена!');
console.log('📊 Доступно тайтлов:', window.MangaData.manga.length);
console.log('🔧 Для отладки используйте: window.MangaDebug');
