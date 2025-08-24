// Система авторизации для Light Fox Manga
(function() {
    'use strict';

    // Ключи для localStorage
    const USERS_KEY = 'lightfox_users';
    const SESSION_KEY = 'lightfox_session';

    class AuthSystem {
        constructor() {
            this.currentSession = this.loadSession();
            this.users = this.loadUsers();
        }

        // Загрузка пользователей
        loadUsers() {
            try {
                const stored = localStorage.getItem(USERS_KEY);
                return stored ? JSON.parse(stored) : [];
            } catch (error) {
                console.error('Ошибка загрузки пользователей:', error);
                return [];
            }
        }

        // Сохранение пользователей
        saveUsers() {
            try {
                localStorage.setItem(USERS_KEY, JSON.stringify(this.users));
            } catch (error) {
                console.error('Ошибка сохранения пользователей:', error);
            }
        }

        // Загрузка сессии
        loadSession() {
            try {
                const stored = localStorage.getItem(SESSION_KEY);
                return stored ? JSON.parse(stored) : null;
            } catch (error) {
                console.error('Ошибка загрузки сессии:', error);
                return null;
            }
        }

        // Сохранение сессии
        saveSession(sessionData) {
            try {
                localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
                this.currentSession = sessionData;
            } catch (error) {
                console.error('Ошибка сохранения сессии:', error);
            }
        }

        // Проверка авторизации
        isAuthenticated() {
            if (!this.currentSession) return false;
            
            // Проверяем, что пользователь существует
            const user = this.users.find(u => u.id === this.currentSession.user.id);
            if (!user) {
                this.logout();
                return false;
            }
            
            // Проверяем, что устройство разрешено
            const device = user.devices.find(d => d.id === this.currentSession.deviceId);
            if (!device) {
                this.logout();
                return false;
            }
            
            return true;
        }

        // Получение текущего пользователя
        getCurrentUser() {
            return this.isAuthenticated() ? this.currentSession.user : null;
        }

        // Получение текущего устройства
        getCurrentDevice() {
            if (!this.isAuthenticated()) return null;
            
            const user = this.users.find(u => u.id === this.currentSession.user.id);
            return user.devices.find(d => d.id === this.currentSession.deviceId);
        }

        // Регистрация пользователя
        async register(userData, deviceInfo) {
            // Проверяем, что email не занят
            if (this.users.find(u => u.email === userData.email)) {
                throw new Error('Пользователь с таким email уже существует');
            }

            // Создаем нового пользователя
            const newUser = {
                id: this.generateUserId(),
                username: userData.username,
                email: userData.email,
                password: btoa(userData.password), // Простое кодирование
                registeredAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                devices: [{
                    id: this.generateDeviceId(),
                    ...deviceInfo,
                    registrationDevice: true,
                    addedAt: new Date().toISOString(),
                    lastLogin: new Date().toISOString()
                }],
                subscription: null,
                settings: {
                    theme: 'light',
                    language: 'ru',
                    notifications: true
                },
                // Пользовательские списки
                favorites: [],
                watching: [],
                wantToWatch: [],
                completed: [],
                watchingProgress: {},
                donationHistory: []
            };

            // Сохраняем пользователя
            this.users.push(newUser);
            this.saveUsers();

            // Создаем сессию
            this.createSession(newUser, newUser.devices[0].id);

            return newUser;
        }

        // Вход в систему
        async login(email, password, deviceInfo, rememberMe = false) {
            // Ищем пользователя
            const user = this.users.find(u => u.email === email && u.password === btoa(password));
            if (!user) {
                throw new Error('Неверный email или пароль');
            }

            // Проверяем лимит устройств
            const currentDeviceId = this.generateDeviceId();
            const existingDevice = user.devices.find(d => d.id === currentDeviceId);
            
            if (!existingDevice && user.devices.length >= 3) {
                throw new Error('Достигнут лимит устройств (максимум 3). Отвяжите одно из устройств в настройках.');
            }

            // Добавляем/обновляем устройство
            if (!existingDevice) {
                user.devices.push({
                    id: currentDeviceId,
                    ...deviceInfo,
                    addedAt: new Date().toISOString(),
                    lastLogin: new Date().toISOString()
                });
            } else {
                existingDevice.lastLogin = new Date().toISOString();
            }

            // Обновляем пользователя
            user.lastLogin = new Date().toISOString();
            const userIndex = this.users.findIndex(u => u.id === user.id);
            this.users[userIndex] = user;
            this.saveUsers();

            // Создаем сессию
            this.createSession(user, currentDeviceId, rememberMe);

            return user;
        }

        // Создание сессии
        createSession(user, deviceId, rememberMe = false) {
            const sessionData = {
                user: user,
                deviceId: deviceId,
                loginTime: new Date().toISOString(),
                rememberMe: rememberMe
            };

            this.saveSession(sessionData);

            // Совместимость со старой системой
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify({
                id: user.id,
                name: user.username,
                email: user.email,
                username: user.username
            }));
        }

        // Выход из системы
        logout() {
            // Удаляем сессию
            localStorage.removeItem(SESSION_KEY);
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            
            this.currentSession = null;
        }

        // Отвязка устройства
        removeDevice(userId, deviceId) {
            const user = this.users.find(u => u.id === userId);
            if (!user) return false;

            // Нельзя удалить последнее устройство
            if (user.devices.length <= 1) {
                throw new Error('Нельзя удалить последнее устройство');
            }

            // Удаляем устройство
            user.devices = user.devices.filter(d => d.id !== deviceId);
            
            // Если удалили текущее устройство, выходим
            if (this.currentSession && this.currentSession.deviceId === deviceId) {
                this.logout();
            }

            this.saveUsers();
            return true;
        }

        // Обновление профиля пользователя
        updateProfile(userId, updates) {
            const userIndex = this.users.findIndex(u => u.id === userId);
            if (userIndex === -1) return false;

            // Проверяем email на уникальность
            if (updates.email && updates.email !== this.users[userIndex].email) {
                if (this.users.find(u => u.email === updates.email && u.id !== userId)) {
                    throw new Error('Email уже занят другим пользователем');
                }
            }

            // Обновляем пользователя
            this.users[userIndex] = { ...this.users[userIndex], ...updates };
            this.saveUsers();

            // Обновляем сессию если это текущий пользователь
            if (this.currentSession && this.currentSession.user.id === userId) {
                this.currentSession.user = this.users[userIndex];
                this.saveSession(this.currentSession);
            }

            return true;
        }

        // Получение статистики пользователей (для админки)
        getUserStats() {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

            const stats = {
                total: this.users.length,
                today: 0,
                thisWeek: 0,
                thisMonth: 0,
                online: 0,
                devices: 0
            };

            this.users.forEach(user => {
                const registeredAt = new Date(user.registeredAt);
                
                if (registeredAt >= today) stats.today++;
                if (registeredAt >= thisWeek) stats.thisWeek++;
                if (registeredAt >= thisMonth) stats.thisMonth++;
                
                // Считаем онлайн (последняя активность менее 5 минут назад)
                const lastLogin = new Date(user.lastLogin);
                if (now - lastLogin < 5 * 60 * 1000) stats.online++;
                
                stats.devices += user.devices.length;
            });

            return stats;
        }

        // Получение списка пользователей (для админки)
        getAllUsers(page = 1, limit = 50) {
            const start = (page - 1) * limit;
            const end = start + limit;
            
            return {
                users: this.users.slice(start, end).map(user => ({
                    ...user,
                    password: undefined // Не показываем пароль
                })),
                total: this.users.length,
                page: page,
                limit: limit,
                hasMore: end < this.users.length
            };
        }

        // Утилиты
        generateUserId() {
            return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }

        generateDeviceId() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            ctx.textBaseline = 'top';
            ctx.font = '14px Arial';
            ctx.fillText('Device fingerprint', 2, 2);
            
            return 'device_' + btoa(
                navigator.userAgent + 
                (canvas.toDataURL ? canvas.toDataURL() : '') + 
                screen.width + 
                screen.height + 
                new Date().getTimezoneOffset()
            ).replace(/[^a-zA-Z0-9]/g, '').substr(0, 16);
        }

        // Проверка требований авторизации
        requireAuth(redirectTo = 'auth.html') {
            if (!this.isAuthenticated()) {
                const currentUrl = window.location.pathname + window.location.search;
                window.location.href = `${redirectTo}?redirect=${encodeURIComponent(currentUrl)}`;
                return false;
            }
            return true;
        }

        // Ограничение доступа к контенту
        restrictContent(element, message = 'Для доступа к контенту необходима авторизация') {
            if (!this.isAuthenticated()) {
                if (element) {
                    element.innerHTML = `
                        <div style="
                            text-align: center; 
                            padding: 40px 20px; 
                            background: linear-gradient(135deg, rgba(255, 138, 80, 0.1), rgba(255, 112, 67, 0.1));
                            border-radius: 12px;
                            border: 2px dashed rgba(255, 138, 80, 0.3);
                        ">
                            <div style="font-size: 3rem; margin-bottom: 16px;">🔒</div>
                            <h3 style="margin-bottom: 12px; color: var(--text-color);">Контент недоступен</h3>
                            <p style="margin-bottom: 20px; color: var(--secondary-color);">${message}</p>
                            <a href="auth.html?action=register&redirect=${encodeURIComponent(window.location.href)}" 
                               style="
                                   display: inline-flex;
                                   align-items: center;
                                   gap: 8px;
                                   padding: 12px 24px;
                                   background: linear-gradient(135deg, #ff8a50, #ff7043);
                                   color: white;
                                   text-decoration: none;
                                   border-radius: 8px;
                                   font-weight: 600;
                                   transition: transform 0.2s;
                               "
                               onmouseover="this.style.transform='translateY(-2px)'"
                               onmouseout="this.style.transform='translateY(0)'">
                                🚀 Зарегистрироваться
                            </a>
                        </div>
                    `;
                }
                return false;
            }
            return true;
        }
    }

    // Создаем глобальный экземпляр
    const authSystem = new AuthSystem();

    // Экспорт в глобальную область видимости
    window.AuthSystem = {
        // Основные методы
        isAuthenticated: () => authSystem.isAuthenticated(),
        getCurrentUser: () => authSystem.getCurrentUser(),
        getCurrentDevice: () => authSystem.getCurrentDevice(),
        
        // Авторизация
        register: (userData, deviceInfo) => authSystem.register(userData, deviceInfo),
        login: (email, password, deviceInfo, rememberMe) => authSystem.login(email, password, deviceInfo, rememberMe),
        logout: () => authSystem.logout(),
        
        // Управление профилем
        updateProfile: (userId, updates) => authSystem.updateProfile(userId, updates),
        removeDevice: (userId, deviceId) => authSystem.removeDevice(userId, deviceId),
        
        // Защита контента
        requireAuth: (redirectTo) => authSystem.requireAuth(redirectTo),
        restrictContent: (element, message) => authSystem.restrictContent(element, message),
        
        // Админка
        getUserStats: () => authSystem.getUserStats(),
        getAllUsers: (page, limit) => authSystem.getAllUsers(page, limit),
        
        // Прямой доступ к системе
        _system: authSystem
    };

    console.log('🔐 Light Fox Manga Auth System загружена');
    console.log(`👥 Зарегистрировано пользователей: ${authSystem.users.length}`);
    
    // Уведомление о готовности системы авторизации
    setTimeout(() => {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('authSystemReady', {
                detail: { auth: window.AuthSystem }
            }));
        }
    }, 100);

})();
