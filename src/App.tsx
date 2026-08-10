"use client";

import { FormEvent, useMemo, useState } from "react";

type Role = "student" | "teacher" | "admin";
type WorkspaceTab = "overview" | "work" | "fieldwork" | "canvas" | "review" | "insights" | "messages" | "profile";
type Species = {
  name: string;
  scientific: string;
  region: string;
  status: string;
  image: string;
  alt: string;
  summary: string;
};

const DEMO_ACCOUNTS: Record<Role, { username: string; password: string }> = {
  student: { username: "student", password: "student5005" },
  teacher: { username: "teacher", password: "teacher5005" },
  admin: { username: "admin", password: "admin5005" },
};

const species: Species[] = [
  {
    name: "Komodo dragon",
    scientific: "Varanus komodoensis",
    region: "Lesser Sunda Islands",
    status: "Endangered",
    image: "/images/komodo-dragon.jpg",
    alt: "Komodo dragon standing in dry grass",
    summary:
      "The world’s largest living lizard depends on protected island habitat and careful management of human activity.",
  },
  {
    name: "Javan rhinoceros",
    scientific: "Rhinoceros sondaicus",
    region: "Ujung Kulon, Java",
    status: "Critically endangered",
    image: "/images/javan-rhino.jpg",
    alt: "Historic photograph of a Javan rhinoceros",
    summary:
      "A highly threatened forest species whose remaining habitat makes accurate, privacy-aware reporting especially important.",
  },
  {
    name: "Bali myna",
    scientific: "Leucopsar rothschildi",
    region: "North-west Bali",
    status: "Critically endangered",
    image: "/images/bali-myna.jpg",
    alt: "White Bali myna perched on a branch",
    summary:
      "Community awareness, habitat protection and responsible monitoring support the recovery of Bali’s distinctive white starling.",
  },
  {
    name: "Sumatran tiger",
    scientific: "Panthera tigris sumatrae",
    region: "Sumatra",
    status: "Critically endangered",
    image: "/images/sumatran-tiger.jpg",
    alt: "Sumatran tiger resting among rocks",
    summary:
      "Protecting connected forest and reducing conflict are essential to the future of Indonesia’s remaining island tiger.",
  },
];

const libraryItems = [
  {
    type: "Field journal",
    title: "Reading the signs of a healthy mangrove",
    organisation: "Tanjung Harapan Learning Circle",
    meta: "8 min read · reviewed",
  },
  {
    type: "School project",
    title: "A classroom guide to wildlife-friendly gardens",
    organisation: "Ujung Barat Primary School",
    meta: "12 activities · anonymised",
  },
  {
    type: "Sighting brief",
    title: "Recording hornbill activity without disturbing nests",
    organisation: "Forest Neighbours Network",
    meta: "5 observations · moderated",
  },
];

const studentActivities = [
  { title: "Map a safe habitat", due: "12 August", progress: 72, state: "In progress" },
  { title: "Species identification quiz", due: "Completed", progress: 100, state: "Teacher review" },
  { title: "Build a pollinator log", due: "19 August", progress: 28, state: "Started" },
];

const teacherQueue = [
  { item: "Habitat map", className: "Year 6 · Meranti", count: 8, state: "Ready to review" },
  { item: "Field observation", className: "Year 5 · Rafflesia", count: 5, state: "Needs moderation" },
  { item: "Species quiz", className: "Year 6 · Meranti", count: 21, state: "Complete" },
];

const roleTabs: Record<Role, WorkspaceTab[]> = {
  student: ["overview", "work", "fieldwork", "canvas", "review", "messages", "profile"],
  teacher: ["overview", "work", "review", "fieldwork", "insights", "messages"],
  admin: ["overview", "work", "profile", "review", "insights", "messages"],
};

const workspaceLabels: Record<Role, Partial<Record<WorkspaceTab, string>>> = {
  student: { overview: "Overview", work: "My activities", fieldwork: "Sightings", canvas: "Creative canvas", review: "My submissions", messages: "Messages", profile: "My profile" },
  teacher: { overview: "Overview", work: "Classes", review: "Review queue", fieldwork: "Sighting moderation", insights: "Progress reports", messages: "Messages" },
  admin: { overview: "Overview", work: "Organisations", profile: "People", review: "Access control", insights: "Business insights", messages: "Messages" },
};

const workspaceHeadings: Record<Role, Partial<Record<WorkspaceTab, { kicker: string; title: string }>>> = {
  student: {
    overview: { kicker: "Student learning space", title: "Welcome back, Explorer" },
    work: { kicker: "Student learning space", title: "My activities" },
    fieldwork: { kicker: "Student learning space", title: "Sighting reports" },
    canvas: { kicker: "Student learning space", title: "Creative canvas" },
    review: { kicker: "Student learning space", title: "My submissions" },
    messages: { kicker: "Student learning space", title: "Messages" },
    profile: { kicker: "Student learning space", title: "My profile" },
  },
  teacher: {
    overview: { kicker: "Teacher workspace", title: "Good morning, Educator" },
    work: { kicker: "Teacher workspace", title: "Classes" },
    review: { kicker: "Teacher workspace", title: "Review queue" },
    fieldwork: { kicker: "Teacher workspace", title: "Sighting moderation" },
    insights: { kicker: "Teacher workspace", title: "Progress reports" },
    messages: { kicker: "Teacher workspace", title: "Messages" },
  },
  admin: {
    overview: { kicker: "Organisation administration", title: "Operations overview" },
    work: { kicker: "Organisation administration", title: "Organisations" },
    profile: { kicker: "Organisation administration", title: "People" },
    review: { kicker: "Organisation administration", title: "Access control" },
    insights: { kicker: "Organisation administration", title: "Business insights" },
    messages: { kicker: "Organisation administration", title: "Messages" },
  },
};

function Logo() {
  return (
    <span className="brand" aria-label="Komodo Hub home">
      <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
      <span>Komodo <strong>Hub</strong></span>
    </span>
  );
}

export default function App() {
  const [role, setRole] = useState<Role | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginRole, setLoginRole] = useState<Role>("student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
  const [toast, setToast] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>("overview");

  const account = useMemo(() => (role ? DEMO_ACCOUNTS[role] : null), [role]);

  function openLogin(nextRole: Role = "student") {
    setLoginRole(nextRole);
    setUsername("");
    setPassword("");
    setLoginError("");
    setLoginOpen(true);
  }

  function fillDemo(nextRole: Role) {
    setLoginRole(nextRole);
    setUsername(DEMO_ACCOUNTS[nextRole].username);
    setPassword(DEMO_ACCOUNTS[nextRole].password);
    setLoginError("");
  }

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const expected = DEMO_ACCOUNTS[loginRole];
    if (username.trim() !== expected.username || password !== expected.password) {
      setLoginError("Those details do not match the selected demo role. Use one of the test accounts below.");
      return;
    }
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
    if (apiBaseUrl) {
      try {
        const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ username: username.trim(), password }),
        });
        const result = await response.json();
        if (!response.ok || result.user?.role !== loginRole) {
          setLoginError(result.error || "The backend did not accept this demonstration account.");
          return;
        }
        sessionStorage.setItem("komodoHubToken", result.token);
      } catch {
        setLoginError("The backend service could not be reached. Check VITE_API_BASE_URL and try again.");
        return;
      }
    }
    setRole(loginRole);
    setWorkspaceTab("overview");
    setLoginOpen(false);
    setToast(`Signed in to the ${loginRole} workspace.`);
    window.setTimeout(() => setToast(""), 3200);
  }

  function goPublic() {
    setRole(null);
    setWorkspaceTab("overview");
    setMobileNavOpen(false);
    sessionStorage.removeItem("komodoHubToken");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  }

  function selectWorkspaceTab(tab: WorkspaceTab) {
    setWorkspaceTab(tab);
    setMobileNavOpen(false);
  }

  if (role) {
    return (
      <main className="app-shell">
        <aside className={`side-nav ${mobileNavOpen ? "is-open" : ""}`}>
          <button className="logo-button" onClick={goPublic}><Logo /></button>
          <nav aria-label="Workspace navigation">
            {roleTabs[role].map((tab, index) => (
              <button
                key={tab}
                className={workspaceTab === tab ? "active" : ""}
                onClick={() => selectWorkspaceTab(tab)}
                aria-current={workspaceTab === tab ? "page" : undefined}
              >
                <span className="nav-glyph" aria-hidden="true">{index + 1}</span>{workspaceLabels[role][tab]}
              </button>
            ))}
          </nav>
          <div className="privacy-note">
            <span className="lock-dot" aria-hidden="true" />
            <div><strong>Private workspace</strong><small>Role permissions are active</small></div>
          </div>
          <button className="text-button" onClick={goPublic}>Sign out</button>
        </aside>

        <section className="dashboard">
          <header className="dash-header">
            <button className="menu-button" onClick={() => setMobileNavOpen(!mobileNavOpen)} aria-label="Toggle workspace menu">Menu</button>
            <div>
              <p>{workspaceHeadings[role][workspaceTab]?.kicker}</p>
              <h1>{workspaceHeadings[role][workspaceTab]?.title}</h1>
            </div>
            <div className="profile-chip"><span>{role.slice(0, 1).toUpperCase()}</span><div><strong>{account?.username}</strong><small>Demo account</small></div></div>
          </header>

          {role === "student" && <StudentWorkspace tab={workspaceTab} notify={notify} />}
          {role === "teacher" && <TeacherWorkspace tab={workspaceTab} notify={notify} />}
          {role === "admin" && <AdminWorkspace tab={workspaceTab} notify={notify} />}
        </section>
        {toast && <div className="toast" role="status">{toast}</div>}
      </main>
    );
  }

  return (
    <main>
      <header className="site-header">
        <a href="#top"><Logo /></a>
        <nav aria-label="Main navigation">
          <a href="#mission">Our mission</a>
          <a href="#species">Species</a>
          <a href="#programmes">Programmes</a>
          <a href="#library">Public library</a>
        </nav>
        <button className="button button-small" onClick={() => openLogin()}>Sign in</button>
      </header>

      <section className="hero" id="top">
        <img src="/images/komodo-dragon.jpg" alt="Komodo dragon moving through its dry island habitat" />
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="eyebrow light">A shared home for conservation</p>
          <h1>Learn locally.<br />Protect together.</h1>
          <p>Komodo Hub brings Indonesian schools, communities and conservation knowledge into one safe digital platform.</p>
          <div className="button-row">
            <a className="button button-light" href="#programmes">Explore programmes</a>
            <button className="button button-ghost" onClick={() => openLogin("student")}>Open learning space</button>
          </div>
        </div>
        <div className="hero-stats" aria-label="Platform summary">
          <div><strong>4</strong><span>learning pathways</span></div>
          <div><strong>18</strong><span>curated resources</span></div>
          <div><strong>100%</strong><span>student profiles private</span></div>
        </div>
      </section>

      <section className="mission section" id="mission">
        <div>
          <p className="eyebrow">Why Komodo Hub</p>
          <h2>Conservation works best when knowledge can travel.</h2>
        </div>
        <div className="mission-copy">
          <p>From remote primary schools to nationwide community groups, people need a clear way to learn, record observations and share useful work without exposing children’s personal information.</p>
          <a href="#library">See how public contributions work <span aria-hidden="true">→</span></a>
        </div>
      </section>

      <section className="species-section section" id="species">
        <div className="section-heading">
          <div><p className="eyebrow">Species focus</p><h2>Meet four remarkable neighbours.</h2></div>
          <p>Explore concise learning cards before moving into guided activities, fieldwork and moderated reporting.</p>
        </div>
        <div className="species-grid">
          {species.map((item, index) => (
            <article className={`species-card species-${index + 1}`} key={item.name}>
              <img src={item.image} alt={item.alt} />
              <div className="card-overlay" />
              <div className="species-card-content">
                <span>{item.status}</span>
                <h3>{item.name}</h3>
                <p>{item.region}</p>
                <button onClick={() => setSelectedSpecies(item)} aria-label={`Learn about ${item.name}`}>Read profile <b aria-hidden="true">↗</b></button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="programmes section" id="programmes">
        <div className="programmes-intro">
          <p className="eyebrow light">Learning in action</p>
          <h2>One platform, different ways to contribute.</h2>
          <p>Teachers can shape programme content for their classes. Students follow a clear learning path, while communities publish knowledge for everyone.</p>
          <button className="button button-light" onClick={() => openLogin("teacher")}>View teacher workspace</button>
        </div>
        <div className="programme-list">
          {[
            ["01", "Classroom pathways", "Curated content, quizzes and teacher-created activities aligned to each class."],
            ["02", "Field observations", "Guided sighting records with clear consent, moderation and safe location handling."],
            ["03", "Creative conservation", "Private learning canvases that help young people reflect on their progress."],
            ["04", "Community knowledge", "Public articles and reports that recognise contributions without risking student privacy."],
          ].map(([number, title, text]) => (
            <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></article>
          ))}
        </div>
      </section>

      <section className="library section" id="library">
        <div className="section-heading">
          <div><p className="eyebrow">Public library</p><h2>Useful work, shared safely.</h2></div>
          <p>Only reviewed contributions appear here. School work is anonymised and student profiles remain inaccessible to public visitors.</p>
        </div>
        <div className="library-grid">
          {libraryItems.map((item) => (
            <article key={item.title}>
              <div className="document-mark" aria-hidden="true"><span /><span /><span /></div>
              <p className="library-type">{item.type}</p>
              <h3>{item.title}</h3>
              <p>{item.organisation}</p>
              <div><span>{item.meta}</span><button aria-label={`Open ${item.title}`} onClick={() => setToast("This public resource is shown as a coursework prototype.")}>Open ↗</button></div>
            </article>
          ))}
        </div>
      </section>

      <section className="privacy-band">
        <div className="privacy-icon" aria-hidden="true"><span /></div>
        <div><p className="eyebrow light">Privacy by design</p><h2>Children can contribute without becoming public profiles.</h2></div>
        <p>Assigned teachers can view student progress. School leaders manage access. Public visitors see only reviewed, anonymised work.</p>
      </section>

      <section className="join section">
        <p className="eyebrow">Start a programme</p>
        <h2>Small observations can build a national picture.</h2>
        <p>Enter the demonstration as a student, teacher or school administrator to see how each role receives only the tools and information it needs.</p>
        <button className="button" onClick={() => openLogin()}>Try the role-based demo</button>
      </section>

      <footer>
        <div><Logo /><p>An individual 5005CMD coursework prototype by Sahir Kayani for community-supported animal conservation.</p></div>
        <div><strong>Explore</strong><a href="#species">Species</a><a href="#programmes">Programmes</a><a href="#library">Library</a></div>
        <div><strong>Access</strong><button onClick={() => openLogin("student")}>Student</button><button onClick={() => openLogin("teacher")}>Teacher</button><button onClick={() => openLogin("admin")}>Administrator</button></div>
        <div><strong>Project</strong><a href="mailto:knjjjshhj@gmail.com">Support</a><button onClick={() => setToast("Conservation images are used for educational prototype purposes.")}>Image credits</button><span>5005CMD · 2026</span></div>
      </footer>

      {loginOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setLoginOpen(false)}>
          <section className="login-modal" role="dialog" aria-modal="true" aria-labelledby="login-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setLoginOpen(false)} aria-label="Close sign in">×</button>
            <p className="eyebrow">Secure demonstration</p>
            <h2 id="login-title">Choose a workspace</h2>
            <p className="modal-intro">These fictional accounts contain no real student data. Select a role, then use its test details.</p>
            <div className="role-tabs" role="tablist" aria-label="Demo role">
              {(["student", "teacher", "admin"] as Role[]).map((item) => (
                <button key={item} role="tab" aria-selected={loginRole === item} className={loginRole === item ? "active" : ""} onClick={() => fillDemo(item)}>{item === "admin" ? "Administrator" : item}</button>
              ))}
            </div>
            <form onSubmit={submitLogin}>
              <label>Username<input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required /></label>
              <label>Password<input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" required /></label>
              {loginError && <p className="form-error" role="alert">{loginError}</p>}
              <button className="button" type="submit">Enter {loginRole} workspace</button>
            </form>
            <button className="demo-fill" onClick={() => fillDemo(loginRole)}>Fill this demo account: <strong>{DEMO_ACCOUNTS[loginRole].username}</strong> / <strong>{DEMO_ACCOUNTS[loginRole].password}</strong></button>
          </section>
        </div>
      )}

      {selectedSpecies && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelectedSpecies(null)}>
          <section className="species-modal" role="dialog" aria-modal="true" aria-labelledby="species-title" onMouseDown={(event) => event.stopPropagation()}>
            <img src={selectedSpecies.image} alt={selectedSpecies.alt} />
            <div>
              <button className="modal-close" onClick={() => setSelectedSpecies(null)} aria-label="Close species profile">×</button>
              <p className="eyebrow">{selectedSpecies.status}</p>
              <h2 id="species-title">{selectedSpecies.name}</h2>
              <p className="scientific">{selectedSpecies.scientific} · {selectedSpecies.region}</p>
              <p>{selectedSpecies.summary}</p>
              <button className="button" onClick={() => { setSelectedSpecies(null); openLogin("student"); }}>Open a related activity</button>
            </div>
          </section>
        </div>
      )}
      {toast && <div className="toast" role="status">{toast}</div>}
    </main>
  );
}

type WorkspaceProps = { tab: WorkspaceTab; notify: (message: string) => void };

function StudentWorkspace({ tab, notify }: WorkspaceProps) {
  const [activities, setActivities] = useState(studentActivities);
  const [selectedSubmission, setSelectedSubmission] = useState("Habitat map");
  const [draftSubmitted, setDraftSubmitted] = useState(false);
  const [sightings, setSightings] = useState([
    { species: "Bali myna", region: "North-west Bali", date: "6 August 2026", status: "Approved" },
  ]);
  const [sightingSpecies, setSightingSpecies] = useState("Komodo dragon");
  const [sightingRegion, setSightingRegion] = useState("");
  const [sightingNotes, setSightingNotes] = useState("");
  const [canvasItems, setCanvasItems] = useState(["Habitat sketch", "Species quiz badge", "Mangrove reflection"]);
  const [canvasDraft, setCanvasDraft] = useState("");
  const [avatar, setAvatar] = useState("K");
  const [colourTheme, setColourTheme] = useState("Sunset orange");

  function continueActivity(title: string) {
    setActivities((items) => items.map((item) => item.title === title
      ? { ...item, progress: Math.min(100, item.progress + 10), state: item.progress >= 90 ? "Teacher review" : "In progress" }
      : item));
    notify(`${title} progress saved.`);
  }

  function submitSighting(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSightings((items) => [{ species: sightingSpecies, region: sightingRegion, date: "10 August 2026", status: "Pending teacher review" }, ...items]);
    setSightingRegion("");
    setSightingNotes("");
    notify("Sighting sent for privacy and accuracy review.");
  }

  function addCanvasItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCanvasItems((items) => [...items, canvasDraft.trim()]);
    setCanvasDraft("");
    notify("Item added to your private creative canvas.");
  }

  if (tab === "work") {
    return <div className="dash-content"><PageIntro eyebrow="Learning pathway" title="Your current activities" text="Open an activity, record progress and return later without losing your place." />
      <div className="activity-grid expanded-grid">{activities.map((activity) => <article key={activity.title}><div className="activity-top"><span>{activity.state}</span><small>{activity.due}</small></div><h3>{activity.title}</h3><div className="progress-track"><i style={{ width: `${activity.progress}%` }} /></div><p>{activity.progress}% complete</p><button className="inline-button" onClick={() => continueActivity(activity.title)}>{activity.progress === 100 ? "Review activity" : "Continue activity"}</button></article>)}</div>
      <section className="dash-card resource-panel"><p className="eyebrow">Recommended resource</p><h3>How shade, water and shelter shape a habitat</h3><p>This short guide supports the habitat mapping activity and takes around six minutes to read.</p><button className="button compact-button" onClick={() => notify("Resource marked as read.")}>Mark as read</button></section>
    </div>;
  }

  if (tab === "fieldwork") return <div className="dash-content"><PageIntro eyebrow="Responsible fieldwork" title="Sighting reports" text="Record observations without publishing your identity or a precise sensitive location." />
    <div className="split-workspace"><form className="detail-panel stack-form" onSubmit={submitSighting}><label>Species<select value={sightingSpecies} onChange={(event) => setSightingSpecies(event.target.value)}>{species.map((item) => <option key={item.name}>{item.name}</option>)}</select></label><label>General region<input value={sightingRegion} onChange={(event) => setSightingRegion(event.target.value)} placeholder="For example, Ujung Kulon" required /></label><label>Observation notes<textarea value={sightingNotes} onChange={(event) => setSightingNotes(event.target.value)} minLength={10} rows={5} placeholder="Describe what you observed from a safe distance" required /></label><p className="form-help">Exact coordinates and student identity are not published. A teacher reviews every report first.</p><button className="button compact-button" type="submit">Submit for review</button></form><div className="submission-list sighting-list">{sightings.map((item, index) => <article key={`${item.species}-${index}`}><span><strong>{item.species}</strong><small>{item.region} · {item.date}</small></span><em>{item.status}</em></article>)}</div></div>
  </div>;

  if (tab === "canvas") return <div className="dash-content"><PageIntro eyebrow="Private reflection" title="Creative canvas" text="Collect the work, ideas and achievements that tell the story of your conservation programme." />
    <form className="compose-panel canvas-form" onSubmit={addCanvasItem}><label>New canvas item<input value={canvasDraft} onChange={(event) => setCanvasDraft(event.target.value)} placeholder="Add a reflection, badge or project title" required /></label><button className="button compact-button" type="submit">Add item</button></form><div className="canvas-grid">{canvasItems.map((item, index) => <article key={`${item}-${index}`}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h3>{item}</h3><p>Visible only to you and authorised teaching staff.</p><button onClick={() => { setCanvasItems((items) => items.filter((_, itemIndex) => itemIndex !== index)); notify("Canvas item removed. You can add it again at any time."); }}>Remove</button></article>)}</div>
  </div>;

  if (tab === "review") {
    const submissions = [
      { title: "Habitat map", sent: "9 August 2026", result: "Feedback received", note: "Add one reason why shade affects the habitat." },
      { title: "Species identification quiz", sent: "7 August 2026", result: "18 out of 20", note: "Excellent species recognition. Review questions 6 and 14." },
      { title: "Mangrove field journal", sent: draftSubmitted ? "10 August 2026" : "Draft saved", result: draftSubmitted ? "Teacher review" : "Not submitted", note: draftSubmitted ? "Your teacher will review this private submission." : "Complete the final reflection before sending this to your teacher." },
    ];
    const current = submissions.find((item) => item.title === selectedSubmission) ?? submissions[0];
    return <div className="dash-content"><PageIntro eyebrow="Private learning record" title="Submissions and feedback" text="Only you, your assigned teachers and authorised school staff can view this work." />
      <div className="split-workspace"><div className="submission-list" role="list">{submissions.map((item) => <button key={item.title} className={selectedSubmission === item.title ? "selected" : ""} onClick={() => setSelectedSubmission(item.title)}><span><strong>{item.title}</strong><small>{item.sent}</small></span><em>{item.result}</em></button>)}</div>
        <article className="detail-panel"><p className="eyebrow">Selected submission</p><h2>{current.title}</h2><span className="status-pill">{current.result}</span><p>{current.note}</p><div className="panel-actions"><button className="button compact-button" onClick={() => { if (current.result === "Not submitted") setDraftSubmitted(true); notify(current.result === "Not submitted" ? "Draft submitted to your teacher." : "Feedback opened."); }}>{current.result === "Not submitted" ? "Submit draft" : "Open feedback"}</button><button className="secondary-button" onClick={() => notify("A private copy was prepared for download.")}>Download copy</button></div></article></div>
    </div>;
  }

  if (tab === "messages") return <MessagesPanel role="student" notify={notify} />;

  if (tab === "profile") return <div className="dash-content"><PageIntro eyebrow="Personalisation" title="My profile" text="Choose a simple avatar and colour theme. Your profile remains unavailable to public visitors." />
    <div className="profile-editor"><article className="profile-preview"><span className="profile-avatar">{avatar}</span><h2>Student Explorer</h2><p>{colourTheme} theme · private learner profile</p><span className="status-pill">Not public</span></article><form className="detail-panel stack-form" onSubmit={(event) => { event.preventDefault(); notify("Profile preferences saved privately."); }}><label>Avatar letter<select value={avatar} onChange={(event) => setAvatar(event.target.value)}><option>K</option><option>R</option><option>S</option><option>T</option></select></label><label>Colour theme<select value={colourTheme} onChange={(event) => setColourTheme(event.target.value)}><option>Sunset orange</option><option>Coral reef</option><option>Forest canopy</option></select></label><label className="toggle-row"><span><strong>Progress reminders</strong><small>Show gentle reminders in this workspace</small></span><input type="checkbox" defaultChecked /></label><button className="button compact-button" type="submit">Save preferences</button></form></div>
  </div>;

  return <div className="dash-content">
    <section className="welcome-panel student-panel"><div><p className="eyebrow light">Current programme</p><h2>Guardians of the rainforest</h2><p>Continue your habitat map, then share a reflection with your teacher.</p><button onClick={() => continueActivity("Map a safe habitat")}>Continue activity <span aria-hidden="true">→</span></button></div><div className="progress-orbit"><strong>{activities[0].progress}%</strong><span>programme progress</span></div></section>
    <section className="dash-section"><div className="dash-title"><div><p>Your learning</p><h2>Activities this week</h2></div></div><div className="activity-grid">{activities.map((activity) => <article key={activity.title}><div className="activity-top"><span>{activity.state}</span><small>{activity.due}</small></div><h3>{activity.title}</h3><div className="progress-track"><i style={{ width: `${activity.progress}%` }} /></div><p>{activity.progress}% complete</p><button className="inline-button" onClick={() => continueActivity(activity.title)}>Open</button></article>)}</div></section>
    <section className="dash-grid"><article className="dash-card"><p className="eyebrow">Teacher feedback</p><h3>“Strong observation notes. Add one reason why shade affects the habitat.”</h3><span>Field journal · received today</span><button onClick={() => notify("Teacher feedback opened.")}>Open feedback →</button></article><article className="dash-card canvas-card"><p className="eyebrow">Creative canvas</p><h3>Your conservation story has 6 items.</h3><div className="mini-canvas"><span /><span /><span /></div><button onClick={() => notify("Creative canvas opened.")}>Continue editing →</button></article></section>
  </div>;
}

function TeacherWorkspace({ tab, notify }: WorkspaceProps) {
  const [classes, setClasses] = useState([
    { name: "Year 6 · Meranti", pupils: 21, progress: 82 },
    { name: "Year 5 · Rafflesia", pupils: 13, progress: 67 },
  ]);
  const [queue, setQueue] = useState(teacherQueue);
  const [selectedReview, setSelectedReview] = useState(teacherQueue[0].item);
  const [moderationQueue, setModerationQueue] = useState([
    { id: 1, species: "Javan rhinoceros", contributor: "Protected student contributor", region: "Ujung Kulon", status: "Pending" },
    { id: 2, species: "Bali myna", contributor: "Community member", region: "North-west Bali", status: "Pending" },
  ]);
  const [reportReady, setReportReady] = useState(false);

  function addActivity() {
    setClasses((items) => items.map((item, index) => index === 0 ? { ...item, progress: Math.min(100, item.progress + 1) } : item));
    notify("Draft activity created for Year 6 · Meranti.");
  }

  function decideReview(decision: "Approved" | "Changes requested") {
    setQueue((items) => items.map((item) => item.item === selectedReview ? { ...item, state: decision } : item));
    notify(`${selectedReview}: ${decision.toLowerCase()}.`);
  }

  function moderateSighting(id: number, status: "Approved" | "Changes requested") {
    setModerationQueue((items) => items.map((item) => item.id === id ? { ...item, status } : item));
    notify(`Sighting ${status.toLowerCase()}.`);
  }

  if (tab === "work") return <div className="dash-content"><PageIntro eyebrow="Teaching groups" title="Classes and activities" text="Check participation, open a class or prepare a new task for assigned learners." />
    <div className="class-grid">{classes.map((item) => <article className="dash-card" key={item.name}><p className="eyebrow">Active class</p><h3>{item.name}</h3><p>{item.pupils} learners · {item.progress}% average completion</p><div className="progress-track"><i style={{ width: `${item.progress}%` }} /></div><button onClick={() => notify(`${item.name} register opened.`)}>Open class →</button></article>)}<article className="dash-card create-card"><p className="eyebrow">Activity builder</p><h3>Create a guided activity</h3><p>Start with a title, learning outcome and private submission setting.</p><button className="button compact-button" onClick={addActivity}>Create draft</button></article></div>
  </div>;

  if (tab === "review") {
    const current = queue.find((item) => item.item === selectedReview) ?? queue[0];
    return <div className="dash-content"><PageIntro eyebrow="Assessment and moderation" title="Review queue" text="Open a set of submissions, check privacy and record a clear outcome." />
      <div className="split-workspace"><div className="queue-table" role="table" aria-label="Teacher review queue"><div className="queue-row queue-head" role="row"><span>Activity</span><span>Class</span><span>Items</span><span>Status</span></div>{queue.map((item) => <button className={`queue-row ${selectedReview === item.item ? "selected" : ""}`} role="row" key={item.item} onClick={() => setSelectedReview(item.item)}><strong>{item.item}</strong><span>{item.className}</span><span>{item.count}</span><em>{item.state}</em></button>)}</div>
        <article className="detail-panel"><p className="eyebrow">Review decision</p><h2>{current.item}</h2><p>{current.count} items from {current.className} are included in this batch. Public-facing work must be anonymised before approval.</p><div className="privacy-check"><span aria-hidden="true">✓</span><p><strong>Privacy check passed</strong><small>No student name or precise sighting location is public.</small></p></div><div className="panel-actions"><button className="button compact-button" onClick={() => decideReview("Approved")}>Approve batch</button><button className="secondary-button" onClick={() => decideReview("Changes requested")}>Request changes</button></div></article></div>
    </div>;
  }

  if (tab === "fieldwork") return <div className="dash-content"><PageIntro eyebrow="Teacher verification" title="Sighting moderation" text="Check accuracy, remove sensitive details and approve only suitable contributions for the organisation library." />
    <div className="moderation-grid">{moderationQueue.map((item) => <article className="dash-card" key={item.id}><p className="eyebrow">{item.status}</p><h3>{item.species}</h3><p>{item.region}</p><small>{item.contributor}</small><div className="privacy-check"><span aria-hidden="true">✓</span><p><strong>Public privacy preview</strong><small>No child name or exact coordinates shown.</small></p></div><div className="panel-actions"><button className="button compact-button" onClick={() => moderateSighting(item.id, "Approved")}>Approve</button><button className="secondary-button" onClick={() => moderateSighting(item.id, "Changes requested")}>Request changes</button></div></article>)}</div>
  </div>;

  if (tab === "insights") return <div className="dash-content"><PageIntro eyebrow="Assigned classes only" title="Progress reports" text="Review learning outcomes for your own classes and prepare a private summary for authorised school staff." />
    <section className="metric-row"><article><span>Activities completed</span><strong>86%</strong><small>Year 6 · Meranti</small></article><article><span>On-time submissions</span><strong>29</strong><small>Out of 34 learners</small></article><article><span>Feedback returned</span><strong>91%</strong><small>Within seven days</small></article></section><section className="dash-card report-panel"><div><p className="eyebrow">Report builder</p><h3>{reportReady ? "Private class report prepared" : "Generate a progress summary"}</h3><p>{reportReady ? "The summary includes class-level progress and excludes public student details." : "Create a concise summary from activities, submissions and feedback for your assigned class."}</p></div><button className="button compact-button" onClick={() => { setReportReady(true); notify("Private progress report generated."); }}>{reportReady ? "Regenerate report" : "Generate report"}</button></section>
  </div>;

  if (tab === "messages") return <MessagesPanel role="teacher" notify={notify} />;

  return <div className="dash-content"><section className="metric-row"><article><span>Active learners</span><strong>34</strong><small>Across 2 classes</small></article><article><span>Work awaiting review</span><strong>{queue.reduce((total, item) => total + (item.state === "Approved" ? 0 : item.count), 0)}</strong><small>Includes moderated work</small></article><article><span>Average completion</span><strong>78%</strong><small>Up 6% this month</small></article></section>
    <section className="dash-section"><div className="dash-title"><div><p>Class activity</p><h2>Review queue</h2></div><button onClick={addActivity}>Create activity</button></div><div className="queue-table" role="table" aria-label="Teacher review queue"><div className="queue-row queue-head" role="row"><span>Activity</span><span>Class</span><span>Items</span><span>Status</span></div>{queue.map((item) => <button className="queue-row" role="row" key={item.item} onClick={() => { setSelectedReview(item.item); notify(`${item.item} selected for review.`); }}><strong>{item.item}</strong><span>{item.className}</span><span>{item.count}</span><em>{item.state}</em></button>)}</div></section>
    <section className="dash-grid"><article className="dash-card"><p className="eyebrow">Class progress</p><h3>Year 6 · Meranti</h3><div className="bar-list"><p><span>Habitat mapping</span><i><b style={{ width: "82%" }} /></i><strong>82%</strong></p><p><span>Species quiz</span><i><b style={{ width: "94%" }} /></i><strong>94%</strong></p><p><span>Field journal</span><i><b style={{ width: "61%" }} /></i><strong>61%</strong></p></div></article><article className="dash-card"><p className="eyebrow">Privacy check</p><h3>All public items are anonymised.</h3><p>Three contributions are waiting for a teacher or school administrator to approve them.</p><button onClick={() => notify("Public library moderation queue opened.")}>Review public library →</button></article></section>
  </div>;
}

function AdminWorkspace({ tab, notify }: WorkspaceProps) {
  const [organisations, setOrganisations] = useState([
    { name: "Ujung Barat Primary School", type: "School", members: 41, status: "Active" },
    { name: "Tanjung Harapan Learning Circle", type: "Community group", members: 18, status: "Active" },
    { name: "Forest Neighbours Network", type: "Conservation partner", members: 9, status: "Review due" },
  ]);
  const [accessCode, setAccessCode] = useState("KODO-7P4X");
  const [libraryPublic, setLibraryPublic] = useState(true);
  const [people, setPeople] = useState([
    { name: "Ms Arini", role: "Teacher", group: "Year 6 · Meranti", status: "Active" },
    { name: "Mr Bima", role: "Teacher", group: "Year 5 · Rafflesia", status: "Active" },
    { name: "Student cohort", role: "34 learners", group: "Two classes", status: "Protected" },
  ]);

  function generateCode() {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let suffix = "";
    for (let index = 0; index < 4; index += 1) suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
    setAccessCode(`KODO-${suffix}`);
    notify("A new time-limited joining code was generated.");
  }

  if (tab === "work") return <div className="dash-content"><PageIntro eyebrow="Network management" title="Organisations" text="Manage approved schools and community partners without exposing private learner records." />
    <div className="organisation-list"><div className="organisation-row organisation-head"><span>Organisation</span><span>Type</span><span>Members</span><span>Status</span><span>Action</span></div>{organisations.map((item) => <div className="organisation-row" key={item.name}><strong>{item.name}</strong><span>{item.type}</span><span>{item.members}</span><em>{item.status}</em><button onClick={() => { setOrganisations((items) => items.map((record) => record.name === item.name ? { ...record, status: record.status === "Active" ? "Review due" : "Active" } : record)); notify(`${item.name} status updated.`); }}>Manage</button></div>)}</div>
    <button className="button compact-button top-gap" onClick={() => { setOrganisations((items) => [...items, { name: "New partner application", type: "Pending organisation", members: 0, status: "Draft" }]); notify("New organisation draft created."); }}>Add organisation</button>
  </div>;

  if (tab === "profile") return <div className="dash-content"><PageIntro eyebrow="Authorised account administration" title="People" text="Manage staff access and class-level learner groups. Individual learner profiles are not exposed publicly." />
    <div className="organisation-list people-list"><div className="organisation-row organisation-head"><span>Name</span><span>Role</span><span>Assigned scope</span><span>Status</span><span>Action</span></div>{people.map((person) => <div className="organisation-row" key={person.name}><strong>{person.name}</strong><span>{person.role}</span><span>{person.group}</span><em>{person.status}</em><button disabled={person.status === "Protected"} onClick={() => { setPeople((items) => items.map((record) => record.name === person.name ? { ...record, status: record.status === "Active" ? "Suspended" : "Active" } : record)); notify(`${person.name} access updated.`); }}>{person.status === "Active" ? "Suspend" : person.status === "Suspended" ? "Activate" : "Restricted"}</button></div>)}</div>
  </div>;

  if (tab === "review") return <div className="dash-content"><PageIntro eyebrow="Permissions and safeguards" title="Access control" text="Issue joining codes, review public visibility and confirm the boundaries for each user role." />
    <div className="dash-grid admin-grid"><article className="dash-card access-card"><p className="eyebrow">Student access</p><h3>Time-limited joining code</h3><p>This fictional code is linked to Year 6 · Meranti and expires after seven days.</p><div className="access-code"><strong>{accessCode}</strong><span>4 uses left</span></div><button className="button compact-button" onClick={generateCode}>Generate new code</button></article><article className="dash-card"><p className="eyebrow">Public visibility</p><h3>Publication controls</h3><label className="toggle-row"><span><strong>Reviewed public library</strong><small>Only anonymised and approved work</small></span><input type="checkbox" checked={libraryPublic} onChange={(event) => { setLibraryPublic(event.target.checked); notify(`Public library ${event.target.checked ? "enabled" : "paused"}.`); }} /></label><ul className="permission-list"><li><span>School profile</span><b>Public</b></li><li><span>Student profiles</span><b className="private">Private</b></li><li><span>Learning progress</span><b className="private">Private</b></li></ul></article></div>
    <section className="dash-section"><div className="dash-title"><div><p>Role matrix</p><h2>Permission summary</h2></div><button onClick={() => notify("Permission summary downloaded.")}>Export summary</button></div><div className="permission-matrix"><div><strong>Student</strong><span>Own activities and submissions</span><b>No staff or peer records</b></div><div><strong>Teacher</strong><span>Assigned classes and review queue</span><b>No organisation-wide control</b></div><div><strong>Administrator</strong><span>Users, codes and public settings</span><b>No private submission content by default</b></div></div></section>
  </div>;

  if (tab === "insights") return <div className="dash-content"><PageIntro eyebrow="Anonymised operational data" title="Business insights" text="Monitor adoption and service use without exposing private student profiles or learning records." />
    <section className="metric-row admin-metrics"><article><span>Subscriptions</span><strong>24</strong><small>17 schools · 7 communities</small></article><article><span>Monthly active users</span><strong>1,248</strong><small>Up 8% from July</small></article><article><span>Service availability</span><strong>99.9%</strong><small>Demonstration target</small></article></section><div className="dash-grid"><article className="dash-card"><p className="eyebrow">Popular services</p><h3>Learning activities lead engagement.</h3><div className="bar-list"><p><span>Activities</span><i><b style={{ width: "88%" }} /></i><strong>44%</strong></p><p><span>Species library</span><i><b style={{ width: "64%" }} /></i><strong>32%</strong></p><p><span>Sightings</span><i><b style={{ width: "48%" }} /></i><strong>24%</strong></p></div></article><article className="dash-card"><p className="eyebrow">Data boundary</p><h3>Reports use grouped information.</h3><p>Public and business dashboards show organisation-level totals. Student names, messages and submissions are excluded.</p><button onClick={() => notify("An anonymised business summary was prepared.")}>Export anonymised summary →</button></article></div>
  </div>;

  if (tab === "messages") return <MessagesPanel role="admin" notify={notify} />;

  return <div className="dash-content"><section className="metric-row admin-metrics"><article><span>Organisation status</span><strong>Active</strong><small>Renewal in 143 days</small></article><article><span>Registered users</span><strong>41</strong><small>34 students · 6 teachers</small></article><article><span>Unused access codes</span><strong>12</strong><small>All expire within 7 days</small></article></section>
    <section className="dash-grid admin-grid"><article className="dash-card access-card"><p className="eyebrow">Student access</p><h3>Issue time-limited joining codes.</h3><p>Codes are linked to a class, expire automatically and can be cancelled before use.</p><div className="access-code"><strong>{accessCode}</strong><span>Year 6 · 4 uses left</span></div><button onClick={generateCode}>Generate a new code →</button></article><article className="dash-card"><p className="eyebrow">Public visibility</p><h3>School library only</h3><ul className="permission-list"><li><span>School profile</span><b>Public</b></li><li><span>Reviewed library</span><b>Public</b></li><li><span>Student profiles</span><b className="private">Private</b></li><li><span>Learning progress</span><b className="private">Private</b></li></ul></article></section>
    <section className="dash-section"><div className="dash-title"><div><p>Account security</p><h2>Recent audit events</h2></div><button onClick={() => notify("Audit summary downloaded.")}>Export audit</button></div><div className="audit-list"><p><span className="audit-icon">✓</span><strong>Teacher access approved</strong><em>Assigned class only</em><time>09:42</time></p><p><span className="audit-icon">↻</span><strong>Joining code generated</strong><em>Year 6 · Meranti</em><time>Yesterday</time></p><p><span className="audit-icon">i</span><strong>Public item anonymised</strong><em>Student identifier removed</em><time>Yesterday</time></p></div></section>
  </div>;
}

function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return <section className="page-intro"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2><p>{text}</p></section>;
}

function MessagesPanel({ role, notify }: { role: Role; notify: (message: string) => void }) {
  const initialMessages = role === "student"
    ? [{ from: "Ms Arini", subject: "Habitat map feedback", preview: "Your observation notes are strong.", time: "09:18" }, { from: "Komodo Hub", subject: "Quiz marked", preview: "Your species quiz result is ready.", time: "Yesterday" }]
    : role === "teacher"
      ? [{ from: "School administrator", subject: "New learner access", preview: "Three joining codes were issued.", time: "08:42" }, { from: "Student Explorer", subject: "Field activity question", preview: "Could you confirm the equipment list?", time: "Yesterday" }]
      : [{ from: "Forest Neighbours Network", subject: "Partner review", preview: "Our public profile is ready to check.", time: "10:03" }, { from: "Ms Arini", subject: "Access request", preview: "Please add the new Year 5 group.", time: "Yesterday" }];
  const [messages, setMessages] = useState(initialMessages);
  const [selected, setSelected] = useState(0);
  const [composeOpen, setComposeOpen] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [messageText, setMessageText] = useState("");
  const current = messages[selected] ?? messages[0];

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessages((items) => [{ from: `To: ${recipient}`, subject: "Sent message", preview: messageText, time: "Now" }, ...items]);
    setSelected(0);
    setComposeOpen(false);
    setRecipient("");
    setMessageText("");
    notify("Message sent inside the demonstration workspace.");
  }

  return <div className="dash-content"><div className="message-heading"><PageIntro eyebrow="Private communication" title="Messages" text="Use the demonstration inbox to read and send role-appropriate messages." /><button className="button compact-button" onClick={() => setComposeOpen(!composeOpen)}>{composeOpen ? "Close composer" : "New message"}</button></div>
    {composeOpen && <form className="compose-panel" onSubmit={sendMessage}><label>Recipient<input value={recipient} onChange={(event) => setRecipient(event.target.value)} placeholder={role === "student" ? "Assigned teacher" : "Name or organisation"} required /></label><label>Message<textarea value={messageText} onChange={(event) => setMessageText(event.target.value)} rows={4} required /></label><button className="button compact-button" type="submit">Send message</button></form>}
    <div className="message-layout"><div className="message-list">{messages.map((message, index) => <button key={`${message.from}-${index}`} className={selected === index ? "selected" : ""} onClick={() => setSelected(index)}><span><strong>{message.from}</strong><time>{message.time}</time></span><b>{message.subject}</b><small>{message.preview}</small></button>)}</div><article className="message-reader"><p className="eyebrow">{current?.time}</p><h2>{current?.subject}</h2><strong>{current?.from}</strong><p>{current?.preview} This demonstration keeps communication within the selected role and does not use real personal data.</p><button className="secondary-button" onClick={() => { setComposeOpen(true); setRecipient(current?.from ?? ""); }}>Reply</button></article></div>
  </div>;
}
