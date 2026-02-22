import { NextRequest, NextResponse } from 'next/server';
import { createCareerPathAgent } from '@/lib/aiLab/agents';

export async function POST(req: NextRequest) {
    try {
        const { resumeData, targetRole, config } = await req.json();

        if (!resumeData) {
            return NextResponse.json(
                { error: 'Resume data is required' },
                { status: 400 }
            );
        }

        const agent = createCareerPathAgent(config || {});

        const response = await agent.invoke({
            resumeData: JSON.stringify(resumeData),
            targetRole: targetRole || "Not specified, please infer",
        });

        const content = response.content;
        let jsonContent = '';

        if (typeof content === 'string') {
            // Robust JSON extraction: find the first '{' and the last '}'
            const firstBrace = content.indexOf('{');
            const lastBrace = content.lastIndexOf('}');
            
            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                jsonContent = content.substring(firstBrace, lastBrace + 1);
            } else {
                // Fallback: try to clean markdown code blocks if no clear JSON structure found
                jsonContent = content.replace(/```json\n?|\n?```/g, '').trim();
            }
        } else {
             // Handle non-string content (though unlikely for this agent)
             jsonContent = JSON.stringify(content);
        }

        try {
            const parsedData = JSON.parse(jsonContent);
            return NextResponse.json(parsedData);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            console.error("Raw Content:", content);
            console.error("Extracted Content:", jsonContent);
            
            return NextResponse.json(
                { 
                    error: 'Failed to parse AI response', 
                    rawContent: content,
                    extractedContent: jsonContent
                },
                { status: 500 }
            );
        }

    } catch (error: unknown) {
        console.error("Career Path Agent Error:", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return NextResponse.json(
            { error: 'An error occurred.', details: errorMessage },
            { status: 500 }
        );
    }
}
