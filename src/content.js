let container;
let sourceElem;
let inited = false;
let type = 0;
let mode = 0;

const prevalidate = () => {
  if (document.getElementsByTagName('pre').length !== 1)
    return false;
  const text = document.body.textContent.trim();
  return text.charAt(0) === '{' && text.charAt(text.length-1) === '}';
};

const init = () => {
  const getURL = (url) => chrome.extension.getURL(url);
  const addCss = (url) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    const elems = document.getElementsByTagName('head');
    elems.length && elems[0].appendChild(link);
  };
  const addScript = (url, fn) => {
    const script = document.createElement('script');
    script.src = url;
    fn && fn(script);
    document.body.appendChild(script);
  };
  sourceElem = document.getElementsByTagName('pre')[0];
  container = document.createElement('div');
  container.id = 'content';
  document.body.appendChild(container);
  addCss( getURL('harviewer/css/harViewer.css') );
  addScript( getURL('harviewer/scripts/jquery.js') );
  addScript( getURL('harviewer/scripts/require.js'), script => {
      script.setAttribute(
        'data-main',
        getURL('harviewer/scripts/harViewer.js')
      );
  } );
  addScript( getURL('connection.js') );
};

const remove = () => {
  container.parentNode.removeChild(container);
  container = null;
};

const toggleMode = () => {
  if (!container)
    return;
  const showElem = (elem, on) => {
    elem.style.display = on? 'block' : 'none';
  };
  mode = inited? (mode + 1) % (type + 1) : type;
  if (!inited || mode <= 1) {
    showElem(sourceElem, !mode);
    showElem(container, mode);
  }
  if (inited && type > 1 && mode) {
    window.postMessage({ id: 'HARVIEWER_MODE', value: mode-1 }, '*');
  }
};

const sendInitData = () => {
  chrome.runtime.sendMessage({ id: 'initIcon', type, mode });
};

if ( prevalidate() ) {
  init();
  window.addEventListener('message', function(event) {
    if (inited || event.source !== window)
      return;
    const { id, value } = event.data;
    if (id !== 'HARVIEWER_TYPE')
      return;
    type = Math.min(Math.max(value, 0), 3);
    type? toggleMode() : remove();
    inited = true;
    sendInitData();
  });
}
else {
  sendInitData();
}

chrome.runtime.onMessage.addListener( (data, sender, sendResponse) => {
  const { id } = data || {};
  if (!container || id !== 'clickIcon')
    return;
  toggleMode();
  sendResponse({ mode });
  return true;
});
