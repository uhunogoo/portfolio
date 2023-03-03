"use strict";
exports.id = 180;
exports.ids = [180];
exports.modules = {

/***/ 463:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "z": () => (/* binding */ LoadingProgressContext)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const LoadingProgressContext = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1___default().createContext();
function LoadingProvider({ children  }) {
    const [loadingProgress, setLoadingProgress] = react__WEBPACK_IMPORTED_MODULE_1___default().useState(0);
    const value = react__WEBPACK_IMPORTED_MODULE_1___default().useMemo(()=>{
        return {
            loadingProgress,
            setLoadingProgress
        };
    }, [
        loadingProgress
    ]);
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(LoadingProgressContext.Provider, {
        value: value,
        children: children
    });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LoadingProvider);


/***/ }),

/***/ 403:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "x": () => (/* binding */ PreloadedContext)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const PreloadedContext = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1___default().createContext();
function PreloadedContentProvider({ children  }) {
    const [preloadedContent, setPreloadedContent] = react__WEBPACK_IMPORTED_MODULE_1___default().useState([]);
    const value = react__WEBPACK_IMPORTED_MODULE_1___default().useMemo(()=>{
        return {
            preloadedContent,
            setPreloadedContent
        };
    }, [
        preloadedContent
    ]);
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(PreloadedContext.Provider, {
        value: value,
        children: children
    });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PreloadedContentProvider);


/***/ })

};
;