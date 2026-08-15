# AI Interview Preparation Platform

A simple and practical **AI-style Interview Preparation Platform** built to help students practice technical and HR interview questions in a more structured way.

The project provides different interview categories, timed interviews, answer evaluation, voice-based answering, interview history, and a results page.

## 👨‍💻 Developed By

**Deepak**
**Harman Sandhi**

## 🚀 Features

* 🔐 User Login & Signup
* 🎯 Multiple Interview Categories
* 📝 Interview Questions
* ⏱️ 15-minute Interview Timer
* 🎤 Voice Answer using Speech Recognition
* ✍️ Text-based Answers
* ✅ Automatic Answer Evaluation
* 🔄 Retry answers when the response is not relevant
* 🚫 Copy & Paste restrictions during interviews
* 📊 Interview Results
* 📚 Interview History
* 💾 Local Storage for interview data
* 🔥 Firebase Authentication
* 🌙 Dark Mode
* ☀️ Light Mode
* 📱 Responsive Design

## 📚 Interview Categories

The platform currently supports categories such as:

* HTML
* CSS
* JavaScript
* React
* Tailwind CSS
* Frontend
* Backend
* PHP
* Python
* Java
* C
* C#
* AI
* Machine Learning
* Deep Learning
* HR

## 🛠️ Technologies Used

* **React.js**
* **Vite**
* **JavaScript**
* **Tailwind CSS**
* **React Router**
* **Lucide React**
* **Firebase Authentication**
* **Firebase Firestore**
* **Chart.js**
* **Browser Speech Recognition API**
* **LocalStorage**

## ⚙️ How the Interview Works

1. Login to the platform.
2. Select an interview category.
3. Start the interview.
4. Answer the questions using text or voice.
5. Submit the answer for evaluation.
6. If the answer is not relevant, you can improve it and try again.
7. Once an answer is accepted, continue to the next question.
8. Complete all five questions.
9. Finish the interview.
10. View your result.

The platform does not show the internal keywords used for answer evaluation. They are used only by the evaluation system.

## ⏱️ Interview System

Each interview contains up to **5 questions** and has a **15-minute time limit**.

The system also keeps track of questions that have already been completed so that the same questions are not repeatedly shown during the interview cycle.

## 🎤 Voice Answer

The platform supports browser-based speech recognition.

Users can click **Start Recording**, speak their answer, and the recognized text is placed into the answer box.

> Speech recognition availability depends on the browser being used.

## 📊 Answer Evaluation

Answers are checked against the important concepts associated with each question.

The user only receives general feedback such as:

* Excellent answer
* Very good answer
* Good answer
* Answer needs more explanation
* Invalid answer

The internal evaluation keywords are not displayed to the user.

## 🔥 Firebase

Firebase is used mainly for:

* User authentication
* User identification
* Firestore backup/history where required

The application also uses **LocalStorage** for the main interview-related data.

## 💻 Installation

Clone the repository:

```bash
git clone https://github.com/YOUR-USERNAME/ai-interview-platform.git
```

Move into the project:

```bash
cd ai-interview-platform
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will then be available through the local development URL shown in the terminal.

## 📁 Project Structure

```text
ai-interview-platform/
│
├── public/
│
├── src/
│   ├── components/
│   ├── data/
│   │   └── questions/
│   ├── pages/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
├── vite.config.js
└── README.md
```

## 🎯 Purpose of the Project

This project was created as a practical learning project to work with **React.js, Firebase, browser APIs, local storage, routing, and responsive UI development**.

The main goal is to make interview practice easier for students by putting questions, answering, evaluation, timing, and results into one application.

## 👨‍🎓 Project Team

**Deepak**
**Harman Sandhi**

Built as a student project with a focus on learning, practice, and improving web development skills.

---

## 📌 Future Improvements

Some features that can be added later:

* More interview questions
* Better answer evaluation
* AI-generated interview questions
* More detailed performance analytics
* Interview difficulty levels
* Company-specific interview preparation
* Improved voice interaction
* More detailed interview reports

---

**Made by Deepak & Harman Sandhi**
