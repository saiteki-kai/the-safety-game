// Hero Section

export interface HeroHighlight {
	emoji: string;
	title: string;
	description: string;
}

export interface HeroContent {
	title: string;
	description: string;
	cta: string;
	buttonText: string;
	buttonLink: string;
	highlights: readonly HeroHighlight[];
}

// Safety Game Section

export interface SafetyGameParagraph {
	content: string;
	emphasis?: boolean;
}

export interface ChallengeContent {
	title: string;
	description: string;
	introduction: SafetyGameParagraph[];
	challenge: string;
	participation: string;
}

// Leaderboard Section

export interface LeaderboardDataTeam {
	rank: number;
	teamName: string;
	score: number;
	members: number;
	lastUpdated: string;
}

export interface LeaderboardContent {
	title: string;
	description: string;
	emptyMessage: string;
}

// Team Section

export interface TeamMember {
	name: string;
	role: string;
	bio: string;
	image: string;
	email: string;
}

export interface TeamContent {
	title: string;
	description: string;
	members: TeamMember[];
}

// Participation Section

export interface Step {
	step: string;
	title: string;
	description: string;
}

export interface ParticipationContent {
	title: string;
	intro: string;
	steps: Step[];
}

export interface ParticipationRegistration {
	formUrl?: string;
	fields?: string[];
}

export interface ParticipationSubmission {
	howItWorks?: string;
	limits?: string[];
	warning?: string;
}

export interface ParticipationEvaluation {
	overview?: string;
	scoring?: string;
}

// Extend participation content with optional registration/submission/evaluation details
export interface ParticipationContentExtended extends ParticipationContent {
	registration?: ParticipationRegistration;
	submission?: ParticipationSubmission;
	evaluation?: ParticipationEvaluation;
}

// Timeline Section

export type TimelineStatus = "completed" | "upcoming";

export interface TimelineEntry {
	date: string;
	time?: string;
	title: string;
	description: string;
	status: TimelineStatus;
}

export interface TimelineContent {
	title: string;
	timeline: TimelineEntry[];
}

// Instructions Section

export type InstructionCardVariant = "objective" | "positive" | "negative" | "warning";

export interface InstructionCard {
	variant: InstructionCardVariant;
	title: string;
	description?: string;
	items?: string[];
}

export type InstructionExampleVariant = "valid" | "invalid" | "mixed";

export interface InstructionExamplePrompt {
	label: string;
	prompt: string;
	note?: string;
}

export interface InstructionExampleGroup {
	variant: InstructionExampleVariant;
	title: string;
	description?: string;
	prompts: InstructionExamplePrompt[];
}

export interface InstructionsContent {
	title: string;
	intro: string;
	cards: InstructionCard[];
	exampleGroups: InstructionExampleGroup[];
}

// Playground Section

export interface PlaygroundContent {
	title: string;
	description: string;
	huggingFaceSpace: string;
}

// FAQ Section

export interface Faq {
	question: string;
	answer: string;
}

export interface FaqContent {
	title: string;
	description: string;
	items: Faq[];
}

// Website Content

export interface WebsiteContent {
	home: HeroContent;
	leaderboard: LeaderboardContent;
	team: TeamContent;
	participation: ParticipationContentExtended;
	dates: TimelineContent;
	instructions: InstructionsContent;
	playground: PlaygroundContent;
	faqs: FaqContent;
	challenge: ChallengeContent;
}
