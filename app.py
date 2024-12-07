import os
from flask import Flask, request, jsonify, render_template
from groq import Groq

# Initialize Flask app
app = Flask(__name__)

# Set up Groq client
client = Groq(api_key='gsk_WZLggSCtO8HaCZt5QlMgWGdyb3FYO9BSkOAJafQvxX8Rx5jaJWM6import')

# Home route
@app.route("/")
def home():
    return render_template("chatbot.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")
    if not user_message:
        return jsonify({"error": "Message is required"}), 400

    # Set system prompt for general conversation
    system_message = "Provide helpful and accurate answers to the user's queries. Do not provide responses unrelated to the topic."
    
    messages = [{"role": "system", "content": system_message}]
    messages.append({"role": "user", "content": user_message})

    try:
        # Call Groq API for chat completions
        chat_completion = client.chat.completions.create(
            messages=messages,
            model="llama3-70b-8192",  # Using Llama model, adjust as needed
        )
        bot_reply = chat_completion.choices[0].message.content
        return jsonify({"response": bot_reply})

    except Exception as e:
        return jsonify({"error": "Failed to get a response", "details": str(e)}), 500

# Mock Interview route
@app.route("/mock_interview")
def mock_interview():
    return render_template("mock_interview.html")

@app.route("/mock-interview/questions", methods=["POST"])
def generate_questions():
    job_description = request.json.get("description")
    if not job_description:
        return jsonify({"error": "Job description is required"}), 400

    # Use Groq AI to generate mock interview questions based on the job description
    try:
        system_message = f"Generate a list of 10 mock interview questions for a job description related to {job_description}. Focus on behavioral and technical questions, dont write headers and additional info just give points numberd 1 to 10"
        messages = [{"role": "system", "content": system_message}]
        messages.append({"role": "user", "content": job_description})

        # Get AI-generated questions
        interview_questions = client.chat.completions.create(
            messages=messages,
            model="llama3-70b-8192"
        )
        
        questions = interview_questions.choices[0].message.content.split("\n")
        return jsonify({"questions": questions})

    except Exception as e:
        print(job_description)  
        return jsonify({"error": "Failed to generate questions", "details": str(e)}), 500

# Mock Interview Evaluate route
@app.route("/mock-interview/evaluate", methods=["POST"])
def submit_answer():
    print('hello')
    question = request.json.get("question")
    answer = request.json.get("answer")
    if not question or not answer:
        return jsonify({"error": "Question and answer are required"}), 400

    # Use Groq AI to evaluate the answer
    try:
        system_message = f"Evaluate the following interview answer to the question: '{question}'. Provide constructive feedback for improvement."
        messages = [{"role": "system", "content": system_message}]
        messages.append({"role": "user", "content": answer})

        # Get AI-generated feedback
        feedback_response = client.chat.completions.create(
            messages=messages,
            model="llama3-70b-8192"
        )
        
        feedback = feedback_response.choices[0].message.content
        return jsonify({"feedback": feedback})

    except Exception as e:
        return jsonify({"error": "Failed to evaluate answer", "details": str(e)}), 500

# Roadmap route
@app.route("/roadmap")
def roadmap():
    return render_template("roadmap.html")

@app.route("/roadmap/generate", methods=["POST"])
def generate_roadmap():
    goals = request.json.get("goals")
    if not goals:
        return jsonify({"error": "Goals are required"}), 400

    # Use Groq AI to generate a step-by-step roadmap based on the user's goals
    try:
        system_message = f"Generate a short 5 point step-by-step roadmap to achieve the goal: '{goals}'.keep the response within 100 words and only give 5 points andd not their description    "
        messages = [{"role": "system", "content": system_message}]
        messages.append({"role": "user", "content": goals})

        # Get AI-generated steps
        roadmap_response = client.chat.completions.create(
            messages=messages,
            model="llama3-70b-8192"
        )
        
        steps = roadmap_response.choices[0].message.content.split("\n")
        print(steps)
        return jsonify({"steps": steps})

    except Exception as e:
        return jsonify({"error": "Failed to generate roadmap", "details": str(e)}), 500

# Resume Review route
@app.route("/resume_review", methods=["GET", "POST"])
def resume_review():
    if request.method == "POST":
        resume_file = request.files.get("resume")
        if not resume_file:
            return jsonify({"error": "No file uploaded"}), 400

        # Simulate processing the resume using Groq AI
        try:
            system_message = "Review the uploaded resume and provide detailed feedback on its structure, content, and areas of improvement."
            messages = [{"role": "system", "content": system_message}]
            messages.append({"role": "user", "content": "Review my resume"})

            # Simulate AI feedback on the resume
            resume_feedback_response = client.chat.completions.create(
                messages=messages,
                model="llama3-70b-8192"
            )
            
            feedback = resume_feedback_response.choices[0].message.content
            return jsonify({"feedback": feedback})

        except Exception as e:
            return jsonify({"error": "Failed to review resume", "details": str(e)}), 500

    return render_template("resume_review.html")

if __name__ == "__main__":
    app.run(debug=True)
