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
exports.parsePdf = void 0;
const utility_1 = require("./utility");
const image_parser_1 = require("./image-parser");
const NEED_BUFFER = true;
function parsePdf(pdfBase64, needClientImages, needTransparentImages) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!pdfBase64) {
            return {
                statusCode: 400,
                body: JSON.stringify({ err: 'PDF not attached' }),
            };
        }
        const pdfQuality = yield (0, utility_1.checkPdfQuality)(pdfBase64);
        if (!pdfQuality.goodPdf) {
            return {
                statusCode: 400,
                body: JSON.stringify({ err: pdfQuality.err }),
            };
        }
        const dimensionsResult = yield (0, utility_1.getPdfDimensions)(pdfBase64);
        if (!dimensionsResult.body) {
            return {
                statusCode: 500,
                body: JSON.stringify(dimensionsResult.err),
            };
        }
        const dimensions = dimensionsResult.body;
        const responseObject = {
            frontImage: null,
            backImage: null,
            ntClientFrontImage: null,
            ntClientBackImage: null,
            tClientFrontImage: null,
            tClientBackImage: null,
        };
        const frontPageImage = yield (0, image_parser_1.getSecondPageImage)(pdfBase64, dimensions.secondPageWidth, dimensions.secondPageHeight);
        const backPageImage = yield (0, image_parser_1.getThirdPageImage)(pdfBase64, dimensions.thirdPageWidth, dimensions.thirdPageHeight);
        if (needClientImages) {
            console.log('parsing client images...');
            console.log('transparent : ' + needTransparentImages);
            const firstPageImage = yield (0, image_parser_1.getFirstPageImage)(pdfBase64, dimensions.firstPageWidth, dimensions.firstPageHeight);
            const frontClientImageDimensions = (0, image_parser_1.getFrontClientImageDimensions)(dimensions.firstPageHeight);
            const backClientImageDimensions = (0, image_parser_1.getBackClientImageDimensions)(dimensions.firstPageHeight);
            /** added front and back images to response */
            responseObject.frontImage = (0, utility_1.getImageResponse)(frontPageImage, 'front');
            responseObject.backImage = (0, utility_1.getImageResponse)(backPageImage, 'back');
            /** cropping client images from first page */
            try {
                /** non transparent client images */
                const ntClientFrontImage = yield (0, utility_1.cropImage)(firstPageImage, frontClientImageDimensions);
                const ntClientBackImage = yield (0, utility_1.cropImage)(firstPageImage, backClientImageDimensions);
                /** if transparent client images are required (for group orders) */
                if (needTransparentImages) {
                    console.log('parsing transparent client images...');
                    const tClientFrontImage = yield (0, utility_1.removeBackground)(ntClientFrontImage.base64);
                    const tClientBackImage = yield (0, utility_1.removeBackground)(ntClientBackImage.base64);
                    /** adding transparent client images to response */
                    responseObject.tClientFrontImage = (0, utility_1.getImageResponse)(tClientFrontImage.base64, 'front');
                    responseObject.tClientBackImage = (0, utility_1.getImageResponse)(tClientBackImage.base64, 'back');
                    console.log('parsed transparent client images...');
                }
                else {
                    /** adding non transparent client images to response */
                    responseObject.ntClientFrontImage = (0, utility_1.getImageResponse)(ntClientFrontImage.base64, 'front');
                    responseObject.ntClientBackImage = (0, utility_1.getImageResponse)(ntClientBackImage.base64, 'back');
                    console.log('parsed non transparent client images...');
                }
            }
            catch (err) {
                return {
                    statusCode: 500,
                    body: JSON.stringify({
                        err: err,
                    }),
                };
            }
        }
        else {
            console.log('parsing just the full front and back images...');
            /** added front & back image to response */
            responseObject.frontImage = (0, utility_1.getImageResponse)(frontPageImage, 'front', NEED_BUFFER);
            responseObject.backImage = (0, utility_1.getImageResponse)(backPageImage, 'back', NEED_BUFFER);
            console.log('done parsing just full front and back images...');
        }
        return {
            statusCode: 200,
            body: JSON.stringify(responseObject),
        };
    });
}
exports.parsePdf = parsePdf;
