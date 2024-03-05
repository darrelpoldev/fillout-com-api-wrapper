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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var axios_1 = __importDefault(require("axios"));
require("dotenv").config();
var app = (0, express_1.default)();
var PORT = 3000;
app.get("/", function (req, res) {
    res.status(200);
    res.send("Welcome to root URL of Server");
});
app.get("/:formId/filteredResponses", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var formId, filters, response, responseData, filteredResponses, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                formId = req.params.formId;
                filters = req.query.filters;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.get("https://api.fillout.com/v1/api/forms/".concat(formId, "/submissions"), {
                        headers: {
                            Authorization: "Bearer ".concat(process.env.AUTH_FILLOUT_TEST),
                        },
                    })];
            case 2:
                response = _a.sent();
                responseData = response.data;
                filteredResponses = applyFilters(responseData, filters);
                res.json(filteredResponses);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.log(error_1);
                res.status(500).send("Something happened!");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
function applyFilters(submissions, filters) {
    var parsedFilters = JSON.parse(filters);
    return submissions.responses.filter(function (response) {
        return parsedFilters.every(function (filter) {
            var question = response.questions.find(function (q) { return q.id === filter.id; });
            if (!question)
                return false; // Question not found, filter fails
            // Convert filter value to appropriate type if it's a number
            var filterValue = typeof filter.value === "string" && !isNaN(Number(filter.value))
                ? parseFloat(filter.value)
                : filter.value;
            // Convert question value to appropriate type if it's a number
            var questionValue = typeof question.value === "string" && !isNaN(Number(question.value))
                ? parseFloat(question.value)
                : question.value;
            if (questionValue === null)
                return false;
            switch (filter.condition) {
                case "equals":
                    return questionValue === filterValue;
                case "does_not_equal":
                    return questionValue !== filterValue;
                case "greater_than":
                    return questionValue > filterValue;
                case "less_than":
                    return questionValue < filterValue;
                default:
                    return false; // Invalid condition
            }
        });
    });
}
app.listen(PORT, function () {
    try {
        console.log("Server is Successfully Running, and App is listening on port " + PORT);
    }
    catch (error) {
        console.log("Error occurred, server can't start", error);
    }
});
