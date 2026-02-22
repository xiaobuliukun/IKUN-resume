import { NextRequest, NextResponse } from 'next/server';
import { createMockInterviewAgent } from '@/lib/aiLab/agents';
import { AIMessage, HumanMessage } from '@langchain/core/messages';

export async function POST(req: NextRequest) {
    try {
        const { messages, jd, resumeData, config } = await req.json();

        if (!jd || !resumeData) {
            return NextResponse.json(
                { error: 'Job description and resume data are required' },
                { status: 400 }
            );
        }

        const agentConfig = config || {};
        const agent = createMockInterviewAgent(agentConfig);

        // Convert messages to LangChain format
        // messages array is expected to be an array of { role: 'user' | 'ai', content: string }
        // The last message is the current user input, so we slice it off for history
        const history = (messages || []).slice(0, -1).map((msg: { role: string; content: string; }) => 
            msg.role === 'user' ? new HumanMessage(msg.content) : new AIMessage(msg.content)
        );
        
        // Get the last user message as input
        const lastMessage = (messages && messages.length > 0) ? messages[messages.length - 1] : null;
        const input = (lastMessage && lastMessage.role === 'user') ? lastMessage.content : "Start the interview.";

        const stream = await agent.stream({
            input: input,
            chat_history: history,
            resumeData: JSON.stringify(resumeData),
            jd: jd,
        });

        const encoder = new TextEncoder();

        const readableStream = new ReadableStream({
            async start(controller) {
                for await (const chunk of stream) {
                    const content = chunk.content;
                    if (typeof content === 'string') {
                        const data = { type: 'message_chunk', content };
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
                    }
                }
                controller.close();
            },
        });

        return new Response(readableStream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error: unknown) {
        console.error("Mock Interview Agent Error:", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return NextResponse.json(
            { error: 'An error occurred.', details: errorMessage },
            { status: 500 }
        );
    }
}
