"use strict";
exports.id = 731;
exports.ids = [731];
exports.modules = {

/***/ 623:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function support_format_webp() {
    if (false) {} else {
        return false;
    }
}
const isWebpSupport = support_format_webp();
const formatJPG = isWebpSupport ? ".webp" : ".jpg";
const formatPNG = isWebpSupport ? ".webp" : ".png";
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ([
    // MODELS
    {
        name: "towerModel",
        type: "gltfLoader",
        path: "/models/tower-model.glb"
    },
    //  TOWER
    {
        name: "largeTexture",
        type: "texture",
        asset: "startParams",
        path: `/textures/largeTexture${formatJPG}`
    },
    {
        name: "otherTextures",
        type: "texture",
        asset: "startParams",
        path: `/textures/otherTextures${formatJPG}`
    },
    {
        name: "shadowMap",
        type: "texture",
        asset: "startParams",
        path: `/textures/shadowMap${formatJPG}`
    },
    {
        name: "sandTexture",
        type: "texture",
        asset: "startParams",
        path: `/textures/sand${formatJPG}`
    },
    {
        name: "groundTexture",
        type: "texture",
        asset: "startParams",
        path: `/textures/forest${formatJPG}`
    },
    //  Grass
    {
        name: "grassTexture",
        type: "texture",
        path: `/textures/grass-1${formatPNG}`
    },
    {
        name: "grassSecondTexture",
        type: "texture",
        path: `/textures/grass-2${formatPNG}`
    },
    //  Fire
    {
        name: "fireTexture",
        type: "texture",
        path: `/textures/fire${formatJPG}`
    },
    //  Clouds
    {
        name: "cloud",
        type: "texture",
        path: `/textures/cloud${formatPNG}`
    }
]);


/***/ }),

/***/ 731:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ useResources)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(949);
/* harmony import */ var three_examples_jsm_loaders_DRACOLoader__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(854);
/* harmony import */ var three_examples_jsm_loaders_GLTFLoader__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(217);
/* harmony import */ var _components_PreloadedContentProvider_PreloadedContentProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(403);
/* harmony import */ var _sources__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(623);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([three__WEBPACK_IMPORTED_MODULE_1__, three_examples_jsm_loaders_DRACOLoader__WEBPACK_IMPORTED_MODULE_4__, three_examples_jsm_loaders_GLTFLoader__WEBPACK_IMPORTED_MODULE_5__]);
([three__WEBPACK_IMPORTED_MODULE_1__, three_examples_jsm_loaders_DRACOLoader__WEBPACK_IMPORTED_MODULE_4__, three_examples_jsm_loaders_GLTFLoader__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);






function useResources({ setLoadingProgress  }) {
    if (_sources__WEBPACK_IMPORTED_MODULE_3__/* ["default"].length */ .Z.length === 0) return;
    const { setPreloadedContent  } = react__WEBPACK_IMPORTED_MODULE_0___default().useContext(_components_PreloadedContentProvider_PreloadedContentProvider__WEBPACK_IMPORTED_MODULE_2__/* .PreloadedContext */ .x);
    const totalCount = _sources__WEBPACK_IMPORTED_MODULE_3__/* ["default"].length */ .Z.length;
    const [items, setItems] = react__WEBPACK_IMPORTED_MODULE_0___default().useState([]);
    const loaders = react__WEBPACK_IMPORTED_MODULE_0___default().useMemo(()=>{
        const textureLoader = new three__WEBPACK_IMPORTED_MODULE_1__.TextureLoader();
        const dracoLoader = new three_examples_jsm_loaders_DRACOLoader__WEBPACK_IMPORTED_MODULE_4__/* .DRACOLoader */ ._();
        const gltfLoader = new three_examples_jsm_loaders_GLTFLoader__WEBPACK_IMPORTED_MODULE_5__/* .GLTFLoader */ .E();
        dracoLoader.setDecoderPath("/draco/");
        gltfLoader.setDRACOLoader(dracoLoader);
        return {
            textureLoader,
            gltfLoader
        };
    }, []);
    // Start loading
    react__WEBPACK_IMPORTED_MODULE_0___default().useEffect(()=>{
        const intervalId = window.setTimeout(()=>{
            _sources__WEBPACK_IMPORTED_MODULE_3__/* ["default"].map */ .Z.map((source)=>{
                manageLoading(source, loaders, setItems);
            });
        }, 3000);
        // When I'm ready to stop the interval, I'd run:
        return ()=>{
            window.clearTimeout(intervalId);
        };
    }, [
        loaders
    ]);
    react__WEBPACK_IMPORTED_MODULE_0___default().useEffect(()=>{
        setLoadingProgress(items.length / totalCount * 100);
        if (items.length === totalCount) {
            setPreloadedContent(items);
        }
    }, [
        setLoadingProgress,
        items
    ]);
    if (items.length !== totalCount) return [];
}
async function manageLoading(source, loaders, setItems) {
    let response;
    if (source.type === "texture") {
        response = await loaders.textureLoader.loadAsync(source.path);
    } else if (source.type === "gltfLoader") {
        response = await loaders.gltfLoader.loadAsync(source.path);
    }
    if (!response) return;
    const newItem = {
        name: source.name,
        item: response
    };
    setItems((currentItems)=>{
        const isExist = currentItems?.find((el)=>el.name === newItem.name);
        if (isExist) return [
            ...currentItems
        ];
        return [
            ...currentItems,
            newItem
        ];
    });
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;