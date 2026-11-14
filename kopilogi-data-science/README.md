# Kopilogi Data Science

**Data Science Capstone Project | Asah 2026 — Team A26-CS185**

## Overview

This repository contains the Data Science workflow for the Kopilogi Capstone Project, a web-based information platform developed for Kopilogi, a coffee shop and culinary business with three active branches.

The Data Science work focuses on collecting, assessing, cleaning, and analyzing business information to support the development of Kopilogi's website and AI-powered chatbot.

The project also explores customer information needs, data quality, and descriptive analytics to provide data-driven recommendations.

## Project Objectives

- Collect and organize Kopilogi's branch, menu, and business information.
- Perform data quality assessment and data cleaning.
- Conduct Exploratory Data Analysis (EDA) on menu and branch datasets.
- Analyze customer information needs through survey data.
- Prepare structured datasets for website and chatbot integration.
- Generate business insights and recommendations based on available data.
- Demonstrate sales data analysis using a separate public dataset.

## Tech Stack

- **Python** — Data processing and analysis
- **Pandas** — Data manipulation and cleaning
- **Matplotlib** — Data visualization
- **OpenPyXL** — Excel data processing
- **Jupyter Notebook** — Analysis and documentation
- **Microsoft Excel** — Initial data collection

## Project Structure

```text
kopilogi-data-science/
│
├── data/
│   ├── raw/
│   ├── processed/
│   └── external/
│
├── notebooks/
│   ├── 01_data_assessing.ipynb
│   ├── 02_data_cleaning.ipynb
│   ├── 03_exploratory_data_analysis.ipynb
│   ├── 04_branches_assessing.ipynb
│   ├── 05_branches_cleaning.ipynb
│   ├── 06_branches_eda.ipynb
│   ├── 07_survey_assessing.ipynb
│   └── 08_survey_cleaning.ipynb
│
├── reports/
│
└── README.md
```

## Datasets

| Dataset | Description | Status |
|---|---|---|
| Branch Information | Information about Kopilogi's three active branches | Initial analysis completed |
| Menu Catalog | Menu names, categories, descriptions, prices, and source metadata | Initial analysis completed |
| General Information | Business profile, history, and general information | Collected |
| Customer Survey | Survey responses about customer information needs | Data cleaning in progress |
| Usability Testing | Website usability evaluation data | Planned / Full-Stack team |
| Customer Reviews | Customer feedback from permitted sources | Planned |
| Public Sales Dataset | Public coffee shop transaction data for demonstration | Planned |

## Data Science Workflow

### 1. Business Understanding

Identify Kopilogi's information management needs and define business questions that can be answered using available data.

### 2. Data Gathering

Collect structured information from available business sources, interviews, and survey responses.

### 3. Data Assessing

Evaluate dataset quality by checking missing values, duplicate records, data types, consistency, and data validity.

### 4. Data Cleaning

Standardize data formats, handle missing values appropriately, and prepare datasets for analysis.

### 5. Exploratory Data Analysis

Analyze menu distribution, price characteristics, branch information completeness, and verification status.

### 6. Business Insights and Recommendations

Document analytical findings and provide recommendations to support website information management and user experience.

## Initial Analysis Results

### Menu Catalog

- **183** menu records collected.
- **114** unique menu names.
- **127** unique menu-name and category combinations.
- **20** original menu categories grouped into four analytical categories.
- Beverages account for **60.11%** of catalog records.
- Median menu price: **IDR 22,500**.

### Branch Information

- **3** active branches included.
- Core information completeness: **100%**.
- Overall information completeness: **90.91%**.
- All three branch records are currently marked as `pending_pic`.

These results describe the collected datasets and do not represent sales performance or customer purchasing behavior.

## Data Limitations

- Some business information has not yet been confirmed by Kopilogi's PIC.
- Actual sales transaction data from Moka POS is unavailable.
- Customer survey data contains both actual and dummy records, which must be separated before analysis.
- Public sales datasets will be used only for demonstration purposes.
- Data analysis results must not be interpreted as evidence of increased sales, customer visits, or promotional reach.

## Current Progress

- [x] Business problem identification
- [x] Business question formulation
- [x] Initial menu and branch data gathering
- [x] Menu data assessing and cleaning
- [x] Branch data assessing and cleaning
- [x] Initial menu Exploratory Data Analysis
- [x] Branch completeness analysis
- [x] Initial customer survey assessment
- [ ] Customer survey cleaning and analysis
- [ ] Public sales dataset analysis
- [ ] Customer review analysis (subject to permission)
- [ ] Usability results analysis
- [ ] Final data validation and integration
- [ ] Final insights and recommendations

## Data Privacy and Usage

This repository is intended for academic and educational purposes as part of the Asah 2026 Capstone Project.

Actual business information, survey responses, and third-party datasets must be handled according to their respective permissions and usage restrictions.

Dummy and public datasets must be clearly labeled and must not be presented as actual Kopilogi business transactions or customer responses.

## Project Status

**In Development — November 2026**

Data wrangling and initial EDA for menu and branch information have been completed. Customer survey processing and additional analysis are ongoing.

---

**Asah 2026 — Capstone Project Team A26-CS185**