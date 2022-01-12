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
const ghcore = __importStar(require("@actions/core"));
const github_1 = require("./API/github");
async function run() {
    try {
        console.log("Start getting repository details");
        ghcore.debug("Getting github-api-token input");
        const token = ghcore.getInput('github-api-token');
        ghcore.debug("Getting issue-url input");
        const issueURL = ghcore.getInput('issue-url');
        let gh = new github_1.Github(token);
        let issue = gh.parseIssueURL(issueURL);
        let pr = await gh.getPullRequest(issue);
        let parsedPr = parseOctokitResponse(pr);
        let stringified = JSON.stringify(parsedPr);
        ghcore.setOutput('pull-request', JSON.stringify(stringified)); // Double stringify() to escape json string
    }
    catch (error) {
        if (error instanceof Error) {
            ghcore.debug(`error stack trace:\n${error.stack}`);
            ghcore.setFailed(error.message);
            return;
        }
        ghcore.setFailed("unknown error");
    }
}
function parseOctokitResponse(pr) {
    let base = pr.data.base;
    let head = pr.data.head;
    return {
        baseRef: base,
        headRef: head,
        body: pr.data.body,
        url: pr.data.url,
        number: pr.data.number,
        status: pr.data.state,
        title: pr.data.title,
        closed_at: pr.data.closed_at,
        created_at: pr.data.created_at,
        merged_at: pr.data.merged_at,
        updated_at: pr.data.updated_at
    };
}
run();
