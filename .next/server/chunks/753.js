"use strict";
exports.id = 753;
exports.ids = [753];
exports.modules = {

/***/ 753:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ WebglPart_WebglPart)
});

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(689);
var external_react_default = /*#__PURE__*/__webpack_require__.n(external_react_);
// EXTERNAL MODULE: external "@react-three/fiber"
var fiber_ = __webpack_require__(784);
// EXTERNAL MODULE: ./src/components/LoadingProvider/LoadingProvider.js
var LoadingProvider = __webpack_require__(463);
// EXTERNAL MODULE: external "@react-three/drei"
var drei_ = __webpack_require__(165);
// EXTERNAL MODULE: ./src/components/PreloadedContentProvider/PreloadedContentProvider.js
var PreloadedContentProvider = __webpack_require__(403);
;// CONCATENATED MODULE: ./src/components/WebglPart/Tower.js




function Tower() {
    // Parameters
    const floatingParams = {
        speed: 1.4,
        floatIntensity: 1.2,
        rotationIntensity: 0.3,
        floatingRange: [
            -0.2,
            0.2
        ]
    };
    console.log("Tower call");
    // Hooks
    const { preloadedContent  } = external_react_default().useContext(PreloadedContentProvider/* PreloadedContext */.x);
    const [decorMaterial, setDecorMaterial] = external_react_default().useState(null);
    const tower = external_react_default().useMemo(()=>{
        const model = preloadedContent?.find((el)=>el.name === "towerModel");
        const towerPart1 = model?.item.scene.children.find((child)=>child.name === "tower");
        const towerPart2 = model?.item.scene.children.find((child)=>child.name === "runic");
        const towerPart3 = model?.item.scene.children.find((child)=>child.name === "components");
        const towerPart4 = model?.item.scene.children.find((child)=>child.name === "portal");
        // largeTexture
        // otherTextures
        const largeTexture = preloadedContent?.find((el)=>el.name === "largeTexture").item;
        const otherTextures = preloadedContent?.find((el)=>el.name === "otherTextures").item;
        largeTexture.flipY = false;
        otherTextures.flipY = false;
        return {
            towerPart1,
            towerPart2,
            towerPart3,
            towerPart4,
            largeTexture,
            otherTextures
        };
    }, [
        preloadedContent
    ]);
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("meshBasicMaterial", {
                ref: setDecorMaterial,
                map: tower.otherTextures
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)(drei_.Center, {
                disableX: true,
                disableZ: true,
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx(drei_.Float, {
                        ...floatingParams,
                        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("group", {
                            scale: 0.45,
                            children: [
                                /*#__PURE__*/ jsx_runtime_.jsx("mesh", {
                                    geometry: tower.towerPart1.geometry,
                                    children: /*#__PURE__*/ jsx_runtime_.jsx("meshBasicMaterial", {
                                        map: tower.largeTexture
                                    })
                                }),
                                /*#__PURE__*/ jsx_runtime_.jsx("mesh", {
                                    geometry: tower.towerPart2.geometry,
                                    material: decorMaterial
                                }),
                                /*#__PURE__*/ jsx_runtime_.jsx("mesh", {
                                    geometry: tower.towerPart3.geometry,
                                    material: decorMaterial
                                }),
                                /*#__PURE__*/ jsx_runtime_.jsx("mesh", {
                                    geometry: tower.towerPart4.geometry,
                                    children: /*#__PURE__*/ jsx_runtime_.jsx("meshBasicMaterial", {})
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx(drei_.Sparkles, {
                        size: 6,
                        scale: [
                            26,
                            0.1,
                            26
                        ],
                        "position-y": 0.3,
                        count: 50
                    })
                ]
            })
        ]
    });
}
/* harmony default export */ const WebglPart_Tower = (Tower);

;// CONCATENATED MODULE: ./src/components/WebglPart/WebglPart.js




const UseResources = /*#__PURE__*/ external_react_default().lazy(()=>Promise.all(/* import() */[__webpack_require__.e(828), __webpack_require__.e(731)]).then(__webpack_require__.bind(__webpack_require__, 731)));

function WebglPart() {
    const { loadingProgress , setLoadingProgress  } = external_react_default().useContext(LoadingProvider/* LoadingProgressContext */.z);
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx((external_react_default()).Suspense, {
                fallback: null,
                children: /*#__PURE__*/ jsx_runtime_.jsx(UseResources, {
                    setLoadingProgress: setLoadingProgress
                })
            }),
            loadingProgress === 100 && /*#__PURE__*/ jsx_runtime_.jsx(fiber_.Canvas, {
                dpr: 1,
                shadows: false,
                gl: {
                    powerPreference: "high-performance",
                    toneMappingExposure: 1.1
                },
                flat: false,
                className: "webgl",
                children: /*#__PURE__*/ jsx_runtime_.jsx(WebglPart_Tower, {})
            })
        ]
    });
}
/* harmony default export */ const WebglPart_WebglPart = (/*#__PURE__*/external_react_default().memo(WebglPart));


/***/ })

};
;