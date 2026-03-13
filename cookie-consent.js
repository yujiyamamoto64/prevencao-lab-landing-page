(function () {
    var storageKey = 'laboratorio-prevencao-cookie-consent';
    var acceptedValue = 'accepted';
    var rejectedValue = 'rejected';

    function readConsent() {
        try {
            return window.localStorage.getItem(storageKey);
        } catch (error) {
            return null;
        }
    }

    function writeConsent(value) {
        try {
            window.localStorage.setItem(storageKey, value);
        } catch (error) {
            return;
        }
    }

    function updateConsentState(value) {
        var state = value || 'pending';
        document.documentElement.setAttribute('data-cookie-consent', state);

        if (typeof window.CustomEvent === 'function') {
            window.dispatchEvent(new CustomEvent('cookie-consent-change', {
                detail: { status: state }
            }));
        }
    }

    var storedConsent = readConsent();
    if (storedConsent === acceptedValue || storedConsent === rejectedValue) {
        updateConsentState(storedConsent);
        return;
    }

    if (!document.body) {
        return;
    }

    updateConsentState(null);

    var spacer = document.createElement('div');
    spacer.setAttribute('aria-hidden', 'true');

    var banner = document.createElement('section');
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Aviso de cookies');
    banner.setAttribute('aria-live', 'polite');
    banner.className = 'fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6';

    banner.innerHTML = [
        '<div class="mx-auto max-w-5xl rounded-3xl border border-pink-100 bg-white shadow-2xl">',
        '  <div class="flex flex-col gap-5 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">',
        '    <div class="max-w-3xl">',
        '      <p class="text-xs font-semibold uppercase" style="color: var(--brand-primary, #e3063c); letter-spacing: 0.25em;">Cookies</p>',
        '      <p class="mt-2 text-base font-semibold text-gray-900">Voce aceita o uso de cookies neste site?</p>',
        '      <p class="mt-2 text-sm leading-6 text-gray-600">',
        '        Utilizamos cookies para melhorar sua navegacao e dar mais transparencia sobre o uso dos seus dados. ',
        '        <a href="politica-privacidade.html" class="font-semibold underline" style="color: var(--brand-primary, #e3063c);">Leia a Politica de Privacidade</a>.',
        '      </p>',
        '    </div>',
        '    <div class="flex flex-col gap-3 sm:flex-row lg:justify-end">',
        '      <button type="button" data-cookie-reject class="inline-flex items-center justify-center rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">Recusar</button>',
        '      <button type="button" data-cookie-accept class="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95" style="background-color: var(--brand-primary, #e3063c);">Aceitar</button>',
        '    </div>',
        '  </div>',
        '</div>'
    ].join('');

    function syncSpacer() {
        spacer.style.height = Math.ceil(banner.getBoundingClientRect().height + 16) + 'px';
    }

    function closeBanner(choice) {
        writeConsent(choice);
        updateConsentState(choice);
        window.removeEventListener('resize', syncSpacer);
        banner.remove();
        spacer.remove();
    }

    document.body.appendChild(spacer);
    document.body.appendChild(banner);
    syncSpacer();
    window.addEventListener('resize', syncSpacer);

    var acceptButton = banner.querySelector('[data-cookie-accept]');
    var rejectButton = banner.querySelector('[data-cookie-reject]');

    if (acceptButton) {
        acceptButton.addEventListener('click', function () {
            closeBanner(acceptedValue);
        });
    }

    if (rejectButton) {
        rejectButton.addEventListener('click', function () {
            closeBanner(rejectedValue);
        });
    }
})();
