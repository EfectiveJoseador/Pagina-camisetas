
import { auth, onAuthStateChanged } from './firebase-config.js';
onAuthStateChanged(auth, (user) => {
    const userIcon = document.querySelector('.header-actions a[href="/pages/login.html"]');

    if (user) {
        window.isUserAuthenticated = true;
        window.currentUser = user;
        if (user.emailVerified && userIcon) {
            userIcon.href = '/pages/perfil.html';
            userIcon.title = 'Mi Perfil';
        }


    } else {
        if (userIcon) {
            userIcon.href = '/pages/login.html';
            userIcon.title = 'Iniciar Sesión';
        }
        window.isUserAuthenticated = false;
        window.currentUser = null;
    }
    window.dispatchEvent(new CustomEvent('auth:stateChanged', {
        detail: { user, isAuthenticated: !!user && user.emailVerified }
    }));
});
export { auth };
