import { Octokit } from "octokit";
import { PullRequestResponse } from "./types";
import * as ghcore from'@actions/core';


export class Github {
    octokit: Octokit

    constructor(token: string) {
       this.octokit = new Octokit({
           auth: token,
       })
    }

    parseIssueURL(issueURL: string): ParsedIssueURL {
        ghcore.debug(`Parsing issue url: ${issueURL}`);
        let regex = /(api\.github\.com\/repos\/)[a-z0-9-]+\/[a-z0-9.\-_]+(\/issues\/)[0-9]+/gmi;

        if (!regex.test(issueURL)) {
            ghcore.debug("issueURL fails regex");
            throw new Error("invalid issue url");
        }
        issueURL = issueURL.slice(issueURL.indexOf("repos"))
        let split = issueURL.split('/');
        ghcore.debug(`Split issueURL: ${split}`)

        let parsed = {
            issueNumber: Number(split[4]),
            repository: split[2],
            username: split[1],
        }
        ghcore.debug(`Parsed: \n${JSON.stringify(parsed, null, 4)}`)
        return parsed;
    }

    async getPullRequest(issueURL: ParsedIssueURL): Promise<PullRequestResponse> {
        return await this.octokit.rest.pulls.get({
            owner: issueURL.username,
            repo: issueURL.repository,
            pull_number: issueURL.issueNumber
        })
    }
}

export interface ParsedIssueURL {
    username: string;
    repository: string;
    issueNumber: number;
}