/* Meta Pixel (anúncios do Instagram/Facebook).
   Registra visitas (PageView), cliques no WhatsApp (Contact)
   e envios do formulário de orçamento (Lead, disparado em main.js). */
(function () {
  var PIXEL_ID = '2060843281539664';
  if (!/^\d+$/.test(PIXEL_ID)) return; // sem ID válido, não carrega nada

  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');

  fbq('init', PIXEL_ID);
  fbq('track', 'PageView');

  // Qualquer clique em link do WhatsApp conta como "Contato"
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="wa.me"]');
    if (a) fbq('track', 'Contact');
  }, true);
})();
