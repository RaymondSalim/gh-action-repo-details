import * as ghcore from'@actions/core';
import {Github} from "./API/github";
import {OctokitResponse} from "@octokit/types";
import {PullRequest, Ref} from "./API/types";

async function run() {
    try {
        console.log("Start getting repository details");

        ghcore.debug("Getting github-api-token input");
        const token = ghcore.getInput('github-api-token');
        ghcore.debug("Getting issue-url input");
        const issueURL = ghcore.getInput('issue-url');

        let gh = new Github(token);
        let issue = gh.parseIssueURL(issueURL);
        let pr = await gh.getPullRequest(issue);
        let parsedPr = parseOctokitResponse(pr);

        setOutput(parsedPr)

    } catch (error) {
        if (error instanceof Error) {
            ghcore.debug(`error stack trace:\n${error.stack}`);
            ghcore.setFailed(error.message);
            return;
        }

        ghcore.setFailed("unknown error");
    }
}

function parseOctokitResponse(pr: OctokitResponse<any>): PullRequest{
    let base = pr.data.base as unknown as Ref;
    let head = pr.data.head as unknown as Ref;
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
    }
}

function setOutput(pr: PullRequest) {
    ghcore.setOutput("baseRef", pr.baseRef.ref);
    ghcore.setOutput("headRef", pr.headRef.ref);
    ghcore.setOutput("body", pr.body);
    ghcore.setOutput("url", pr.url);
    ghcore.setOutput("number", pr.number);
    ghcore.setOutput("status", pr.status);
    ghcore.setOutput("title", pr.title);
    ghcore.setOutput("closed_at", pr.closed_at);
    ghcore.setOutput("created_at", pr.created_at);
    ghcore.setOutput("merged_at", pr.merged_at);
    ghcore.setOutput("updated_at", pr.updated_at);
}

run();