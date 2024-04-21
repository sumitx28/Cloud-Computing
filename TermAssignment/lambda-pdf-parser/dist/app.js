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
exports.handler = void 0;
const pdf_parser_lambda_1 = require("./api/pdf-parser-lambda");
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(event);
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'No body found',
                event: event,
            }),
        };
    }
    const requestBody = JSON.parse(event.body);
    const resultObject = (0, pdf_parser_lambda_1.parsePdf)(requestBody.base64, requestBody.needClientImages, requestBody.transparent);
    return resultObject;
});
exports.handler = handler;
