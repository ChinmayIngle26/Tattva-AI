# Tattv.AI — Student Technical Club Platform

A comprehensive management dashboard and public-facing website for Tattv.AI, a student-led technical community.

## Features

- **Public Website**: Modern, responsive landing page, blog, events, and about sections.
- **Role-Based Dashboards**: Tailored experiences for:
  - **Members**: Track tasks, join events, view leaderboard.
  - **Mentors**: Review tasks, guide members.
  - **Domain Leads**: Manage members, projects, and domain activities.
  - **Faculty**: High-level oversight and reporting.
  - **DEV (Admin)**: Full system control, feature flags, backups, and user management.
- **System Features**:
  - **Role-Based Access Control (RBAC)**: secure routing and data visibility.
  - **Feature Flags**: Toggle features (e.g., Leaderboard, AI) in real-time.
  - **Mock Backend**: Client-side data simulation with `localStorage` persistence for prototyping.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Vanilla CSS (Global + CSS Modules/JSX Styles)
- **State Management**: React Context (`AuthContext`, `SettingsContext`)

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run the development server**:
    ```bash
    npm run dev
    ```

3.  **Open in browser**: [http://localhost:3000](http://localhost:3000)

## Default Credentials (Demo)


- **Faculty**: `faculty@tattv.ai` / `faculty123`
- **Lead**: `lead@tattv.ai` / `lead123`
- **Mentor**: `mentor@tattv.ai` / `mentor123`
- **Member**: `member@tattv.ai` / `member123`

