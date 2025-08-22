// === СИСТЕМА ОБЛАЧНОЙ СИНХРОНИЗАЦИИ ДАННЫХ ===
// Добавить в js/data.js

class CloudSyncManager {
    constructor() {
        this.syncKey = 'lightfox_sync_data';
        this.lastSyncKey = 'lightfox_last_sync';
        this.isOnline = navigator.onLine;
        this.syncInterval = null;
        
        // Настройки для разных провайдеров
        this.providers = {
            github: {
                token: localStorage.getItem('github_token'),
                gistId: localStorage.getItem('sync_gist_id'),
                enabled: false
            },
            firebase: {
                apiKey: localStorage.getItem('firebase_api_key'),
                enabled: false
            }
        };

        this.initializeSync();
    }

    // === ИНИЦИАЛИЗАЦИЯ ===
    initializeSync() {
        console.log('🔄 Инициализация системы синхронизации...');
        
        // Проверяем доступные провайдеры
        this.checkProviders();
        
        // Слушаем изменения сети
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.syncToCloud();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
        });

        // Автосинхронизация каждые 5 минут
        this.startAutoSync();

        // Пытаемся загрузить данные при старте
        this.loadFromCloud();
    }

    checkProviders() {
        // Проверяем GitHub
        if (this.providers.github.token && this.providers.github.gistId) {
            this.providers.github.enabled = true;
            console.log('✅ GitHub Gist синхронизация доступна');
        }

        // Если нет настроенных провайдеров, показываем уведомление
        if (!this.hasEnabledProvider()) {
            this.showSyncSetup();
        }
    }

    hasEnabledProvider() {
        return Object.values(this.providers).some(p => p.enabled);
    }

    // === GITHUB GIST СИНХРОНИЗАЦИЯ ===
    async syncWithGitHub() {
        if (!this.providers.github.enabled) return false;

        try {
            const data = this.gatherAllData();
            const gistData = {
                description: "Light Fox Manga - Синхронизация данных",
                files: {
                    "lightfox_data.json": {
                        content: JSON.stringify(data, null, 2)
                    }
                }
            };

            const response = await fetch(`https://api.github.com/gists/${this.providers.github.gistId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `token ${this.providers.github.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(gistData)
            });

            if (response.ok) {
                localStorage.setItem(this.lastSyncKey, new Date().toISOString());
                console.log('✅ Данные успешно синхронизированы с GitHub');
                this.showNotification('Данные синхронизированы с облаком', 'success');
                return true;
            } else {
                throw new Error(`GitHub API error: ${response.status}`);
            }
        } catch (error) {
            console.error('❌ Ошибка синхронизации с GitHub:', error);
            this.showNotification('Ошибка синхронизации с GitHub', 'error');
            return false;
        }
    }

    async loadFromGitHub() {
        if (!this.providers.github.enabled) return false;

        try {
            const response = await fetch(`https://api.github.com/gists/${this.providers.github.gistId}`, {
                headers: {
                    'Authorization': `token ${this.providers.github.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (response.ok) {
                const gist = await response.json();
                const fileContent = gist.files['lightfox_data.json']?.content;
                
                if (fileContent) {
                    const cloudData = JSON.parse(fileContent);
                    this.mergeCloudData(cloudData);
                    console.log('✅ Данные загружены из GitHub');
                    this.showNotification('Данные загружены из облака', 'success');
                    return true;
                }
            }
        } catch (error) {
            console.error('❌ Ошибка загрузки из GitHub:', error);
        }
        return false;
    }

    // === УПРАВЛЕНИЕ ДАННЫМИ ===
    gatherAllData() {
        return {
            timestamp: new Date().toISOString(),
            version: "1.0",
            data: {
                manga: JSON.parse(localStorage.getItem('lightfox_manga_data') || '[]'),
                donationProjects: JSON.parse(localStorage.getItem('lightfox_donation_projects') || '[]'),
                favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
                watching: JSON.parse(localStorage.getItem('watching') || '[]'),
                wantToWatch: JSON.parse(localStorage.getItem('wantToWatch') || '[]'),
                completed: JSON.parse(localStorage.getItem('completed') || '[]'),
                donationHistory: JSON.parse(localStorage.getItem('donationHistory') || '[]'),
                userSettings: {
                    theme: localStorage.getItem('theme'),
                    language: localStorage.getItem('language'),
                    isLoggedIn: localStorage.getItem('isLoggedIn'),
                    currentUser: localStorage.getItem('currentUser')
                }
            }
        };
    }

    mergeCloudData(cloudData) {
        if (!cloudData || !cloudData.data) return;

        const localLastSync = localStorage.getItem(this.lastSyncKey);
        const cloudTimestamp = cloudData.timestamp;

        // Если облачные данные новее, используем их
        if (!localLastSync || new Date(cloudTimestamp) > new Date(localLastSync)) {
            console.log('🔄 Применяем облачные данные (более новые)');
            
            // Сохраняем все данные
            Object.entries(cloudData.data).forEach(([key, value]) => {
                if (key === 'userSettings') {
                    Object.entries(value).forEach(([settingKey, settingValue]) => {
                        if (settingValue !== null) {
                            localStorage.setItem(settingKey, settingValue);
                        }
                    });
                } else {
                    localStorage.setItem(key === 'manga' ? 'lightfox_manga_data' : key, JSON.stringify(value));
                }
            });

            // Обновляем систему данных
            if (window.MangaAPI) {
                window.MangaAPI.refreshData();
            }

            // Уведомляем об обновлении
            window.dispatchEvent(new CustomEvent('dataSync', {
                detail: { source: 'cloud', timestamp: cloudTimestamp }
            }));
        }
    }

    // === ПУБЛИЧНЫЕ МЕТОДЫ ===
    async syncToCloud() {
        if (!this.isOnline || !this.hasEnabledProvider()) {
            console.log('⚠️ Синхронизация недоступна (нет сети или провайдеров)');
            return false;
        }

        console.log('🔄 Начинаем синхронизацию с облаком...');

        // Пробуем разные провайдеры
        if (this.providers.github.enabled) {
            return await this.syncWithGitHub();
        }

        return false;
    }

    async loadFromCloud() {
        if (!this.isOnline || !this.hasEnabledProvider()) {
            console.log('⚠️ Загрузка из облака недоступна');
            return false;
        }

        console.log('📥 Загружаем данные из облака...');

        if (this.providers.github.enabled) {
            return await this.loadFromGitHub();
        }

        return false;
    }

    // === НАСТРОЙКА СИНХРОНИЗАЦИИ ===
    showSyncSetup() {
        const setupModal = document.createElement('div');
        setupModal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center;" id="syncSetupModal">
                <div style="background: var(--card-bg); padding: 32px; border-radius: 16px; max-width: 500px; width: 90%;">
                    <h3 style="margin-bottom: 16px; color: var(--text-color);">🔄 Настройка синхронизации</h3>
                    <p style="margin-bottom: 24px; color: var(--secondary-color); line-height: 1.5;">
                        Настройте синхронизацию, чтобы ваши данные (тайтлы, донаты, избранное) были доступны на всех устройствах.
                    </p>
                    
                    <div style="margin-bottom: 20px;">
                        <h4 style="color: var(--text-color); margin-bottom: 8px;">GitHub Gist (рекомендуется)</h4>
                        <input type="text" id="githubToken" placeholder="GitHub Personal Access Token" 
                               style="width: 100%; padding: 12px; margin-bottom: 8px; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-color); color: var(--text-color);">
                        <input type="text" id="gistId" placeholder="Gist ID (оставьте пустым для создания нового)" 
                               style="width: 100%; padding: 12px; margin-bottom: 8px; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-color); color: var(--text-color);">
                        <small style="color: var(--secondary-color);">
                            <a href="https://github.com/settings/tokens" target="_blank" style="color: var(--primary-color);">Создать токен</a>
                            с правами gist
                        </small>
                    </div>

                    <div style="display: flex; gap: 12px; justify-content: flex-end;">
                        <button onclick="document.getElementById('syncSetupModal').remove()" 
                                style="padding: 12px 24px; border: 1px solid var(--border-color); background: transparent; color: var(--text-color); border-radius: 8px; cursor: pointer;">
                            Пропустить
                        </button>
                        <button onclick="window.cloudSync.setupGitHubSync()" 
                                style="padding: 12px 24px; border: none; background: var(--primary-color); color: white; border-radius: 8px; cursor: pointer;">
                            Настроить
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(setupModal);
    }

    async setupGitHubSync() {
        const token = document.getElementById('githubToken').value.trim();
        const gistId = document.getElementById('gistId').value.trim();

        if (!token) {
            this.showNotification('Введите GitHub токен', 'error');
            return;
        }

        try {
            let finalGistId = gistId;

            // Если Gist ID не указан, создаем новый
            if (!finalGistId) {
                const newGist = await this.createNewGist(token);
                finalGistId = newGist.id;
            }

            // Сохраняем настройки
            localStorage.setItem('github_token', token);
            localStorage.setItem('sync_gist_id', finalGistId);
            
            this.providers.github.token = token;
            this.providers.github.gistId = finalGistId;
            this.providers.github.enabled = true;

            // Удаляем модальное окно
            document.getElementById('syncSetupModal').remove();

            // Выполняем первую синхронизацию
            await this.syncToCloud();

            this.showNotification('Синхронизация настроена! Данные будут автоматически сохраняться в облаке.', 'success');
        } catch (error) {
            console.error('❌ Ошибка настройки GitHub sync:', error);
            this.showNotification('Ошибка настройки. Проверьте токен и попробуйте снова.', 'error');
        }
    }

    async createNewGist(token) {
        const initialData = this.gatherAllData();
        const gistData = {
            description: "Light Fox Manga - Синхронизация данных",
            public: false,
            files: {
                "lightfox_data.json": {
                    content: JSON.stringify(initialData, null, 2)
                }
            }
        };

        const response = await fetch('https://api.github.com/gists', {
            method: 'POST',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gistData)
        });

        if (!response.ok) {
            throw new Error(`Failed to create gist: ${response.status}`);
        }

        return await response.json();
    }

    // === АВТОМАТИЧЕСКАЯ СИНХРОНИЗАЦИЯ ===
    startAutoSync() {
        // Синхронизация каждые 5 минут
        this.syncInterval = setInterval(() => {
            if (this.isOnline && this.hasEnabledProvider()) {
                this.syncToCloud();
            }
        }, 5 * 60 * 1000);

        // Синхронизация при изменении данных
        window.addEventListener('storage', () => {
            clearTimeout(this.syncTimeout);
            this.syncTimeout = setTimeout(() => {
                this.syncToCloud();
            }, 2000);
        });
    }

    // === УТИЛИТЫ ===
    showNotification(message, type = 'info') {
        // Создаем или обновляем уведомление
        let notification = document.getElementById('syncNotification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'syncNotification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 16px 20px;
                border-radius: 12px;
                color: white;
                font-weight: 500;
                z-index: 9999;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                max-width: 300px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            `;
            document.body.appendChild(notification);
        }

        // Устанавливаем цвет в зависимости от типа
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        notification.style.background = colors[type] || colors.info;
        notification.textContent = message;

        // Показываем уведомление
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Скрываем через 4 секунды
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    // === УПРАВЛЕНИЕ ===
    getLastSyncInfo() {
        const lastSync = localStorage.getItem(this.lastSyncKey);
        return lastSync ? new Date(lastSync) : null;
    }

    getSyncStatus() {
        return {
            isOnline: this.isOnline,
            hasProvider: this.hasEnabledProvider(),
            lastSync: this.getLastSyncInfo(),
            providers: this.providers
        };
    }

    async forcSync() {
        return await this.syncToCloud();
    }

    async forceLoad() {
        return await this.loadFromCloud();
    }

    clearSyncSettings() {
        localStorage.removeItem('github_token');
        localStorage.removeItem('sync_gist_id');
        localStorage.removeItem(this.lastSyncKey);
        
        this.providers.github.enabled = false;
        
        this.showNotification('Настройки синхронизации сброшены', 'info');
    }
}

// === ИНТЕГРАЦИЯ С ОСНОВНОЙ СИСТЕМОЙ ===

// Инициализируем синхронизацию при загрузке
window.addEventListener('DOMContentLoaded', function() {
    window.cloudSync = new CloudSyncManager();
});

// Добавляем в MangaAPI методы для триггера синхронизации
if (window.MangaAPI) {
    const originalAddManga = window.MangaAPI.addManga;
    const originalUpdateManga = window.MangaAPI.updateManga;
    const originalDeleteManga = window.MangaAPI.deleteManga;

    window.MangaAPI.addManga = function(manga) {
        const result = originalAddManga.call(this, manga);
        if (window.cloudSync) {
            setTimeout(() => window.cloudSync.syncToCloud(), 1000);
        }
        return result;
    };

    window.MangaAPI.updateManga = function(id, updates) {
        const result = originalUpdateManga.call(this, id, updates);
        if (window.cloudSync) {
            setTimeout(() => window.cloudSync.syncToCloud(), 1000);
        }
        return result;
    };

    window.MangaAPI.deleteManga = function(id) {
        const result = originalDeleteManga.call(this, id);
        if (window.cloudSync) {
            setTimeout(() => window.cloudSync.syncToCloud(), 1000);
        }
        return result;
    };

    // Добавляем метод обновления данных
    window.MangaAPI.refreshData = function() {
        this.loadMangaData();
        window.dispatchEvent(new CustomEvent('mangaDataUpdate'));
    };
}

console.log('🔄 Система облачной синхронизации готова!');
