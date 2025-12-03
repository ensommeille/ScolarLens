import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, Language } from "../types";

// Schema for structured extraction
const paperSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    markdown_report: {
      type: Type.STRING,
      description: "The complete, deeply analyzed content in Markdown format."
    },
    metadata: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        authors: { type: Type.ARRAY, items: { type: Type.STRING } },
        year: { type: Type.STRING },
        institution: { type: Type.STRING },
        keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
        summary: { type: Type.STRING, description: "A short summary under 150 words" },
        doi: { type: Type.STRING },
        folder: { type: Type.STRING, description: "Suggested category folder" }
      },
      required: ["title", "authors", "year", "keywords", "summary", "folder"]
    }
  },
  required: ["markdown_report", "metadata"]
};

export const analyzePdf = async (fileBase64: string, mimeType: string, language: Language): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const langInstruction = language === 'zh' 
    ? "OUTPUT MUST BE IN SIMPLIFIED CHINESE (简体中文)." 
    : "OUTPUT MUST BE IN ENGLISH.";

  const structureInstruction = language === 'zh'
    ? `
      Markdown 报告结构要求：
      # [论文标题]
      **基础信息**: 作者, 机构, 年份, DOI.
      
      # 摘要总结
      
      # 背景信息 (Background)
      (研究背景、待解决的问题)

      # 方法 (Methods)
      (核心算法、模型架构、实验设置)

      # 结果 (Results)
      (主要发现、核心图表解读、数据对比)

      # 结论 (Conclusion)
      (总结、创新点、局限性)
    `
    : `
      Markdown Report Structure:
      # [Paper Title]
      **Basic Info**: Authors, Institution, Year, DOI.
      
      # Abstract Summary
      
      # Background Info
      (Research context, Problem to solve)

      # Methods
      (Core algorithms, Model architecture, Setup)

      # Results
      (Key findings, Chart interpretation, Data comparison)

      # Conclusion
      (Summary, Innovations, Limitations)
    `;

  // Prompt engineering for deep analysis
  const systemPrompt = `
    You are a world-class Senior Researcher. Analyze this academic PDF.
    ${langInstruction}
    
    You must extract and generate a response with two parts:
    1. 'metadata': JSON data for indexing.
    2. 'markdown_report': A comprehensive Markdown report.

    ${structureInstruction}

    **Analysis Quality:**
    - Be objective and critical.
    - Identify hidden tricks in experimental setups.
    - Explain complex charts as if teaching a Ph.D. student.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: fileBase64
            }
          },
          {
            text: systemPrompt
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: paperSchema,
        temperature: 0.2,
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response from AI");

    const parsed = JSON.parse(resultText) as AnalysisResult;
    return parsed;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};
