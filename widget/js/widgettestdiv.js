console.log('Widget Test Div JS - Start');

const widgetWrapper = document.getElementById('widgetTestDiv');
console.log('widgetWrapper', widgetWrapper);
const chewyCenter = document.getElementById('chewycenter');
console.log('chewyCenter', chewyCenter);
const widgetData = (widgetWrapper && widgetWrapper.dataset) || {};
const modelCode = (widgetData && widgetData.modelCode) ? widgetData.modelCode : 0;
const postalCode = (widgetData && widgetData.postalCode) ? widgetData.postalCode : '';
const dealerCode = (widgetData && widgetData.dealerId) ? widgetData.dealerId : '';
console.log('widgetWrapper.dataset', widgetWrapper.dataset);
console.log('widgetData', widgetData);
console.log('modelCode', modelCode);
console.log('postalCode', postalCode);
console.log('dealerId', dealerCode);

// create a new div element
const newDiv = document.createElement("div");
// and give it some content
//console.log(`${a} is less than ${b}`)
const message = `Hi there and greetings! Model Id = ${modelCode}`;
const newContent = document.createTextNode(message);
// add the newly created element and its content into the DOM
const currentDiv = document.getElementById("div1");
document.body.insertBefore(newDiv, currentDiv);
// add the text node to the newly created div
newDiv.appendChild(newContent);

console.log('Widget Test Div JS - End');

//
// (function (d, a, b, f, e) {
//     d[e] = d[e] || [];
//     d[e].push({analytics1: "a1", analyticsProperties: {aP1: "property1", aP2: "property2"}});
//     console.log('window:', d, d.analyticsObj);
//     let c = a.createElement(b);
//     c.src = f;
//     c.async = !0;
//     c.onload = c.onreadystatechange = function () {
//         var a = this.readyState, c = d[e];
//         if (!a || "complete" == a || "loaded" == a) try {
//             var b = YAHOO.ywa.I13N.fireBeacon;
//             d[e] = [];
//             d[e].push = function (a) {
//                 b([a])
//             };
//             b(c)
//         } catch (g) {
//         }
//     };
//     console.log('script tag:', c);
//     a = a.getElementsByTagName(b)[0];
//     b = a.parentNode;
//     console.log('script tag:', c);
//
//     b.insertBefore(c, a)
// })(window, document, "script", "http://10.0.0.20:1337/sandbox/js/widgettest.js", "analyticsObj");
// <script type="text/javascript" src="http://10.0.0.20:1337/sandbox/js/widgettest.js"></script>