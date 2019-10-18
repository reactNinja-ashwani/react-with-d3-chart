export const  fieldTypes = {
  any: {
    getId: v => v.toString(),
    getName: v => v.toString()
  },
  string: {
    getId: v => v,
    getName: v => v
  },
  number: {
    getId: v => v,
    getName: v => v
  },
  datetime: {
    getId: v => v.split("T")[0],
    getName: v => v.split("T")[0]
  },
  component: {
    getId: v => v.id,
    getName: v => v.name
  },
  version: {
    getId: v => v.id,
    getName: v => v.name
  },
  status: {
    getId: v => v.id,
    getName: v => v.name
  },
  resolution: {
    getId: v => v.id,
    getName: v => v.name
  },
  priority: {
    getId: v => v.id,
    getName: v => v.name
  },
  issuetype: {
    getId: v => v.id,
    getName: v => v.name
  },
  project: {
    getId: v => v.id,
    getName: v => v.name
  },
  user: {
    getId: v => v.key,
    getName: v => v.displayName
  },
  issuelinks: {
    getId: v => v.id,
    getName: v => v.id
  },
  parent: {
    getId: v => v.id,
    getName: v => v.key
  },
  option: {
    getId: v => v.id,
    getName: v => v.value
  },
  progress: {
    getId: v => v.progress,
    getName: v => v.progress
  },
  votes: {
    getId: v => v.votes,
    getName: v => v.votes
  },
  watches: {
    getId: v => v.watchCount,
    getName: v => v.watchCount
  }
};

/*
customfield_11040 - any - Rank"
customfield_13340 - array of option - Definition of Done"
fixVersions - array of version - Fix Version/s"
customfield_10180 - option - Reported by Customer"
priority - priority - Priority"
labels - array of string - Labels"
versions - array of version - Affects Version/s"
issuelinks - array of issuelinks - Linked Issues"
assignee - user - Assignee"
status - status - Status"
components - array of component - Component/s"
customfield_11540 - array of user - Request participants"
customfield_10843 - any - Global Rank"
creator - user - Creator"
subtasks - array of issuelinks - Sub-Tasks"
customfield_10161 - datetime - [Chart] Date of First Response"
reporter - user - Reporter"
aggregateprogress - progress - Σ Progress"
customfield_12740 - any - Approvals"
customfield_13548 - array of string - Affected components"
progress - progress - Progress"
votes - votes - Votes"
issuetype - issuetype - Issue Type"
project - project - Project"
customfield_13544 - array of string - Affected AWS Services"
workratio - number - Work Ratio"
watches - watches - Watchers"
customfield_14340 - option - GDPR Compliance"
created - datetime - Created"
customfield_10140 - option - Severity"
updated - datetime - Updated"
description - string - Description"
summary - string - Summary"
customfield_10240 - any - Rank (Obsolete)"
customfield_10241 - array of string - Sprint"
resolution - resolution - Resolution"
customfield_10222 - number - Story Points"
customfield_10163 - any - [Chart] Time in Status"
customfield_10840 - user - Pick a team member"
customfield_13140 - any - gitBranch"
customfield_13141 - any - gitCommitsReferenced"
resolutiondate - datetime - Resolved"
customfield_10021 - number - Points"
customfield_10740 - any - Epic Link"
customfield_10030 - string - Acceptance Criteria"
lastViewed - datetime - Last Viewed"
environment - string - Environment"
customfield_11140 - option - Customer"
customfield_10742 - option - Epic Status"
customfield_10743 - string - Epic Colour"
customfield_10741 - string - Epic Name"
*/


