import { Endpoints } from "@octokit/types";
import { components } from "@octokit/openapi-types"

export type PullRequestResponse = Endpoints["GET /repos/{owner}/{repo}/pulls/{pull_number}"]["response"];

export type PullRequest = {
    headRef: Repository
    baseRef: Repository
    url: string
    number: number
    status: string
    title: string
    body: string | null
    created_at: string
    updated_at: string
    closed_at: string | null
    merged_at: string | null
}

export type Repository = components["schemas"]["pull-request-minimal"]