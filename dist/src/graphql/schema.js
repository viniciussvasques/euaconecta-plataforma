"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const schema_1 = require("@graphql-tools/schema");
const merge_1 = require("@graphql-tools/merge");
const userTypeDefs_1 = __importDefault(require("./typeDefs/userTypeDefs"));
const userResolver_1 = require("./resolvers/userResolver");
exports.schema = (0, schema_1.makeExecutableSchema)({
    typeDefs: (0, merge_1.mergeTypeDefs)([
        userTypeDefs_1.default,
    ]),
    resolvers: (0, merge_1.mergeResolvers)([
        userResolver_1.userResolver,
    ]),
});
//# sourceMappingURL=schema.js.map