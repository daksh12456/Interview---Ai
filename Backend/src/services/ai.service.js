const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    if (!process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_GENAI_API_KEY === "YOUR_GEMINI_API_KEY" || process.env.GOOGLE_GENAI_API_KEY.trim() === "") {
        console.log("⚠️ Using mock report: No valid Gemini API key configured.");
        return {
            matchScore: 85,
            title: jobDescription ? jobDescription.split("\n")[0].substring(0, 30) : "Software Engineer",
            technicalQuestions: [
                {
                    question: "What is the difference between Virtual DOM and Real DOM in React?",
                    intention: "Test candidate's understanding of React rendering mechanics.",
                    answer: "Virtual DOM is a lightweight copy of the Real DOM. React uses it to batch updates and perform a diffing algorithm to update only the changed nodes in the Real DOM, which improves performance."
                },
                {
                    question: "How does Node.js handle asynchronous operations if JavaScript is single-threaded?",
                    intention: "Assess knowledge of the Node.js event loop and Libuv.",
                    answer: "Node.js offloads asynchronous tasks (like file I/O or network requests) to the system kernel or Libuv's thread pool. When the task is done, the callback is pushed to the event loop's queue to be executed on the main thread."
                }
            ],
            behavioralQuestions: [
                {
                    question: "Tell me about a time you had a conflict with a team member.",
                    intention: "Evaluate conflict resolution and communication skills.",
                    answer: "Describe the situation objectively using the STAR method. Focus on how you listened to their perspective, discussed solutions constructively, and reached a consensus that benefited the project."
                }
            ],
            skillGaps: [
                {
                    skill: "System Design",
                    severity: "medium"
                },
                {
                    skill: "TypeScript",
                    severity: "low"
                }
            ],
            preparationPlan: [
                {
                    day: 1,
                    focus: "React & Frontend Basics",
                    tasks: [
                        "Review React hooks lifecycle",
                        "Practice custom hooks implementation",
                        "Read about web performance optimization techniques"
                    ]
                },
                {
                    day: 2,
                    focus: "System Design & Databases",
                    tasks: [
                        "Study horizontal vs vertical scaling",
                        "Review SQL vs NoSQL trade-offs",
                        "Design a simple URL shortener architecture"
                    ]
                }
            ]
        }
    }

    const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
`

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
        }
    })

    return JSON.parse(response.text)


}



async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    if (!process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_GENAI_API_KEY === "YOUR_GEMINI_API_KEY" || process.env.GOOGLE_GENAI_API_KEY.trim() === "") {
        console.log("⚠️ Using mock resume HTML: No valid Gemini API key configured.");
        const mockHtml = `
        <!DOCTYPE html>
        <html>
        <head>
        <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; padding: 40px; color: #333; }
        h1 { color: #2563eb; margin-bottom: 5px; font-size: 28px; }
        h2 { border-bottom: 2px solid #e2e8f0; padding-bottom: 5px; margin-top: 25px; color: #1e293b; font-size: 20px; }
        .contact { font-style: italic; color: #64748b; margin-bottom: 25px; font-size: 14px; }
        .job { margin-bottom: 20px; }
        .job-title { font-weight: bold; color: #0f172a; font-size: 16px; }
        .job-meta { color: #64748b; font-size: 14px; margin-bottom: 5px; }
        ul { margin-top: 5px; padding-left: 20px; }
        li { margin-bottom: 5px; }
        </style>
        </head>
        <body>
        <h1>John Doe</h1>
        <div class="contact">Email: john.doe@example.com | Phone: (123) 456-7890 | LinkedIn: linkedin.com/in/johndoe</div>
        <h2>Professional Summary</h2>
        <p>A driven Software Engineer with experience in building scalable frontend applications with React and high-performance server-side microservices with Node.js. Passionate about optimization, clean code patterns, and collaborative problem-solving.</p>
        <h2>Experience</h2>
        <div class="job">
        <div class="job-title">Software Engineer</div>
        <div class="job-meta">Tech Innovations Inc. | 2024 - Present</div>
        <ul>
        <li>Collaborated on building a modular React dashboards system used by over 50,000 active users daily.</li>
        <li>Refactored legacy REST endpoints in Node.js to improve API response latency by 20%.</li>
        </ul>
        </div>
        <h2>Technical Skills</h2>
        <p><strong>Languages:</strong> JavaScript (ES6+), TypeScript, HTML5, CSS3, SQL</p>
        <p><strong>Frameworks & Tools:</strong> React.js, Node.js, Express, Git, MongoDB, Docker</p>
        </body>
        </html>
        `;
        const pdfBuffer = await generatePdfFromHtml(mockHtml)
        return pdfBuffer
    }

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })


    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}

module.exports = { generateInterviewReport, generateResumePdf }