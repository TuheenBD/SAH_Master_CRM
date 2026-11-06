import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ARIELMC_CRM_SYSTEM_INSTRUCTION = `You are the executive AI Co-founder & CRM Operations Partner embedded directly inside Master-CRM (ArielMC Strategic Accounts & Buyer Intelligence System).
Your user and partner is Syed Akramul Hassan, Managing Director & Founder of Ariel Marketing & Communications Limited (ArielMC).

### Core Brand & Communication Guidelines:
- Brand Name: Always write exactly as "ArielMC" (capital A, lowercase riel, capital M, capital C, NO space). Never write "Ariel MC" or "arielmc".
- Persona: You are an intelligent, warm, highly skilled, strategic, and proactive executive peer. Call the user "Partner" or "Syed". Speak naturally, conversationally, and with genuine insight. Avoid robotic cards or rigid templates. Be concise, direct, helpful, and solution-driven.
- Language: English (fluent, professional international commerce tone).

### Master-CRM Domains & Operational Capabilities:
1. **Strategic Buyer Accounts & Pipelines**: Managing buyer leads from USA, UK, EU, Japan, and Middle East across our 5 canonical divisions.
2. **Sample Management (SOP-B2B-SMP-2026-V1)**: 5-9 business day DHL counter-sample dispatch; sample fees 100% credited back on the buyer's first bulk order.
3. **LDC Graduation Extension to Nov 24, 2029**: 0% duty-free tariff access to UK (DCTS) and EU (EBA) markets. Use this as a major selling point for buyer diversification.
4. **Official Energy Entity**: Ariel Renewable Energy Limited (energy.arielmc.com) for Turnkey Commercial & Industrial (C&I) Rooftop Solar EPC and SREDA Net-Metering.
5. **Mandatory Ecosystem Sequence**: 1. ERP -> 2. CRM -> 3. Catalog -> 4. Website.

### Guidelines for Answering:
- Provide polished, ready-to-send buyer emails, quote summaries, follow-up strategies, and pipeline insights.
- Keep answers clean, beautifully formatted in conversational markdown.
`;

async function queryOllama(
  systemPrompt: string,
  rawMessages: Array<{ sender?: string; role?: string; text?: string; content?: string }>,
  requestedModel?: string
): Promise<{ success: boolean; reply?: string; model?: string; error?: string }> {
  try {
    const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';

    const tagsRes = await fetch(`${OLLAMA_HOST}/api/tags`, {
      signal: AbortSignal.timeout(5000)
    });

    if (!tagsRes.ok) {
      return { success: false, error: `Ollama status ${tagsRes.status}` };
    }

    const tagsData = await tagsRes.json();
    const installedModels: string[] = Array.isArray(tagsData?.models)
      ? tagsData.models.map((m: any) => m.name || m.model).filter(Boolean)
      : [];

    if (installedModels.length === 0) {
      return { success: false, error: 'Ollama is running, but no local models are installed.' };
    }

    let targetModel = '';
    if (requestedModel && installedModels.some(m => m.toLowerCase().includes(requestedModel.toLowerCase()))) {
      targetModel = installedModels.find(m => m.toLowerCase().includes(requestedModel.toLowerCase()))!;
    } else {
      const priority = ['hermes3', 'hermes', 'llama3.1', 'qwen2.5-coder', 'deepseek-coder-v2', 'phi4', 'gemma2'];
      for (const p of priority) {
        const found = installedModels.find(m => m.toLowerCase().includes(p));
        if (found) {
          targetModel = found;
          break;
        }
      }
      if (!targetModel) targetModel = installedModels[0];
    }

    console.log(`[ArielMC CRM AI Chat] Routing to local Ollama model: ${targetModel}`);

    const ollamaMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt }
    ];

    rawMessages.forEach((m) => {
      const text = (m.text || m.content || '').trim();
      if (!text) return;
      const role: 'user' | 'assistant' = (m.sender === 'user' || m.role === 'user') ? 'user' : 'assistant';
      ollamaMessages.push({ role, content: text });
    });

    const chatRes = await fetch(`${OLLAMA_HOST}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: targetModel,
        messages: ollamaMessages,
        stream: false,
        options: {
          temperature: 0.7,
          num_ctx: 8192,
        }
      }),
      signal: AbortSignal.timeout(90000)
    });

    if (!chatRes.ok) {
      const errText = await chatRes.text().catch(() => '');
      return { success: false, error: `Ollama execution error (${chatRes.status}): ${errText}` };
    }

    const chatData = await chatRes.json();
    const reply = chatData?.message?.content;
    if (!reply) {
      return { success: false, error: 'Empty response received from Ollama model.' };
    }

    return {
      success: true,
      reply: reply.trim(),
      model: targetModel
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed connecting to local Ollama instance.' };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, userApiKey, clientContext, provider, model: requestedModel } = body;

    const apiKey =
      (userApiKey ||
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY || '')
      .trim();

    const systemPromptWithContext = `${ARIELMC_CRM_SYSTEM_INSTRUCTION}\n\n### Current CRM Session Context:\n- Station: ${clientContext?.station || 'ArielMC Strategic Accounts Command'}\n- Date/Time: ${new Date().toISOString()}`;

    // STEP 1: Attempt local Ollama execution
    if (provider !== 'gemini') {
      const ollamaResult = await queryOllama(systemPromptWithContext, messages || [], requestedModel);
      if (ollamaResult.success && ollamaResult.reply) {
        return NextResponse.json({
          success: true,
          reply: ollamaResult.reply,
          provider: 'ollama',
          model: ollamaResult.model,
          isLocal: true
        });
      }
    }

    // STEP 2: Fallback to Google Gemini Cloud API if API key is present
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'NO_AI_ENGINE',
          message: 'Local Ollama engine is not currently running and no Google Gemini API key is configured.'
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      reply: 'Gemini fallback ready',
      provider: 'google-gemini'
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error'
      },
      { status: 500 }
    );
  }
}
