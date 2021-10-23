"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyRecords = exports.formatLink = exports.isFunction = exports.addProtocol = exports.hasHttpProtocol = void 0;
var is_absolute_url_1 = __importDefault(require("is-absolute-url"));
var hasHttpProtocol = function (protocol) {
    return protocol === 'http:' || protocol === 'https:';
};
exports.hasHttpProtocol = hasHttpProtocol;
var addProtocol = function (link) { return "http://" + link; };
exports.addProtocol = addProtocol;
var isFunction = function (value) { return typeof value === 'function'; };
exports.isFunction = isFunction;
var formatLink = function (rawLink) {
    var link = rawLink;
    // No protocol on the link, this can screw up url parsing with node url
    // so add a protocol and then parse.
    if (!(0, is_absolute_url_1.default)(link)) {
        link = (0, exports.addProtocol)(link);
    }
    var parsedLink = new URL(link);
    // The protocol the link has is non-http, therefore we give it a http based protocol.
    if (!(0, exports.hasHttpProtocol)(parsedLink.protocol)) {
        parsedLink.protocol = 'http:';
    }
    // Return the base link.
    return parsedLink.protocol + "//" + parsedLink.hostname;
};
exports.formatLink = formatLink;
/*
 * Calculates the number of records that apply for the
 * given path and the maximum specificity of all
 * the records which apply.
 */
var applyRecords = function (path, records) {
    var numApply = 0;
    var maxSpecificity = 0;
    for (var i = 0; i < records.length; i += 1) {
        var record = records[i];
        if (record.path.test(path)) {
            numApply += 1;
            if (record.specificity > maxSpecificity) {
                maxSpecificity = record.specificity;
            }
        }
    }
    return {
        numApply: numApply,
        maxSpecificity: maxSpecificity,
    };
};
exports.applyRecords = applyRecords;
