# Multi-Agent Development Proposal: "The Shadow Dev Team"

**Phase 1: Foundation & Orchestration**

## 🎯 Vision
Establish a dedicated team of AI agents to accelerate the development of **Dungeon Farmers**. In the spirit of the game's corporate satire, these agents will act as "employees" in a shadow department, collaborating to ship features, fix bugs, and maintain the codebase.

**No separate dashboard.** Everything runs through **Cursor** or **Claude Code CLI** - the tools you're already using.

## 📅 Phase 1 Goals
1.  **Infrastructure**: Set up `.agent/` directory with prompts, context files, and task tracking.
2.  **Core Squad**: Create specialized system prompts for each "agent" persona.
3.  **Interface**: Use Cursor chat/composer or Claude Code directly - no custom UI.
4.  **Orchestration**: File-based workflow with markdown task files and context handoff.

---

## 🛠️ How It Works (Cursor / Claude Code Native)

### Invoking Agents
Each "agent" is a **specialized system prompt** you invoke by:
1. **Cursor**: Reference the prompt file with `@.agent/prompts/[agent].md` in chat
2. **Claude Code**: Use `cat .agent/prompts/[agent].md | claude -p -` to pipe the system prompt

### Workflow (No Dashboard Needed)
```
You (CEO) → Write directive in chat or task.md
         → "@manager" breaks it into tickets → saved to .agent/memory/
         → "@architect" creates design docs (inline or in /design/)
         → "@engineer" implements, commits code
         → "@qa" reviews, runs tests
         → You approve/reject via git
```

### File Structure (Already Exists!)
```
.agent/
├── prompts/           # ✅ System prompts for each agent persona
│   ├── manager.md     # "The Middle Manager" - breaks down tasks to tickets
│   ├── architect.md   # "The Senior Architect" - designs systems
│   ├── engineer.md    # "The Code Monkey" - implements code
│   └── qa.md          # "The Compliance Officer" - reviews & tests
├── memory/            # ✅ Persistent state between sessions
│   └── latest_plan.json  # Most recent manager output
└── scripts/           # ✅ Orchestration utilities
    └── manager_prototype.ts  # Example script (mock LLM)
```

### Example Session (Cursor)
```
You: @.agent/prompts/manager.md Break down this task: "Add monster capture UI to expedition results"

Manager Output (JSON saved to .agent/memory/latest_plan.json):
  [
    { "title": "Design Capture UI", "assignee": "Architect", "priority": "High" },
    { "title": "Implement Capture Animation", "assignee": "Engineer", "priority": "Medium" },
    { "title": "Update Monster Inventory", "assignee": "Engineer", "priority": "Medium" }
  ]

You: @.agent/prompts/architect.md Design the Capture UI from the plan @.agent/memory/latest_plan.json

Architect Output: Markdown spec with Data Models, API Endpoints, Implementation Steps

You: @.agent/prompts/engineer.md Implement the capture UI based on this design

Engineer Output: Writes actual code with file paths, runs tests
```

---

## 🤖 Agent Breakdown & Prompts (Already Implemented!)

### 1. The Middle Manager (Project Manager)
*   **File**: `.agent/prompts/manager.md` ✅
*   **Personality**: Corporate lingo, obsessed with efficiency, slightly cynical
*   **Output**: JSON array of tickets with `title`, `assignee`, `description`, `priority`
*   **Invoke**: `@.agent/prompts/manager.md` + your directive

### 2. The Senior Architect (System Designer)
*   **File**: `.agent/prompts/architect.md` ✅
*   **Personality**: Opinionated about SOLID, hates over-engineering
*   **Output**: Markdown spec (Overview, Data Models, API Endpoints, Implementation Steps)
*   **Invoke**: `@.agent/prompts/architect.md` + ticket or feature request

### 3. The Code Monkey (Full-Stack Engineer)
*   **File**: `.agent/prompts/engineer.md` ✅
*   **Personality**: Focused, quiet, follows style guide strictly
*   **Output**: Code blocks with file paths (e.g., `typescript:server/api/test.ts`)
*   **Invoke**: `@.agent/prompts/engineer.md` + design doc or task

### 4. The Compliance Officer (QA/Reviewer)
*   **File**: `.agent/prompts/qa.md` ✅
*   **Personality**: Nitpicky, skeptical, loves edge cases
*   **Output**: Review Report with Status (PASS/FAIL), Issues, Suggestions
*   **Invoke**: `@.agent/prompts/qa.md` + files to review

---

## 🎼 Orchestration: File-Based Context Passing

No external framework needed. Agents communicate through **files** that persist context.

### Workflow
1.  **Directive**: You describe your request in Cursor chat (or `task.md`)
2.  **Plan**: Invoke `@manager` → outputs JSON tickets to `.agent/memory/latest_plan.json`
3.  **Design**: Invoke `@architect` with plan → outputs Markdown design spec
4.  **Build**: Invoke `@engineer` with spec → writes code with file paths, tests
5.  **Verify**: Invoke `@qa` with changed files → outputs Review Report (PASS/FAIL)
    *   Pass: Done, commit the changes
    *   Fail: Re-invoke engineer with QA feedback

### Context Files
*   **`.agent/memory/latest_plan.json`**: Current tickets from manager
*   **`.agent/prompts/*.md`**: Agent personas (already written!)
*   **`CLAUDE.md`**: Project context (tech stack, conventions) - already exists

### Why This Works
*   **No infrastructure**: Just markdown files + Cursor/Claude Code
*   **Persistent memory**: Context files survive between sessions
*   **Git-tracked**: All agent work is version controlled
*   **Human readable**: You can review/edit any agent output
*   **Flexible**: Run one agent, skip others, mix and match as needed

---

## 🚀 Next Steps (Immediate)
1.  ✅ **Scaffold**: `.agent/` directory exists with prompts and memory
2.  ✅ **Write Prompts**: All 4 agent prompts written (manager, architect, engineer, qa)
3.  **Test Run**: Try manager agent on a real task from `task.md`
4.  **Iterate**: Refine prompts based on output quality

---

## 🎯 Quick Reference Commands

### Cursor
```
# Plan a feature
@.agent/prompts/manager.md Break down: "Add monster capture UI"

# Design from plan
@.agent/prompts/architect.md @.agent/memory/latest_plan.json Design the first ticket

# Implement from design
@.agent/prompts/engineer.md Implement [paste architect output or reference design doc]

# Review changes
@.agent/prompts/qa.md Review changes in @components/CaptureUI.vue @server/api/capture.ts
```

### Claude Code CLI
```bash
# Run manager on a task
claude "$(cat .agent/prompts/manager.md) Break down: Add monster capture UI"

# Or include as system prompt
cat .agent/prompts/engineer.md | claude -p "Implement the capture animation"
```
