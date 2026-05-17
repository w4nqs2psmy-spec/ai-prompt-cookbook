import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { Prompt } from '@/lib/types';

const DATA_FILE = path.join(process.cwd(), 'data/prompts.json');

function readPrompts(): Prompt[] {
  return JSON.parse(readFileSync(DATA_FILE, 'utf-8')) as Prompt[];
}

function writePrompts(prompts: Prompt[]): void {
  writeFileSync(DATA_FILE, JSON.stringify(prompts, null, 2), 'utf-8');
}

export async function GET() {
  const prompts = readPrompts();
  return NextResponse.json(prompts);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic server-side validation
    if (!body.title?.trim()) {
      return NextResponse.json({ error: 'Otsikko puuttuu' }, { status: 400 });
    }
    if (!body.description?.trim()) {
      return NextResponse.json({ error: 'Kuvaus puuttuu' }, { status: 400 });
    }
    if (!body.prompt_text?.trim()) {
      return NextResponse.json({ error: 'Promptiteksti puuttuu' }, { status: 400 });
    }

    const prompts = readPrompts();

    const newPrompt: Prompt = {
      id: randomUUID(),
      title: String(body.title).trim(),
      description: String(body.description).trim(),
      prompt_text: String(body.prompt_text).trim(),
      subject: body.subject ?? 'general',
      level: body.level ?? 'primary',
      tool: body.tool ?? 'any',
      use_case: body.use_case ?? 'lesson_planning',
      tags: Array.isArray(body.tags) ? body.tags : [],
      example_output: body.example_output?.trim() || undefined,
      tips: body.tips?.trim() || undefined,
      is_pro: Boolean(body.is_pro),
      created_at: new Date().toISOString().split('T')[0],
    };

    prompts.push(newPrompt);
    writePrompts(prompts);

    return NextResponse.json(newPrompt, { status: 201 });
  } catch (err) {
    console.error('[POST /api/prompts]', err);
    return NextResponse.json({ error: 'Sisäinen virhe' }, { status: 500 });
  }
}
