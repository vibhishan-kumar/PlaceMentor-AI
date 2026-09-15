import React, { useState } from 'react';
import {
  BookOpen,
  Code2,
  Database,
  Cpu,
  Globe,
  HelpCircle,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const PlacementResources = () => {
  const [openSection, setOpenSection] = useState('dsa');

  const toggleSection = (id) => {
    setOpenSection(openSection === id ? null : id);
  };

  const coreCS = [
    {
      subject: 'Operating Systems (OS)',
      topics: [
        'Processes vs Threads & Context Switching',
        'Process Synchronization, Mutex vs Semaphore, Deadlocks (4 conditions & handling)',
        'CPU Scheduling Algorithms (FCFS, SJF, Round Robin)',
        'Memory Management, Virtual Memory, Paging, TLB, Page Faults'
      ]
    },
    {
      subject: 'Database Management Systems (DBMS)',
      topics: [
        'SQL Queries, Joins (Inner, Left, Right, Full), Group By, Having',
        'ACID Properties & Transaction Isolation Levels',
        'Normalization (1NF to BCNF) with anomaly elimination',
        'Indexing (B-Tree, B+ Tree) & Query Optimization'
      ]
    },
    {
      subject: 'Computer Networks (CN)',
      topics: [
        'OSI Model vs TCP/IP Model layers and protocols',
        'TCP 3-Way Handshake vs UDP differences',
        'DNS Resolution, What happens when you type google.com in browser',
        'HTTP vs HTTPS, SSL/TLS handshake, Status codes (200, 301, 404, 500)'
      ]
    },
    {
      subject: 'Object-Oriented Programming (OOPS)',
      topics: [
        'Encapsulation, Abstraction, Inheritance, Polymorphism (Compile vs Run-time)',
        'SOLID Principles explained with simple code examples',
        'Abstract Class vs Interface differences & when to use which',
        'Design Patterns (Singleton, Factory, Observer)'
      ]
    }
  ];

  const hrQuestions = [
    {
      q: 'Tell me about yourself (Walk me through your resume)',
      tip: 'Follow Present -> Past -> Future. 1 min elevator pitch focusing on your education at UoH, projects, technical skills, and why this role excites you.'
    },
    {
      q: 'Describe a challenging project bug and how you resolved it',
      tip: 'Use the STAR method (Situation, Task, Action, Result). Highlight your debugging methodology and measurable resolution.'
    },
    {
      q: 'Why do you want to join our company?',
      tip: 'Mention specific company products, culture, engineering blog posts, or company values. Avoid generic answers like "It is a good company".'
    },
    {
      q: 'Where do you see yourself in 3 to 5 years?',
      tip: 'Focus on growth as a senior engineer, taking technical ownership, mentoring juniors, and delivering scalable systems.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          University Placement Vault
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Placement Preparation Guide & Resources
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          High-yield roadmaps, core CS subject cheatsheets, and HR frameworks curated for University of Hyderabad campus drives.
        </p>
      </div>

      {/* Accordion Sections */}
      <div className="space-y-4">
        {/* 1. Core CS Fundamentals */}
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
          <button
            onClick={() => toggleSection('core')}
            className="w-full p-6 flex items-center justify-between text-left hover:bg-slate-850/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Core CS Subjects (OS, DBMS, Networks, OOPS)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Must-know concepts asked in every technical screening and interview.
                </p>
              </div>
            </div>
            {openSection === 'core' ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </button>

          {openSection === 'core' && (
            <div className="p-6 pt-0 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-4">
              {coreCS.map((c, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                  <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wide">
                    {c.subject}
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {c.topics.map((t, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-500/80 mt-0.5 shrink-0" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. DSA Roadmaps */}
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
          <button
            onClick={() => toggleSection('dsa')}
            className="w-full p-6 flex items-center justify-between text-left hover:bg-slate-850/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Data Structures & Algorithms (DSA) Roadmap
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Recommended order of topics and practice problem sheets.
                </p>
              </div>
            </div>
            {openSection === 'dsa' ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </button>

          {openSection === 'dsa' && (
            <div className="p-6 pt-0 border-t border-slate-800/80 space-y-4 text-xs text-slate-300">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-teal-400">Phase 1: Foundations</span>
                  <p className="font-semibold text-white">Arrays, Strings, Two Pointers, Hashing</p>
                  <p className="text-[11px] text-slate-400">Focus on Time & Space complexities (Big-O analysis).</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-teal-400">Phase 2: Core Structures</span>
                  <p className="font-semibold text-white">Linked Lists, Stacks, Queues, Binary Trees, BST</p>
                  <p className="text-[11px] text-slate-400">Master tree traversals (BFS, DFS, Inorder, Preorder).</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-teal-400">Phase 3: Advanced Topics</span>
                  <p className="font-semibold text-white">Graphs (Dijkstra, BFS/DFS), Heaps, Dynamic Programming</p>
                  <p className="text-[11px] text-slate-400">Practice Memoization and Tabulation patterns.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. HR & Behavioral Interview with STAR Method */}
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
          <button
            onClick={() => toggleSection('hr')}
            className="w-full p-6 flex items-center justify-between text-left hover:bg-slate-850/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  HR & Behavioral Interview Prep (STAR Framework)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  How to structure responses for situational and behavioral rounds.
                </p>
              </div>
            </div>
            {openSection === 'hr' ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </button>

          {openSection === 'hr' && (
            <div className="p-6 pt-0 border-t border-slate-800/80 space-y-4">
              <div className="p-4 rounded-2xl bg-teal-950/20 border border-teal-500/20 text-xs text-slate-300 space-y-1">
                <span className="font-bold text-teal-300">STAR Method Breakdown:</span>
                <p><strong>S (Situation):</strong> Set the scene and give the necessary details of your example.</p>
                <p><strong>T (Task):</strong> Describe what your responsibility was in that situation.</p>
                <p><strong>A (Action):</strong> Explain exactly what steps you took to address it.</p>
                <p><strong>R (Result):</strong> Share what outcomes your actions achieved (use percentages and numbers).</p>
              </div>

              <div className="space-y-3">
                {hrQuestions.map((item, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                    <p className="font-semibold text-white">"{item.q}"</p>
                    <p className="text-slate-400 mt-1">{item.tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
