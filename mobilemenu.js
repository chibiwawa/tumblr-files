function toggleMobileMenu() {
    var menu = document.querySelector('ul.sidelinks');
    var btn = document.querySelector('.mobile-menu-toggle');
    if (menu.classList.contains('menu-open')) {
        menu.classList.remove('menu-open');
        btn.textContent = 'open navigation';
    } else {
        menu.classList.add('menu-open');
        btn.textContent = 'close navigation';
    }
}
