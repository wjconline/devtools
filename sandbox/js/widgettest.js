console.log('hello world');
const widgetWrapper = document.getElementById('widgetTest');
console.log('widgetWrapper', widgetWrapper);
const chewyCenter = document.getElementById('chewycenter');
console.log('chewyCenter', chewyCenter);
const widgetData = (widgetWrapper && widgetWrapper.dataset) || {};
const modelId = (widgetData && widgetData.modelid) ? widgetData.modelid : 0;
const postalCode = (widgetData && widgetData.postalcode) ? widgetData.postalcode : '';
console.log('widgetWrapper.dataset', widgetWrapper.dataset);
console.log('widgetData', widgetData);
console.log('modelId', modelId);
console.log('postalCode', postalCode);

