"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
exports.__esModule = true;
var electron_1 = require("electron");
var main_1 = require("./main");
var methods_1 = require("../Methods/methods");
var node_hue_api_1 = require("node-hue-api");
exports.LightListeners = function () {
    var state = node_hue_api_1.lightState.create();
    electron_1.ipcMain.on('give-lights', function (evt) { return __awaiter(_this, void 0, void 0, function () {
        var lightData, lights, payload, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, main_1.HueBridge.lights()];
                case 1:
                    lightData = _a.sent();
                    lights = lightData.lights;
                    payload = lights.map(function (item) {
                        var state = item.state;
                        var rgb = item.state.xy ? methods_1.xyBriToRgb(state.xy[0], state.xy[1], item.state.bri) : null;
                        return {
                            id: parseInt(item.id),
                            name: item.name,
                            state: item.state,
                            rgb: rgb,
                            type: item.type
                        };
                    }).reduce(function (obj, item) {
                        obj[item.id] = item;
                        return obj;
                    }, {});
                    evt.reply('light-data', payload);
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    console.log(err_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    electron_1.ipcMain.on('color-change', function (e, p) {
        var _a = methods_1.RGBtoXY(p.data[0], p.data[1], p.data[2]), x = _a[0], y = _a[1];
        main_1.HueBridge.setLightState(p.id, state.xy(x, y));
    });
    electron_1.ipcMain.on('brightness-change', function (e, p) {
        main_1.HueBridge.setLightState(p.id, state.bri(p.data));
    });
    electron_1.ipcMain.on('power-change', function (e, p) {
        main_1.HueBridge.setLightState(p.id, p.data ? state.turnOff() : state.turnOn());
    });
};
