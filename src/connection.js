const preinit = viewer => {
  if (!viewer)
    return;
  viewer.removeTab('Home');
  viewer.removeTab('About');
  viewer.removeTab('Schema');
  const preview = viewer.getTab('Preview');
  preview.toolbar.removeButton('clear');
  viewer.showTabBar(false);
};

const init = viewer => {
  if (!viewer || 
      !viewer.model || typeof viewer.model.getAllEntries !== 'function')
    return 0;
  const elems = document.getElementsByTagName('pre');
  if (elems.length !== 1)
    return 0;
  const text = elems[0].textContent.trim();
  if (!text)
    return 0;
  try {
    viewer.appendPreview(text, false);
  } catch (error) {
    return 0;
  }
  if (!viewer.model.input)
    return 0;
  const entries = viewer.model.getAllEntries();
  selectTab(viewer, entries && entries.length);
  return entries && entries.length? 2 : 1;
};

const selectTab = (viewer, isHar) => {
  viewer && viewer.getTab(isHar? 'Preview' : 'DOM').select();
};

const elem = document.getElementById('content');
if (elem) {
  elem.addEventListener('onViewerPreInit', () => {
    preinit(elem.repObject);
  });
  elem.addEventListener('onViewerInit', () => {
    const value = init(elem.repObject);
    window.postMessage({ id: 'HARVIEWER_TYPE', value }, '*');
  });
  window.addEventListener('message', event => {
    if (event.source !== window)
      return;
    const { id, value } = event.data;
    id === 'HARVIEWER_MODE' && selectTab(elem.repObject, value);
  });
}