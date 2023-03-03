(() => {
var exports = {};
exports.id = 888;
exports.ids = [888];
exports.modules = {

/***/ 200:
/***/ ((module) => {

// Exports
module.exports = {
	"style": {"fontFamily":"'__Romanica_529eb4', '__Romanica_Fallback_529eb4'"},
	"className": "__className_529eb4"
};


/***/ }),

/***/ 43:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "t": () => (/* binding */ EnterContext)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const EnterContext = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1___default().createContext();
function EnterProvider({ children  }) {
    const [enterStatus, setEnterStatus] = react__WEBPACK_IMPORTED_MODULE_1___default().useState(false);
    const value = react__WEBPACK_IMPORTED_MODULE_1___default().useMemo(()=>{
        return {
            enterStatus,
            setEnterStatus
        };
    }, [
        enterStatus
    ]);
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(EnterContext.Provider, {
        value: value,
        children: children
    });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (EnterProvider);


/***/ }),

/***/ 598:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ _app)
});

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
// EXTERNAL MODULE: ./node_modules/next/font/local/target.css?{"path":"src\\pages\\_app.js","import":"","arguments":[{"src":"../../public/fonts/Romanica/Romanica.woff2"}],"variableName":"Romanica"}
var Romanica_woff2_variableName_Romanica_ = __webpack_require__(200);
var Romanica_woff2_variableName_Romanica_default = /*#__PURE__*/__webpack_require__.n(Romanica_woff2_variableName_Romanica_);
// EXTERNAL MODULE: ./src/assets/index.css
var assets = __webpack_require__(391);
// EXTERNAL MODULE: ./src/assets/reset.css
var assets_reset = __webpack_require__(867);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(689);
;// CONCATENATED MODULE: external "next/head"
const head_namespaceObject = require("next/head");
var head_default = /*#__PURE__*/__webpack_require__.n(head_namespaceObject);
// EXTERNAL MODULE: ./src/components/EnterProvider/EnterProvider.js
var EnterProvider = __webpack_require__(43);
// EXTERNAL MODULE: ./src/components/LoadingProvider/LoadingProvider.js
var LoadingProvider = __webpack_require__(463);
// EXTERNAL MODULE: ./src/components/PreloadedContentProvider/PreloadedContentProvider.js
var PreloadedContentProvider = __webpack_require__(403);
;// CONCATENATED MODULE: ./src/pages/_app.js









function MyApp({ Component , pageProps  }) {
    const applyedClass = (Romanica_woff2_variableName_Romanica_default()).className;
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
        children: [
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)((head_default()), {
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx("meta", {
                        name: "description",
                        content: "Yurii Scherbachenko Three.js portfolio page"
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("title", {
                        children: "Yurii"
                    })
                ]
            }),
            /*#__PURE__*/ jsx_runtime_.jsx(LoadingProvider/* default */.Z, {
                children: /*#__PURE__*/ jsx_runtime_.jsx(PreloadedContentProvider/* default */.Z, {
                    children: /*#__PURE__*/ jsx_runtime_.jsx(EnterProvider/* default */.Z, {
                        children: /*#__PURE__*/ jsx_runtime_.jsx(Component, {
                            ...pageProps,
                            className: applyedClass
                        })
                    })
                })
            })
        ]
    });
}
/* harmony default export */ const _app = (MyApp);


/***/ }),

/***/ 391:
/***/ (() => {



/***/ }),

/***/ 867:
/***/ (() => {



/***/ }),

/***/ 689:
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ 997:
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [180], () => (__webpack_exec__(598)));
module.exports = __webpack_exports__;

})();