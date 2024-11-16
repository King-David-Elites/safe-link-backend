"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundError = exports.errorHandler = exports.CustomError = void 0;
var CustomError = /** @class */ (function (_super) {
    __extends(CustomError, _super);
    function CustomError(code, message) {
        var _this = _super.call(this, message) || this;
        _this.code = code;
        _this.message = message;
        return _this;
    }
    return CustomError;
}(Error));
exports.CustomError = CustomError;
var errorHandler = function (error, req, res, next) {
    console.log(error);
    if (error instanceof CustomError) {
        return res.status(error.code).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
};
exports.errorHandler = errorHandler;
var notFoundError = function (req, res) {
    console.log(req.url);
    res.status(404).json({ error: 'Route does not exist' });
};
exports.notFoundError = notFoundError;
