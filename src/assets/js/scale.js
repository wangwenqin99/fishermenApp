(function (win) {
  var doc = win.document
  var docEl = doc.documentElement
  function setScale () {
    var phoneScale = parseInt(docEl.getBoundingClientRect().width) / 360;
    var Meta = document.createElement('meta');
        Meta.name = 'viewport';
        Meta.content = 'width=360, initial-scale=1.0, minimum-scale = ' + phoneScale + ', maximum-scale = ' + phoneScale + ', viewport-fit=cover, user-scalable=no';
        Meta.targetDensitydpi = 'device-dp'
    document.getElementsByTagName('head')[0].appendChild(Meta);
  }
  setScale()

})(window) 
 