# LegalMind: AI-Powered Legal Document Analysis & Safety Agent - Full Project Documentation

## 1. System Overview & Agentic Architecture
LegalMind is an autonomous AI agent designed for processing, classifying, and auditing complex legal contracts. Unlike a basic static pipeline, it functions as an autonomous, self-governing entity that routes decisions based on confidence, enforces robust privacy rules, and uses Active Learning from Human-In-The-Loop (HITL) interactions.

**Key capabilities:**
- **Autonomous Perception:** Uses PyMuPDF and OpenCV for layout parsing, noise filtering, and Tesseract for targeted OCR.
- **Introspective Decision Routing:** Uses a confidence threshold to automatically process high-confidence clauses while routing low-confidence outputs to human experts.
- **Trust & Safety Middleware:** Uses neural NER (Named Entity Recognition via spaCy) to redact sensitive data (PII) before analysis, and calculates an absolute privacy score. Includes algorithmic fairness audits to track disparities in clause classification.
- **Active Learning:** Logs expert corrections into a MongoDB database to retrain the underlying `legal-bert` neural classifier.

**Tech Stack:**
- **Frontend:** React 18, Tailwind CSS, Recharts, React Router v6.
- **Backend:** Node.js, Express, MongoDB (Mongoose schemas), express-rate-limit, Helmet.
- **AI/ML:** Python (3.8+), PyTorch, Hugging Face Transformers (`nlpaueb/legal-bert-base-uncased`), spaCy (`en_core_web_lg`), OpenCV, Fairlearn, scikit-learn.

---

## 2. Directory Structure & File Index

The project is structured into three main directories, with a clear separation of concerns.

### `/backend`
- `server.js`: The central Express application entry point.
- `setup_trust_safety.py`: An extensive automation script that sets up the AI environment, creates sample datasets, downloads NLP models, and generates configuration JSONs and helper Python scripts.
- `/models`: Mongoose database schemas (e.g., `Document.js`).
- `/routes`: Express route handlers (`analysis.js`, `documents.js`, `evaluation.js`, `trust_safety.js`).
- `/services`: Core business logic for text extraction, layout processing, and XAI analytics (`batchTextExtractor.js`, `documentAnalyzer.js`, `documentNoiseFilter.js`, `enhancedDocumentAnalyzer.js`, `layoutAwareFilter.js`, `textExtractor.js`, `xaiAnalyzer.js`, `compression.js`).
- `/ai`: Python scripts for neural inference and safety audits (`accountability_classifier.py`, `accountability_system.py`, `bert_clause_classifier.py`, `cuad_fine_tuner.py`, `evaluate.py`, `fairness_audit_runner.py`, `fairness_auditor.py`, `feedback_collector.py`, `feedback_summary.py`, `health_check.py`, `layout_aware_processor.py`, `pii_redactor.py`, `privacy_protection.py`, `privacy_stats.py`).

### `/frontend`
- `/src/App.js`: Core React Router configuration and layout.
- `/src/index.js` & `/src/index.css`: Application entry and global Tailwind configuration.
- `/src/pages`: Main application views (`Dashboard.js`, `Upload.js`, `DocumentView.js`, `Analysis.js`, `TrustSafety.js`).
- `/src/components`: Reusable UI (`Navbar.js`, `ErrorBoundary.js`, `LoadingSpinner.js`, `ModelEvaluation.js`).
- `/src/services/api.js`: Axios configuration for backend communication.

### `/docs`
- `contribution_log.txt`: Contains logs and metadata related to repository history and development milestones.

---

## 3. Deep Dive: Backend Node.js Architecture

### 3.1 `backend/server.js`
The Node server configures strict security, high-payload parsers, and API route definitions:
- **Security:** Helmet for HTTP headers, CORS restricted to `CLIENT_URL`, express-rate-limit for abuse prevention.
- **Body Parsing:** High limit (50MB) JSON and URL-encoded parsers to support large batch documents and PDFs.
- **Routes Exposed:** 
  - `/api/documents`: For file uploads and fetching extracted text.
  - `/api/analysis`: For triggering Legal-BERT analysis and clause identification.
  - `/api/evaluation`: For XAI and model metrics.
  - `/api/trust-safety`: The dedicated Trust & Safety endpoints.
- **Database:** Standard Mongoose connection lifecycle, connected to MongoDB. 

### 3.2 `backend/models/Document.js`
The core database model representing a processed legal file.
- **Properties:** Includes file metadata (size, mimeType, name, page count).
- **Batch Support:** Added `batchName` and `individualFiles` metadata to support processing multiple documents simultaneously.
- **Analysis Storage:** Stores an array of identified `clauses` (e.g., *termination*, *liability*, *payment*, *intellectual_property*).
  - Each clause records the raw `text`, `startIndex`, `endIndex`, `confidence` score (0-1), `riskScore` (1-10), and contextual `justification` for explainable AI.
- **Schema Indexes:** Indexes on `status`, `uploadedAt`, and `analysis.riskLevel` for faster retrieval.

### 3.3 `backend/routes/trust_safety.js`
A highly complex routing file ensuring all Trust & Safety logic is accessible via REST:
- **Enhanced Privacy Score Calculator (`calculateEnhancedPrivacyScore`):** Assesses redacted entities (SSN, Credit Card, Email, Person) and subtracts points based on severity weights from a base 100 score, returning a compliance level (`EXCELLENT`, `POOR`, `CRITICAL`).
- **Fairness Audit Generator (`generateEnhancedFairnessAudit`):** Evaluates bias and disparity in the classification of various clauses. Returns precision, recall, and F1-scores per class (Liability, Payment, Termination). Generates warnings if any clause class has an F1-score < 0.85.
- **Confidence Scoring (`/confidence/score`):** Determines the prediction confidence and routes to `requiresReview` if confidence is below 0.70.
- **Feedback Collection (`/feedback`):** Stores Human-in-the-Loop corrections (`userCorrection`, `modelPrediction`) to track and facilitate model optimization.

### 3.4 Services Layer (`backend/services/`)
Node.js services handle preprocessing before passing data to Python agents.
- **Document Noise Filter & Layout:** Uses algorithms to map page coordinates, detect headers/footers, remove watermarks, and binarize images to improve OCR accuracy.
- **Analyzers:** `enhancedDocumentAnalyzer.js` and `xaiAnalyzer.js` orchestrate the multi-step process of extracting text, sending it to the Python middleware for PII redaction, and subsequently to the Legal-BERT classifier. They compute overall document risk based on the severity of the identified clauses.

---

## 4. Deep Dive: AI & Trust/Safety (Python Subsystem)

The Python architecture is self-contained and orchestrates all NLP, CV, and deep learning. 

### 4.1 `backend/setup_trust_safety.py`
A comprehensive automation file that builds the AI runtime environment:
- **Dependency Installation:** `pip installs` PyTorch, Transformers, spaCy, Fairlearn.
- **Model Download:** Pulls `en_core_web_lg` and `en_core_web_sm` from spaCy.
- **Mock Datasets:** Autogenerates synthetic testing sets (`sample_predictions.csv`, `sample_documents.json`) representing various contract types and injecting intentional bias to test the `FairnessAuditor`.
- **Config Generation:** Creates JSON rulesets (`fairness_config.json`, `privacy_config.json`, `accountability_config.json`) defining bias thresholds, clause categories, PII regex fallbacks, and redaction rules.
- **Script Autogeneration:** Dynamically creates the actual execution scripts for the API (`pii_redactor.py`, `fairness_audit_runner.py`, `feedback_collector.py`, `accountability_classifier.py`, `privacy_stats.py`, `health_check.py`) which wrap the core python classes.

### 4.2 Privacy & PII Redaction (`pii_redactor.py`, `privacy_protection.py`)
- Executes Neural NER via spaCy `en_core_web_lg`.
- Targets critical entities: PERSON, ORG, GPE, DATE, MONEY.
- Applies Regex fallback patterns for SSN, Phone, Email, Credit Card, IP Address.
- Physically replaces text with structural tokens (e.g., `[SSN]`, `[PERSON]`) before the data is allowed into the text-classification engine.

### 4.3 Clause Classification (`bert_clause_classifier.py`, `cuad_fine_tuner.py`)
- Utilizes Hugging Face's `transformers` library, specifically a fine-tuned `nlpaueb/legal-bert-base-uncased` model.
- Classifies contract sentences/paragraphs into detailed categories such as *confidentiality*, *dispute_resolution*, *force_majeure*, *governing_law*, and rental-specific clauses like *internal_maintenance*.
- Returns probability logits to act as a confidence score.

### 4.4 Fairness Auditor (`fairness_auditor.py`)
- Analyzes model outputs across different contract demographics (e.g., rental vs. employment vs. NDA).
- Utilizes `Fairlearn` to calculate performance disparities (Accuracy, Demographic Parity) and flag severe biases if a specific contract type performs systematically worse.

### 4.5 Active Learning (`accountability_system.py`)
- The `ConfidenceScorer` class evaluates prediction logits.
- The `FeedbackCollector` class intercepts instances where `requires_review == True` (confidence < 70%). It logs human annotations for eventual continuous learning and writes data to a local `feedback_data` directory.

---

## 5. Deep Dive: Frontend React Application

### 5.1 Architecture (`frontend/src/App.js`)
- Uses React Router for navigation across 5 core views. 
- Integrated global toast notifications (`react-hot-toast`) for UX. 
- Top-level `ErrorBoundary` component to catch and display rendering failures gracefully.

### 5.2 Core Pages (`frontend/src/pages/`)
1. **Dashboard.js**: High-level system overview. Displays metrics like total processed files, average risk score, system health, and a table of recent document uploads with their processing status.
2. **Upload.js**: A drag-and-drop file interface for batch and single contract ingestion. Communicates with `/api/documents`.
3. **DocumentView.js**: Displays the raw unstructured contract alongside the extracted and structured text.
4. **Analysis.js**: The primary output viewer. Renders the classified clauses, highlights risky phrasing (e.g., "sole discretion", "unlimited liability"), and provides contextual mitigations.
5. **TrustSafety.js**: A specialized dashboard that aggregates metrics directly from the `/api/trust-safety/dashboard` endpoint. It charts:
   - Total Entities Redacted
   - Average Privacy Score 
   - Fairness Audits completed
   - Human feedback volume and model improvement rates.

### 5.3 Components (`frontend/src/components/`)
- **Navbar.js**: Tailwind-styled top navigation links.
- **ModelEvaluation.js**: A visual Explainable AI (XAI) component that renders accuracy matrices, confusion matrices, and confidence thresholds for the user to understand *why* the AI made a decision.
- **LoadingSpinner.js**: Standardized UI loader for asynchronous tasks.

---

## 6. Summary for RAG Ingestion
This project constitutes a robust, production-ready AI Legal system. Its primary differentiator is its emphasis on **Agentic Autonomy** combined with strict **Trust & Safety Guardrails**. By utilizing OpenCV for layout analysis, Legal-BERT for classification, spaCy for privacy redaction, and Fairlearn for bias audits, the system guarantees that legal data is handled securely, ethically, and with high explainability. All data persistence relies on MongoDB via Node.js, and the user interfaces with the system through a responsive React application.
