import * as ghcore from'@actions/core';
import {Github} from "./API/github";
import {OctokitResponse} from "@octokit/types";
import {PullRequest, Repository} from "./API/types";

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
        ghcore.setOutput('pull-request', parsedPr);

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
    let base = pr.data.base as unknown as Repository;
    let head = pr.data.head as unknown as Repository;
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

run();