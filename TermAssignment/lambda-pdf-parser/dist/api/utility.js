"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImageResponse = exports.removeBackground = exports.cropImage = exports.getPdfDimensions = exports.checkPdfQuality = void 0;
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const pdf2json_1 = __importDefault(require("pdf2json"));
const gm_1 = __importDefault(require("gm"));
const remove_bg_1 = require("remove.bg");
require('dotenv').config();
const REMOVE_BG_API_KEY = '' + process.env.removeBgApiKey;
const TOTAL_PAGES = 3;
const PIXEL_CONVERT = 25;
gm_1.default.subClass({ imageMagick: true });
function checkPdfQuality(pdfBase64) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = {};
        const pdfBuffer = Buffer.from(pdfBase64, 'base64');
        try {
            const pdfProperties = yield (0, pdf_parse_1.default)(pdfBuffer, {
                pagerender: render_page,
            });
            if (pdfProperties.numpages != TOTAL_PAGES) {
                response.err = 'PDF does not contain the required number of pages';
                response.goodPdf = false;
                return response;
            }
            response.goodPdf = true;
            return response;
        }
        catch (err) {
            response.err = 'Invalid PDF';
            response.goodPdf = false;
            return response;
        }
    });
}
exports.checkPdfQuality = checkPdfQuality;
function getPdfDimensions(pdfBase64) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = {};
        const pdfBuffer = Buffer.from(pdfBase64, 'base64');
        try {
            const res = yield getPdfDimensionsInternal(pdfBuffer);
            const dimensions = {
                firstPageWidth: res.Pages[0].Width * PIXEL_CONVERT,
                firstPageHeight: res.Pages[0].Height * PIXEL_CONVERT,
                secondPageWidth: res.Pages[1].Width * PIXEL_CONVERT,
                secondPageHeight: res.Pages[1].Height * PIXEL_CONVERT,
                thirdPageWidth: res.Pages[2].Width * PIXEL_CONVERT,
                thirdPageHeight: res.Pages[2].Height * PIXEL_CONVERT,
            };
            response.body = dimensions;
            return response;
        }
        catch (err) {
            response.err = 'Failed to calc dimensions of the pdf';
            return response;
        }
    });
}
exports.getPdfDimensions = getPdfDimensions;
function cropImage(imageBase64, dimensions) {
    return new Promise((resolve, reject) => {
        const buffer = Buffer.from(imageBase64, 'base64');
        (0, gm_1.default)(buffer)
            .crop(dimensions.width, dimensions.height, dimensions.x, dimensions.y)
            .toBuffer(function (err, image) {
            if (err) {
                reject(err);
            }
            else {
                resolve({ base64: image.toString('base64') });
            }
        });
    });
}
exports.cropImage = cropImage;
function removeBackground(base64) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield (0, remove_bg_1.removeBackgroundFromImageBase64)({
                    base64img: base64,
                    apiKey: REMOVE_BG_API_KEY,
                    size: 'full',
                    type: 'auto',
                    position: 'center',
                });
                resolve({
                    parsed: true,
                    base64: result.base64img,
                });
            }
            catch (err) {
                reject(err);
            }
        }));
    });
}
exports.removeBackground = removeBackground;
function getImageResponse(image_base64, imageLocation, buffer = false) {
    const ImageResponse = {
        buffer: 'data:image/jpeg;base64,' + image_base64,
        uploadBuffer: buffer ? Buffer.from(image_base64, 'base64') : null,
        uploadDir: 'designs',
        ext: 'jpeg',
        location: imageLocation,
    };
    return ImageResponse;
}
exports.getImageResponse = getImageResponse;
/**
 * function to pass in order to render page data
 * @param pageData
 */
const render_page = (pageData) => {
    let render_options = {
        normalizeWhitespace: false,
        disableCombineTextItems: false,
    };
    return pageData
        .getTextContent(render_options)
        .then(function (textContent) {
        let lastY, text = '';
        for (let item of textContent.items) {
            if (lastY == item.transform[5] || !lastY) {
                text += item.str;
            }
            else {
                text += '\n' + item.str;
            }
            lastY = item.transform[5];
        }
        return text;
    });
};
const getPdfDimensionsInternal = (buffer) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const pdfParser = new pdf2json_1.default();
        try {
            pdfParser.parseBuffer(buffer);
            pdfParser.on('pdfParser_dataError', (errData) => reject(errData));
            pdfParser.on('pdfParser_dataReady', (pdfData) => {
                console.log('ready to calc hw of the pdf...');
                if (typeof pdfData !== 'object' ||
                    !('Pages' in pdfData) ||
                    !Array.isArray(pdfData.Pages)) {
                    reject({ err: 'error calculating HW of the pdf' });
                }
                resolve(pdfData);
            });
        }
        catch (err) {
            reject(err);
        }
    });
});
