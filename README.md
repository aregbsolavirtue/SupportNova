# SupportNova — VoltCart Complaint Resolution Intelligence

> **Status: DRAFT / SKELETON.** Filled in section by section as each module is finished. Anything in `[brackets]` needs a real answer before submission.

## 1. What this project is

SupportNova is a Generative-AI-powered complaint handling system built for **VoltCart** (a fictional electronics retailer), for the TechWiz7 Generative AI PowerPlay competition. It reads a customer complaint, has an AI draft a classification and reply, then independently checks that AI output with plain Python rules before anything reaches a customer.

## 2. Team and modules

| Module | Branch | Owner |
|---|---|---|
| Backend and Security | `feature/backend-security` | Isaac |
| Knowledge Base | `feature/knowledge-base` | Ajoke |
| AI Pipeline | `feature/genai-pipeline` | Avis |
| Python Validation | `feature/python-validation` | Faith |
| Frontend and Analytics | `feature/frontend-analytics` | Nelius |
| Data, Testing and Docs | `feature/data-and-docs` | Virtue |

## 3. Folder structure

```
SupportNova/
├── README.md                  (this file)
├── AI_USAGE.md
├── requirements.txt
├── data/
│   ├── complaints.csv
│   ├── rule_matrix.csv
│   ├── policy_registry.csv
│   └── policies/               (20 policy documents)
├── testcases/
│   └── VoltCart_Test_Cases_v2.xlsx
├── [src/ or app/]              [Isaac to confirm actual backend folder name]
├── [knowledge_base/]           [Ajoke's module folder]
├── [genai_pipeline/]           [Avis's module folder]
├── [python_validation/]        [Faith's module folder]
└── [frontend/]                 [Nelius's module folder]
```
*[Update this tree once every module's real folder names are known.]*

## 4. Database

Using **PostgreSQL** (confirmed by Isaac, matches the SRS's approved list).
Connection details: `[Isaac to fill in — env variable names, not the actual credentials]`

## 5. Installation

```bash
# 1. Clone the repo
git clone [repo URL]
cd SupportNova

# 2. Create a virtual environment
python -m venv venv
source venv/bin/activate    # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Set up environment variables (never commit real keys)
cp .env.example .env
# Fill in: DATABASE_URL, GENAI_API_KEY, [other keys as needed]

# 5. Set up the database
[Isaac to add: migration/setup commands]

# 6. Load the starter dataset
[Command to load data/complaints.csv, rule_matrix.csv, policies/ into the app]
```

## 6. Running the application

```bash
[Isaac/Nelius to fill in: exact run command, e.g. `python manage.py runserver` or `streamlit run app.py`]
```

Then open: `[local URL, e.g. http://localhost:8000]`

## 7. Test accounts

| Role | Username | Password |
|---|---|---|
| Customer | `[placeholder]` | `[placeholder]` |
| Agent | `[placeholder]` | `[placeholder]` |
| Reviewer | `[placeholder]` | `[placeholder]` |
| Manager | `[placeholder]` | `[placeholder]` |
| Admin | `[placeholder]` | `[placeholder]` |

*Never use real personal credentials here, these are test accounts only.*

## 8. How to use the app (walkthrough)

1. Log in as `[role]`
2. Upload a policy document (admin only) — see `data/policies/` for samples
3. Submit a complaint (customer) — see `data/complaints.csv` for samples
4. View the AI's analysis and the Python validation result (agent/reviewer)
5. If flagged, review it in the manual review queue
6. View dashboards and export reports (admin)

*[Expand this once the real screens exist — Nelius to confirm exact click-paths.]*

## 9. Running tests

```bash
[Test command once test suite exists]
```
The test case document (`testcases/VoltCart_Test_Cases_v2.xlsx`) lists all test cases to run manually or automate.

## 10. Deployment

- **Public URL:** `[Isaac to fill in once deployed]`
- **Hosting platform:** `[Render / Railway / PythonAnywhere / Streamlit Cloud — Isaac to confirm]`

## 11. Known limitations

- `[Fill in once known — e.g. AI response time under load, dataset is simulated, etc.]`

## 12. Team contribution record

| Person | Module | Key contributions |
|---|---|---|
| Isaac | Backend and Security | `[summary]` |
| Ajoke | Knowledge Base | `[summary]` |
| Avis | AI Pipeline | `[summary]` |
| Faith | Python Validation | `[summary]` |
| Nelius | Frontend and Analytics | `[summary]` |
| Virtue | Data, Testing and Docs | Company/dataset creation, test cases, documentation |
