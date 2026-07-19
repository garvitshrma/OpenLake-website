import type { AirtableProgram } from "./programs";

// One shared look for every fetched project card.

const CUSTOM_IMAGES: Record<string, string> = {
  "openlake-website": "/assets/openlake-website.png",
  "Student_Database_COSA": "/assets/cosa.png",
  "canonforces": "/assets/cannonforces.png",
  "Centre-for-Career-Planning-and-Services-Portal": "/assets/ccps.png",
  "RateMyCourse": "/assets/rate-my-course.png",
  "Campus-Marketplace": "/assets/buy-and-sell.png",
  "bhilaee-labs": "/assets/bhilaee-labs.png",
  "Leaderboard-Pro": "/assets/leaderboard-pro.png",
  "Smart-Insti-App": "/assets/insti-app.png",
  "WatchParty": "/assets/watchparty.png",
  "Knowledge-Sharing-Platform": "/assets/ksp.png",
  "iitbh-cgpa": "/assets/iitbh-cgpa.jpg",
  "Homework-Scheduler": "/assets/homework-scheduler.png",
  "SciTech_council_website": "/assets/scitech-website.png",
  "canonforces": "/assets/cannonforces.png",
  "canonforces": "/assets/cannonforces.png",
};


const CARD_THEME = {
  logoUrl: null,
  logoSize: 48,
  bgType: "color" as const,
  bgImageUrl: null,
  bgColor: "#0d2b26",
  textColor: "#e0fffa",
  accentColor: "#22d3ee",
  format: null,
  projectTypes: [],
  inPersonStart: null,
  inPersonEnd: null,
  inPersonLocation: null,
  additionalRequirements: null,
  slackChannel: null,
  buttonColor: "#22d3ee",
  buttonTextColor: "#04110f",
  buttonBorderRadius: 44,
  buttonBorderWidth: 0,
  buttonBorderColor: "#e0fffa",
};

type GitHubRepo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  created_at: string;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
};

function mapRepo(repo: GitHubRepo): AirtableProgram {
  const created = (repo.created_at ?? "").slice(0, 10) || "2020-01-01";
  const homepage = repo.homepage?.trim();
  return {
    id: String(repo.id),
    name: repo.name,
    startDate: created,
    endDate: repo.archived
      ? (repo.pushed_at ?? "").slice(0, 10) || created
      : "2099-12-31",
    websiteUrl: homepage ? homepage : repo.html_url,
    site: {
      description: repo.description ?? "An open-source project by OpenLake.",
      projectImageUrl:
        CUSTOM_IMAGES[repo.name] ??
        `https://opengraph.githubassets.com/1/OpenLake/${repo.name}`,
      projectImageHeight: 150,
      pinned: false,
      ...CARD_THEME,
    },
  } as unknown as AirtableProgram;
}

export async function fetchGitHubPrograms(): Promise<AirtableProgram[] | null> {
  try {
    const res = await fetch(
      "https://api.github.com/orgs/OpenLake/repos?per_page=100&sort=updated&direction=desc",
      {
        headers: {
          Accept: "application/vnd.github+json",
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return null;
    const repos: GitHubRepo[] = await res.json();
    return repos.filter((r) => !r.fork).map(mapRepo);
  } catch {
    return null;
  }
}