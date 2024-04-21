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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBackClientImageDimensions = exports.getFrontClientImageDimensions = exports.getThirdPageImage = exports.getSecondPageImage = exports.getFirstPageImage = void 0;
const pdf2pic_1 = require("pdf2pic");
const BLUR_RATIO = 2;
const TO_BASE_64 = true;
const STICKER_PDF_HEIGHT = 1600;
const options = {
    format: 'jpeg',
    density: BLUR_RATIO * 48,
};
function convertToImage(pdfBase64, width, height, page_number) {
    return __awaiter(this, void 0, void 0, function* () {
        options.height = height;
        options.width = width;
        const imagePromise = (0, pdf2pic_1.fromBase64)(pdfBase64, options);
        const image = yield imagePromise(page_number, TO_BASE_64);
        return image.base64 ? image.base64 : '';
    });
}
function getFirstPageImage(pdfBase64, width, height) {
    return __awaiter(this, void 0, void 0, function* () {
        const page_number = 1;
        const firstPageImage = yield convertToImage(pdfBase64, width, height, page_number);
        if (firstPageImage == '') {
            throw new Error('error parsing first page image');
        }
        else {
            return firstPageImage;
        }
    });
}
exports.getFirstPageImage = getFirstPageImage;
function getSecondPageImage(pdfBase64, width, height) {
    return __awaiter(this, void 0, void 0, function* () {
        const page_number = 2;
        const secondPageImage = yield convertToImage(pdfBase64, width, height, page_number);
        if (secondPageImage == '') {
            throw new Error('error parsing second page image');
        }
        else {
            return secondPageImage;
        }
    });
}
exports.getSecondPageImage = getSecondPageImage;
function getThirdPageImage(pdfBase64, width, height) {
    return __awaiter(this, void 0, void 0, function* () {
        const page_number = 3;
        const thirdPageImage = yield convertToImage(pdfBase64, width, height, page_number);
        if (thirdPageImage == '') {
            throw new Error('error parsing third page image');
        }
        else {
            return thirdPageImage;
        }
    });
}
exports.getThirdPageImage = getThirdPageImage;
function getFrontClientImageDimensions(height) {
    let frontClientImageDimensions;
    if (height < STICKER_PDF_HEIGHT) {
        frontClientImageDimensions = {
            x: 130,
            y: 450,
            width: 730,
            height: 700,
        };
    }
    else {
        frontClientImageDimensions = {
            x: 130,
            y: 400,
            width: 730,
            height: 885,
        };
    }
    return frontClientImageDimensions;
}
exports.getFrontClientImageDimensions = getFrontClientImageDimensions;
function getBackClientImageDimensions(height) {
    let backClientImageDimensions;
    if (height < STICKER_PDF_HEIGHT) {
        backClientImageDimensions = {
            x: 850,
            y: 360,
            width: 730,
            height: 700,
        };
    }
    else {
        backClientImageDimensions = {
            x: 920,
            y: 400,
            width: 730,
            height: 885,
        };
    }
    return backClientImageDimensions;
}
exports.getBackClientImageDimensions = getBackClientImageDimensions;
