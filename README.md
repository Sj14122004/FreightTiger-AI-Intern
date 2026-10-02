FreightTiger AI Intern Case Study

A freight-cost analytics app that analyzes historical shipment data at the route-week level, flags unusually high costs, and explains them using verified context notes.

Core principle: The LLM only explains verified evidence. It never decides whether a route is anomalous or whether a context note is valid. All numbers, flags, and evidence checks are deterministic.

Contents
How It Works
Dataset
Tech Stack
Project Structure
Analytics Methodology
RAG and Note Validation
LLM Usage and Tracking
Reproducibility
Final Output
API
Running the Application
Frontend Pages
Submission Checklist
How It Works
text
Shipment Data
    ↓
Weekly Route Analytics          (deterministic)
    ↓
Own-History + Similar-Route Comparison
    ↓
Anomaly Flagging
    ↓
RAG Context Retrieval           (ChromaDB)
    ↓
Route/Date Validation           (deterministic)
    ↓
Verified Context Note
    ↓
Ollama Llama 3.2                (summary only)
    ↓
Frontend + Final CSV

The application:

Calculates weekly freight cost per tonne-km
Compares each route with its own recent history and with similar routes
Flags unusually high costs
Retrieves and validates context notes against the exact route and week
Uses an LLM to summarize a verified note
Generates the required final CSV
Shows LLM usage in the frontend and logs it to a CSV
Dataset
Item	Value
Shipments	2,940
Routes	7
Route-weeks	728
Period	January 2024 – December 2025

Routes: Mumbai-Pune, Delhi-Jaipur, Chennai-Bangalore, Ahmedabad-Mumbai, Kolkata-Bhubaneswar, Mumbai-Delhi, Delhi-Chennai

Shipment fields: shipment_id, origin, destination, route_type, material, quantity_tonnes, distance_km, freight_cost_inr, shipment_date, transporter

Context notes are supplied separately in context_notes.csv.

Tech Stack
Layer	Technologies
Frontend	React, Vite, JavaScript, Tailwind CSS, React Router
Backend	Node.js, Express, JavaScript
RAG	ChromaDB, @xenova/transformers, Xenova/all-MiniLM-L6-v2
LLM	Ollama, llama3.2:latest
Data / Output	CSV, csv-parse, csv-stringify
Project Structure
text
freightiger-case-study/
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   │   └── allroutesController.js
│   │   │   ├── routes/
│   │   │   │   └── allroutesRoutes.js
│   │   │   ├── services/analytics/
│   │   │   │   ├── allroutes.js
│   │   │   │   ├── contextNoteRag.js
│   │   │   │   ├── contextNoteValidation.js
│   │   │   │   ├── llmExplanation.js
│   │   │   │   ├── routeFlagging.js
│   │   │   │   ├── routePriceComparison.js
│   │   │   │   └── routeTypeComparison.js
│   │   │   └── utils/
│   │   │       ├── generateFinalOutput.js
│   │   │       ├── indexContextNotes.js
│   │   │       ├── llmUsageLogger.js
│   │   │       └── outputFormat.js
│   │   ├── data/
│   │   ├── logs/llm_usage.csv
│   │   ├── final_output.csv
│   │   └── server.js
│   │
│   └── frontend/src/
│       ├── components/
│       │   ├── Dashboard/
│       │   │   ├── Filters.jsx
│       │   │   ├── FlaggedRoutes.jsx
│       │   │   ├── LlmUsageCard.jsx
│       │   │   ├── MetricDetails.jsx
│       │   │   ├── RouteMetricsTable.jsx
│       │   │   └── SummaryCards.jsx
│       │   └── Navbar.jsx
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── AllRoutes.jsx
│       │   └── Generate.jsx
│       ├── services/api.js
│       ├── App.jsx
│       └── main.jsx
│
├── shipment_records.csv
├── context_notes.csv
├── sample_output_format_v2.csv
└── README.md
Analytics Methodology
Grouping

Shipments are grouped by route + route_type + week_of, where:

route = origin-destination
week_of = the Monday of the week (weeks run Monday–Sunday)
Cost per tonne-km
text
total_freight_cost = sum(freight_cost_inr)
total_tonne_km     = sum(quantity_tonnes × distance_km)
cost_per_tonne_km  = total_freight_cost / total_tonne_km
Own-history comparison

The current week is compared with the average of the previous 8 weeks of the same route.

Only strictly earlier weeks are used.
If fewer than 8 exist, all available weeks are used (no padding).
text
vs_own_history = (current_cost / own_history_average - 1) × 100
Similar-route comparison

The current route is compared with other routes of the same route_type in the same week. The current route is excluded from the peer average.

text
vs_similar_routes = (current_cost / peer_average - 1) × 100
Anomaly flagging

A route-week is flagged when its cost is more than 20% above its own-history baseline or more than 20% above the similar-route baseline.

The 20% threshold is an implementation choice. The case-study document does not specify a numeric threshold.

RAG and Note Validation

Context notes are embedded with Xenova/all-MiniLM-L6-v2 and stored in ChromaDB.

For each flagged route-week:

Build a route/week query.
Retrieve the most relevant notes.
Validate each retrieved note.
Send only a verified note to the LLM.
Validation rules
Guardrail	Rule
Route	The note must apply to the requested route or explicitly say All Routes. Route-specific notes must match the route exactly.
Date	The note must apply to the requested week. Explicit date ranges inside notes are checked.
Negative evidence	A note saying costs were not significantly affected is not used as a justification. Notes describing normal conditions or stable demand are not treated as a reason for a cost increase.
Unsupported evidence	If no note passes validation, matched_note_id is null and the anomaly stays unexplained. The system never invents a reason.

This prevents a semantically similar but incorrect note from becoming an explanation.

LLM Usage and Tracking

The LLM runs only after analytics and note validation. It receives the verified note and is instructed to summarize it without adding facts.

Setting	Value
Model	llama3.2:latest (local, via Ollama)
Temperature	0
API cost	$0.0000 (local model)
What is tracked

Ollama returns prompt_eval_count and eval_count. The app records LLM calls, prompt tokens, output tokens, total tokens, generation time, model, and cost.

Frontend display

The Generate page shows usage through components/Dashboard/LlmUsageCard.jsx: LLM Calls, Prompt Tokens, Output Tokens, Total Tokens, Cost, Time, and Model. Reviewers can see usage without opening backend logs.

Persistent log

Each generation is appended to apps/backend/logs/llm_usage.csv with these columns:

text
timestamp, model, calls, prompt_tokens, output_tokens, total_tokens, cost, duration_ms
Reproducibility

The same dataset and configuration produce identical:

Route-week metrics
Anomaly flags
Numeric comparisons
Matched context-note IDs

Only the wording of the LLM explanation can vary, since it is generated text. To verify, run the full pipeline repeatedly and compare flags, numbers, cited notes, and verdicts.

Final Output

The generated file is apps/backend/final_output.csv and can be downloaded from the Generate page.

text
route, week_of, cost_per_tonne_km, vs_own_history, vs_similar_routes, flagged, matched_note_id, reason
API
Method	Endpoint	Description
GET	/api/health	Health check
GET	/api/all-routes/metrics	Deterministic route-week analytics
POST	/api/all-routes/generate	Runs the full pipeline; returns generated rows plus LLM usage
GET	/api/all-routes/download	Downloads the final CSV
Running the Application
Prerequisites
Node.js
Docker
Ollama

Pull the model:

bash
ollama pull llama3.2
1. Start services
bash
docker start chromadb      # ChromaDB at http://localhost:8000

Make sure Ollama is running with llama3.2:latest.

2. Backend
bash
cd apps/backend
npm install
npm run dev                # http://localhost:5001
3. Index context notes (first run only)
bash
node src/utils/indexContextNotes.js
4. Frontend
bash
cd apps/frontend
npm install
npm run dev                # http://localhost:5173
Frontend Pages
Page	What it shows
Dashboard	Total route-weeks, flagged route-weeks, number of routes, top flagged route-weeks, metric details
All Routes	All weekly metrics with route, route-type, week, and flagged/normal filters, plus metric details
Generate	Generate Analysis action, LLM token/cost/time usage, filters, generated metrics, context-note info, metric details, final CSV download
Submission Checklist

Setup

 Backend runs successfully
 Frontend runs successfully
 ChromaDB is running and context notes are indexed
 Ollama model is available
 Health endpoint works

Functionality

 Route metrics load
 Generate Analysis works
 Final CSV is generated with the required columns
 Context notes are route/date validated
 Unsupported notes are not used as explanations
 Repeated runs produce consistent analytical results

LLM usage

 Token usage is shown in the frontend
 Usage log is generated with tokens, time, and cost recorded

Cleanup

 Temporary test/debug files are removed