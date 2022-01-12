"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Github = void 0;
const octokit_1 = require("octokit");
const ghcore = __importStar(require("@actions/core"));
class Github {
    constructor(token) {
        this.octokit = new octokit_1.Octokit({
            auth: token,
        });
    }
    parseIssueURL(issueURL) {
        ghcore.debug(`Parsing issue url: ${issueURL}`);
        let regex = /(api\.github\.com\/repos\/)[a-z0-9-]+\/[a-z0-9.\-_]+(\/issues\/)[0-9]+/gmi;
        if (!regex.test(issueURL)) {
            ghcore.debug("issueURL fails regex");
            throw new Error("invalid issue url");
        }
        issueURL = issueURL.slice(issueURL.indexOf("repos"));
        let split = issueURL.split('/');
        ghcore.debug(`Split issueURL: ${split}`);
        let parsed = {
            issueNumber: Number(split[4]),
            repository: split[2],
            username: split[1],
        };
        ghcore.debug(`Parsed: \n${JSON.stringify(parsed, null, 4)}`);
        return parsed;
    }
    async getPullRequest(issueURL) {
        return await this.octokit.rest.pulls.get({
            owner: issueURL.username,
            repo: issueURL.repository,
            pull_number: issueURL.issueNumber
        });
    }
}
exports.Github = Github;
