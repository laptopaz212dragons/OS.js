proc.createWindow({dimension: {width: 400, height: 400}})
  .on('destroy', () => proc.destroy())
  .render(($content, win) => {
    // Add our process and window id to iframe URL
    const suffix = `?pid=${proc.pid}&wid=${win.wid}`;

    // Create an iframe
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.src = proc.resource('/data/calculator..html') + suffix;
    iframe.setAttribute('border', '0');

    // Bind window events to iframe
    win.on('blur', () => iframe.contentWindow.blur());
    win.on('focus', () => iframe.contentWindow.focus());
    win.on('iframe:post', msg => iframe.contentWindow.postMessage(msg, window.location.href));

    // Listen for messages from iframe
    win.on('iframe:get', msg => {
      console.warn('Message from Iframe', msg);
      win.emit('iframe:post', 'Pong');
    });

    $content.appendChild(iframe);
  });
