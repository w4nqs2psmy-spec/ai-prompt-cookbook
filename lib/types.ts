export type Subject =
  | 'math'
  | 'science'
  | 'languages'
  | 'history'
  | 'arts'
  | 'entrepreneurship'
  | 'computer_science'
  | 'general';

export type Level =
  | 'primary'
  | 'lower_secondary'
  | 'upper_secondary'
  | 'higher_education'
  | 'adult_education';

export type Tool = 'chatgpt' | 'claude' | 'gemini' | 'copilot' | 'any';

export type UseCase =
  | 'lesson_planning'
  | 'assessment'
  | 'differentiation'
  | 'feedback'
  | 'group_work'
  | 'creative_tasks'
  | 'research'
  | 'admin';

export type Prompt = {
  id: string;
  title: string;
  description: string;
  prompt_text: string;
  subject: Subject;
  level: Level;
  tool: Tool;
  use_case: UseCase;
  tags: string[];
  example_output?: string;
  tips?: string;
  is_pro: boolean;
  created_at: string;
  submitted_by?: string | null; // profile id, if contributed by a community member
  view_count?: number;
  copy_count?: number;
  like_count?: number;
  comment_count?: number;
};

export const SUBJECT_LABELS: Record<Subject, string> = {
  math: 'Matematiikka',
  science: 'Luonnontieteet',
  languages: 'Kielet',
  history: 'Historia',
  arts: 'Taiteet',
  entrepreneurship: 'Yrittäjyys',
  computer_science: 'Tietojenkäsittely',
  general: 'Yleinen',
};

export const LEVEL_LABELS: Record<Level, string> = {
  primary: 'Alakoulu',
  lower_secondary: 'Yläkoulu',
  upper_secondary: 'Lukio',
  higher_education: 'Korkea-aste',
  adult_education: 'Aikuiskoulutus',
};

export const TOOL_LABELS: Record<Tool, string> = {
  chatgpt: 'ChatGPT',
  claude: 'Claude',
  gemini: 'Gemini',
  copilot: 'Copilot',
  any: 'Mikä tahansa',
};

export const USE_CASE_LABELS: Record<UseCase, string> = {
  lesson_planning: 'Tuntisuunnittelu',
  assessment: 'Arviointi',
  differentiation: 'Eriyttäminen',
  feedback: 'Palaute',
  group_work: 'Ryhmätyö',
  creative_tasks: 'Luovat tehtävät',
  research: 'Tutkimus',
  admin: 'Hallinto',
};

/* ── Skills ──────────────────────────────────────────────────── */

export type SkillStep = {
  step_number: number;
  title: string;
  description: string;
  prompt_text: string;
};

export type Skill = {
  id: string;
  title: string;
  description: string;
  subject: Subject;
  level: Level;
  tool: Tool;
  use_case: UseCase;
  tags: string[];
  steps: SkillStep[];
  tips?: string;
  is_pro: boolean;
  is_approved: boolean;
  submitted_by?: string | null;
  created_at: string;
  view_count?: number;
  copy_count?: number;
  like_count?: number;
  comment_count?: number;
};

/* ── Codes ───────────────────────────────────────────────────── */

export type CodeLanguage =
  | 'javascript'
  | 'python'
  | 'sql'
  | 'html'
  | 'css'
  | 'java'
  | 'csharp'
  | 'cpp'
  | 'php'
  | 'ruby'
  | 'go'
  | 'rust'
  | 'typescript'
  | 'bash'
  | 'other';

export type Code = {
  id: string;
  title: string;
  code_text: string;
  code_language: CodeLanguage;
  description: string;
  subject: Subject;
  level: Level;
  tool: Tool;
  use_case: UseCase;
  tags: string[];
  is_pro: boolean;
  created_at: string;
  submitted_by?: string | null;
  view_count?: number;
  copy_count?: number;
  like_count?: number;
  comment_count?: number;
};

export const CODE_LANGUAGE_LABELS: Record<CodeLanguage, string> = {
  javascript: 'JavaScript',
  python: 'Python',
  sql: 'SQL',
  html: 'HTML',
  css: 'CSS',
  java: 'Java',
  csharp: 'C#',
  cpp: 'C++',
  php: 'PHP',
  ruby: 'Ruby',
  go: 'Go',
  rust: 'Rust',
  typescript: 'TypeScript',
  bash: 'Bash',
  other: 'Muu',
};

/* ── Tips ────────────────────────────────────────────────────── */

export type Tip = {
  id: string;
  title: string;
  tip_text: string;
  description: string;
  subject: Subject;
  level: Level;
  tool: Tool;
  use_case: UseCase;
  tags: string[];
  is_pro: boolean;
  created_at: string;
  submitted_by?: string | null;
  view_count?: number;
  copy_count?: number;
  like_count?: number;
  comment_count?: number;
};
