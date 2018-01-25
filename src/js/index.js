'use strict';
(function () {
  /**
   * にゃあ〜と鳴きます。
   */
  function nyaa() {
    alert('にゃあ〜');
    console.log('にゃあ〜');
  } 

  document.addEventListener('DOMContentLoaded', function (event) {
    var $btn = document.querySelector('#btn')
    $btn.addEventListener('click', function () {
      nyaa();
    })
  });
})();
