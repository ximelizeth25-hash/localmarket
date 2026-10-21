/**
 * LocalMarket PWA - Registro de Service Worker e Instalador de Aplicación
 */

(function () {
    let deferredPrompt = null;

    // 1. Registro del Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js', { scope: '/' })
                .then((registration) => {
                    console.log('[PWA] Service Worker registrado exitosamente. Alcance:', registration.scope);

                    // Escuchar actualizaciones
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        if (!newWorker) return;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                mostrarAvisoActualizacion();
                            }
                        });
                    });
                })
                .catch((err) => {
                    console.warn('[PWA] No se pudo registrar el Service Worker:', err);
                });
        });

        // Recargar si el Service Worker activo cambió
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
                refreshing = true;
                window.location.reload();
            }
        });
    }

    // 2. Manejador de Instalación PWA (beforeinstallprompt)
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevenir el infobar automático por defecto
        e.preventDefault();
        deferredPrompt = e;
        console.log('[PWA] Evento beforeinstallprompt capturado. Listo para instalación.');

        // Mostrar botón o banner de instalación en la UI
        const btnInstall = document.getElementById('btnInstalarPwa');
        const bannerInstall = document.getElementById('pwaInstallBanner');
        if (btnInstall) btnInstall.classList.remove('hidden');
        if (bannerInstall) bannerInstall.classList.remove('hidden');
    });

    window.instalarPwa = async function () {
        if (!deferredPrompt) {
            alert('La aplicación ya está instalada o tu navegador no soporta instalación directa.');
            return;
        }
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log('[PWA] Elección del usuario:', outcome);
        deferredPrompt = null;
        const btnInstall = document.getElementById('btnInstalarPwa');
        const bannerInstall = document.getElementById('pwaInstallBanner');
        if (btnInstall) btnInstall.classList.add('hidden');
        if (bannerInstall) bannerInstall.classList.add('hidden');
    };

    window.addEventListener('appinstalled', () => {
        console.log('[PWA] ¡LocalMarket ha sido instalada exitosamente en este dispositivo!');
        deferredPrompt = null;
        const btnInstall = document.getElementById('btnInstalarPwa');
        const bannerInstall = document.getElementById('pwaInstallBanner');
        if (btnInstall) btnInstall.classList.add('hidden');
        if (bannerInstall) bannerInstall.classList.add('hidden');
    });

    // 3. Monitoreo de Conectividad (Online / Offline)
    window.addEventListener('offline', () => {
        console.warn('[PWA] Conexión perdida. Cambiando a modo Offline.');
        mostrarToastConectividad(false);
    });

    window.addEventListener('online', () => {
        console.log('[PWA] Conexión recuperada.');
        mostrarToastConectividad(true);
    });

    function mostrarToastConectividad(isOnline) {
        let toast = document.getElementById('pwaNetworkToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'pwaNetworkToast';
            toast.className = 'fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-xl text-xs font-bold shadow-2xl flex items-center space-x-2 transition-all transform duration-300';
            document.body.appendChild(toast);
        }

        if (isOnline) {
            toast.className = 'fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-xl text-xs font-bold shadow-2xl flex items-center space-x-2 transition-all transform duration-300 bg-emerald-600 text-white';
            toast.innerHTML = '<i class="fa-solid fa-cloud-arrow-up text-sm"></i><span>Conexión restablecida. Sincronizado.</span>';
        } else {
            toast.className = 'fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-xl text-xs font-bold shadow-2xl flex items-center space-x-2 transition-all transform duration-300 bg-amber-600 text-white';
            toast.innerHTML = '<i class="fa-solid fa-wifi-slash text-sm"></i><span>Modo fuera de línea activo (PWA).</span>';
        }

        toast.style.display = 'flex';
        setTimeout(() => {
            if (toast) toast.style.display = 'none';
        }, 4000);
    }

    function mostrarAvisoActualizacion() {
        let toast = document.getElementById('pwaUpdateToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'pwaUpdateToast';
            toast.className = 'fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl text-xs font-bold shadow-2xl flex items-center space-x-3 bg-navy-900 border border-sky-500/40 text-white';
            toast.innerHTML = `
                <i class="fa-solid fa-sparkles text-sky-400 text-base"></i>
                <div class="flex flex-col text-left">
                    <span class="font-bold">Nueva versión disponible</span>
                    <span class="text-[11px] text-slate-400 font-normal">Actualiza para ver los últimos cambios.</span>
                </div>
                <button onclick="window.location.reload()" class="ml-2 px-2.5 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold">
                    Actualizar
                </button>
            `;
            document.body.appendChild(toast);
        }
    }
})();
