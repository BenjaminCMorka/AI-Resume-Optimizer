import os
import io
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential
from openai import OpenAI
from dotenv import load_dotenv
import traceback

load_dotenv()  

FORM_RECOGNIZER_ENDPOINT = os.getenv("FORM_RECOGNIZER_ENDPOINT")
FORM_RECOGNIZER_KEY = os.getenv("FORM_RECOGNIZER_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


form_recognizer_client = DocumentAnalysisClient(
    endpoint=FORM_RECOGNIZER_ENDPOINT,
    credential=AzureKeyCredential(FORM_RECOGNIZER_KEY)
)


client = OpenAI(api_key=OPENAI_API_KEY)

app = FastAPI(title="Resume Feedback API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_text_from_pdf(file_bytes: bytes) -> str:
    stream = io.BytesIO(file_bytes)  
    poller = form_recognizer_client.begin_analyze_document(
        "prebuilt-layout", document=stream
    )
    result = poller.result()

    lines = []
    for page in result.pages:
        for line in page.lines:
            lines.append(line.content)
    return "\n".join(lines)

def generate_feedback(resume_text: str, job_description: str) -> str:
    prompt = f"""
    I have this resume text:
    {resume_text}

    And this job description:
    {job_description}

    Please provide constructive feedback on what skills or experiences could be added or highlighted to better match the job description.
    """

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=300,
        temperature=0.7,
    )
    return response.choices[0].message.content

@app.post("/feedback")
async def get_resume_feedback(
    job_description: str = Form(...),
    file: UploadFile = File(...)
):
    try:
        file_bytes = await file.read()
        resume_text = extract_text_from_pdf(file_bytes)
        feedback = generate_feedback(resume_text, job_description)
        return JSONResponse({"feedback": feedback})
    except Exception as e:
        print("Error details:")
        traceback.print_exc()  
        return JSONResponse({"error": str(e)}, status_code=500)

print("Form Recognizer Endpoint:", FORM_RECOGNIZER_ENDPOINT)
print("Form Recognizer Key:", FORM_RECOGNIZER_KEY is not None)
print("OpenAI Key:", OPENAI_API_KEY is not None)
