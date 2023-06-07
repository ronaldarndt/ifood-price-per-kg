// ==UserScript==
// @name         Ifood show price in kg
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.ifood.com.br/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  function run() {
      if (!window.location.href.includes('/delivery/')) {
          return;
      }

    const baseElement = document.createElement('p');
    baseElement.style.color = '#d73c3c';
    baseElement.style.margin = 0;
    baseElement.style.fontSize = '0.85em';

    outer: for (const prod of document.querySelectorAll('.product-card__details')) {
      const sibling = prod.nextSibling;

      const matches = prod.textContent.match(/.+ ([\d,]+)(g|ml|kg|l)/);

      if (!matches || matches.length < 2) {
        continue;
      }

      const unit = matches[2];
      const isWeight = unit === 'g' || unit === 'kg'
      const isNotFraction = unit === 'kg' || unit === 'l';

      let val = Number(matches[1].replace(',', '.'));

      if (isNotFraction) {
        val = val * 1000;
      }

      if (val === 1000) {
        continue;
      }

      const priceText = sibling.textContent.split(' ')[1].split('-')[0].replace(',', '.').match(/([\d\.]+)/)[0];
      const price = Number(priceText);

      const perKgPrice = (price * (1000 / val)).toFixed(2);

      const element = baseElement.cloneNode();
      element.textContent = perKgPrice.toString() + (isWeight ? ' por quilo' : ' por litro');

      const target = sibling.childNodes[0];

      const testTarget = target.childNodes.length > 1 ? target : sibling;

      for (const child of testTarget.childNodes) {
        if (child.textContent.includes(' por quilo') || child.textContent.includes(' por litro')) continue outer;
      }

      if (target.childNodes.length > 1) {
        target.insertBefore(element, target.childNodes[1]);
      } else {
        sibling.appendChild(element);
      }
    }
  }

  window.setTimeout(run, 2000);
  window.setInterval(run, 5000);
})();
