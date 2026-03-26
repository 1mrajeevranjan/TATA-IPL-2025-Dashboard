/* ============================================
   DATA PLUGIN — IPL Live Analytics
   API: api.cricapi.com (CricketData.org)
   Key: 0489f2c1-4680-4b06-b87c-d2785cf32635
   Falls back to rich mock data on any error.
   ============================================ */

// ─── Player ID Map (Enhanced with high-res official headshots) ──────────────
const PLAYER_IDS = {
  // Official IPL 2025/2024 Assets
  "Virat Kohli":       "https://documents.iplt20.com/ipl/IPLHeadshot2025/2.png",
  "Rohit Sharma":      "https://documents.iplt20.com/ipl/IPLHeadshot2025/6.png",
  "MS Dhoni":          "https://documents.iplt20.com/ipl/IPLHeadshot2025/57.png",
  "Shubman Gill":      "https://documents.iplt20.com/ipl/IPLHeadshot2025/62.png",
  "Jasprit Bumrah":    "https://documents.iplt20.com/ipl/IPLHeadshot2025/9.png",
  "Hardik Pandya":     "https://documents.iplt20.com/ipl/IPLHeadshot2025/54.png",
  "Rashid Khan":       "https://documents.iplt20.com/ipl/IPLHeadshot2025/218.png",
  "Ruturaj Gaikwad":   "https://documents.iplt20.com/ipl/IPLHeadshot2025/102.png",
  "Sanju Samson":      "https://documents.iplt20.com/ipl/IPLHeadshot2024/190.png",
  "Mohammed Shami":    "https://documents.iplt20.com/ipl/IPLHeadshot2023/47.png",
  
  // ESPNcricinfo Fallbacks
  "Travis Head":       "321500/321584.png",
  "Phil Salt":         "629300/629393.png",
  "Sunil Narine":      "230500/230558.png",
  "Harshal Patel":     "390400/390481.png",
  "Varun Chakaravarthy": "1172400/1172481.png",
  "T Natarajan":       "1075800/1075848.png",
  "Ravindra Jadeja":   "234600/234675.png",
  "Ishan Kishan":      "725300/725389.png",
  "Yuzvendra Chahal":  "430200/430246.png",
  "Heinrich Klaasen":   "436700/436757.png",
  "KL Rahul":          "422100/422144.png",
  "Andre Russell":     "276100/276193.png",
  "Chris Gayle":       "267700/267709.2.png",
  "David Warner":      "219800/219888.2.png",
  "Lasith Malinga":    "49700/49758.3.png",
  "Alzarri Joseph":    "821500/821557.png"
};

// ─── Team Config: Colors, Logos (Official ESPNcricinfo Assets) ──────────────
const IPL_TEAMS = {
  MI:   { name: "Mumbai Indians",          color: "#004BA0", accent: "#FFFFFF", logo: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160,q_50/lsci/db/PICTURES/CMS/414700/414793.png" },
  CSK:  { name: "Chennai Super Kings",     color: "#FDB913", accent: "#011B52", logo: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160,q_50/lsci/db/PICTURES/CMS/313400/313421.logo.png" },
  RCB:  { name: "Royal Challengers Bengaluru", color: "#EC1C24", accent: "#000000", logo: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160,q_50/lsci/db/PICTURES/CMS/378000/378049.png" },
  KKR:  { name: "Kolkata Knight Riders",   color: "#3A225D", accent: "#FFFFFF", logo: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160,q_50/lsci/db/PICTURES/CMS/313400/313419.logo.png" },
  SRH:  { name: "Sunrisers Hyderabad",     color: "#F7A721", accent: "#FFFFFF", logo: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160,q_50/lsci/db/PICTURES/CMS/414800/414845.png" },
  RR:   { name: "Rajasthan Royals",        color: "#EA1A85", accent: "#FFFFFF", logo: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160,q_50/lsci/db/PICTURES/CMS/400400/400406.png" },
  DC:   { name: "Delhi Capitals",          color: "#00008B", accent: "#EF1B23", logo: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160,q_50/lsci/db/PICTURES/CMS/313400/313422.logo.png" },
  LSG:  { name: "Lucknow Super Giants",    color: "#A72056", accent: "#FFFFFF", logo: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160,q_50/lsci/db/PICTURES/CMS/414000/414035.png" },
  GT:   { name: "Gujarat Titans",          color: "#1C1C1C", accent: "#0078BC", logo: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160,q_50/lsci/db/PICTURES/CMS/334700/334707.png" },
  PBKS: { name: "Punjab Kings",            color: "#ED1B24", accent: "#FFFFFF", logo: "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_160,q_50/lsci/db/PICTURES/CMS/414800/414846.png" },
};

// IPL 2025 Series ID on CricAPI (Example ID, will fall back to mock data)
const IPL_SERIES_ID = "f7c36a4d-045a-4e89-bd0e-7f1548e65f3a"; // IPL 2025 Placeholder

class DataPlugin {
  constructor() {
    this.API_KEY   = "0489f2c1-4680-4b06-b87c-d2785cf32635";
    this.BASE_URL  = "https://api.cricapi.com/v1";
    this.cache     = {};      // in-memory cache
    this.CACHE_TTL = 60000;   // 60 seconds
    this.season    = "2025";
  }

  // ── Core fetch with cache & error handling ──────────────────────────────────
  async _fetch(endpoint, params = {}) {
    const url = new URL(`${this.BASE_URL}/${endpoint}`);
    url.searchParams.set("apikey", this.API_KEY);
    url.searchParams.set("offset", params.offset || 0);
    Object.entries(params).forEach(([k, v]) => { if (k !== "offset") url.searchParams.set(k, v); });

    const cacheKey = url.toString();
    const now = Date.now();
    if (this.cache[cacheKey] && now - this.cache[cacheKey].ts < this.CACHE_TTL) {
      return this.cache[cacheKey].data;
    }

    try {
      const res  = await fetch(url.toString());
      const json = await res.json();
      if (json.status !== "success") throw new Error(json.reason || "API error");
      this.cache[cacheKey] = { data: json.data, ts: now };
      return json.data;
    } catch (err) {
      console.warn(`[DataPlugin] API failed for "${endpoint}":`, err.message);
      return null; // caller handles null → fallback
    }
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────
  getCountryFlag(countryName) {
    const flags = {
      "India": "in", "Australia": "au", "England": "gb", "South Africa": "za",
      "New Zealand": "nz", "Pakistan": "pk", "Sri Lanka": "lk", "West Indies": "wi",
      "Bangladesh": "bd", "Afghanistan": "af", "Ireland": "ie", "Zimbabwe": "zw"
    };
    const code = flags[countryName] || "un";
    return `https://flagcdn.com/w80/${code}.png`;
  }

  getESPNImage(resourceId, type = "logo") {
    if (!resourceId) return null;
    const transform = type === "headshot" ? "t_ds_square_w_320,q_50" : "t_ds_square_w_160,q_50";
    return `https://img1.hscicdn.com/image/upload/f_auto,${transform}/lsci/db/PICTURES/CMS/${resourceId}`;
  }

  getTeamInfo(shortCode) {
    const upper = shortCode?.toUpperCase();
    if (IPL_TEAMS[upper]) return { ...IPL_TEAMS[upper], short: upper };
    return {
      short: upper,
      name: shortCode, 
      color: "#4edea3", 
      accent: "#fff", 
      logo: this.getCountryFlag(shortCode) 
    };
  }

  getPlayerPhotoUrl(cricapiId) {
    return cricapiId
      ? `${this.BASE_URL}/players_info?apikey=${this.API_KEY}&id=${cricapiId}`
      : null;
  }

  playerAvatar(name, team = "cricket") {
    // Try our curated asset map first
    const asset = PLAYER_IDS[name];
    if (asset) {
      if (asset.startsWith("http")) return asset; // Direct official link
      return this.getESPNImage(asset, "headshot"); // ESPNcricinfo resource ID
    }

    // Fallback to UI-Avatars
    const initials = name.split(" ").map(w => w[0]).join("").toUpperCase();
    const teamConf = Object.values(IPL_TEAMS).find(t => t.name.includes(team)) || IPL_TEAMS.RCB;
    const bg = teamConf.color.replace("#", "");
    const fg = teamConf.accent.replace("#", "");
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=${fg}&size=200&bold=true&font-size=0.4`;
  }


  // ── Live Match ────────────────────────────────────────────────────────────
  async getLiveMatch() {
    const data = await this._fetch("currentMatches");

    if (data && Array.isArray(data)) {
      // Find IPL match specifically
      const iplMatch = data.find(m => m.series_id === IPL_SERIES_ID || m.name?.includes("IPL") || m.name?.includes("Indian Premier League"));
      const match = iplMatch || data.find(m => m.matchType === "t20") || data[0];
      
      if (match) {
        const [t1, t2] = match.teams || [];
        const inn      = match.score || [];
        const score1   = inn[0] ? `${inn[0].r}/${inn[0].w}` : "—";
        const score2   = inn[1] ? `${inn[1].r}/${inn[1].w}` : "Yet to bat";
        const overs1   = inn[0]?.o || "0.0";
        const overs2   = inn[1]?.o || "0.0";
        return {
          matchId: match.id,
          team1: { name: t1, short: t1?.slice(0,3)?.toUpperCase(), score: score1, overs: overs1, ...this.getTeamInfo(t1?.slice(0,3)) },
          team2: { name: t2, short: t2?.slice(0,3)?.toUpperCase(), score: score2, overs: overs2, ...this.getTeamInfo(t2?.slice(0,3)) },
          status: match.status || "Match in progress",
          batsmen: [],
          bowler: {},
          winProb: 50
        };
      }
    }

    // Fallback for 2025
    return {
      matchId: "MUMvCSK25",
      team1: { name: "Mumbai Indians",     short: "MI",  score: "185/6", overs: "20.0", ...this.getTeamInfo("MI")  },
      team2: { name: "Chennai Super Kings", short: "CSK", score: "142/3", overs: "14.2", ...this.getTeamInfo("CSK") },
      status: "Chennai requires 44 runs from 34 balls.",
      batsmen: [
        { name: "Ruturaj Gaikwad", runs: 58, balls: 32, strikeRate: "181.25", avatar: this.playerAvatar("Ruturaj Gaikwad", "CSK") },
        { name: "Shivam Dube",     runs: 24, balls: 12, strikeRate: "200.00", onStrike: true, avatar: this.playerAvatar("Shivam Dube", "CSK") }
      ],
      bowler: { name: "Jasprit Bumrah", overs: 2.2, runs: 18, wickets: 1, economy: "7.71" },
      winProb: 48
    };
  }

  // ── Full Schedule ─────────────────────────────────────────────────────────
  async getSchedule() {
    return [
      { id: "101", date: "2025-03-22", time: "19:30", teams: ["CSK", "RCB"], venue: "Chennai", status: "Completed", result: "CSK won by 6 wickets" },
      { id: "102", date: "2025-03-23", time: "15:30", teams: ["PBKS", "DC"], venue: "Chandigarh", status: "Completed", result: "PBKS won by 4 wickets" },
      { id: "103", date: "2025-03-23", time: "19:30", teams: ["KKR", "SRH"], venue: "Kolkata", status: "Completed", result: "KKR won by 4 runs" },
      { id: "104", date: "2025-03-24", time: "19:30", teams: ["RR", "LSG"], venue: "Jaipur", status: "Completed", result: "RR won by 20 runs" },
      { id: "105", date: "2025-03-24", time: "19:30", teams: ["GT", "MI"], venue: "Ahmedabad", status: "Completed", result: "GT won by 6 runs" },
      { id: "106", date: "2025-03-25", time: "19:30", teams: ["RCB", "PBKS"], venue: "Bengaluru", status: "Live", result: "Match in progress" },
      { id: "107", date: "2025-03-26", time: "19:30", teams: ["CSK", "GT"], venue: "Chennai", status: "Upcoming", result: "Starts at 19:30 IST" },
      { id: "108", date: "2025-03-27", time: "19:30", teams: ["SRH", "MI"], venue: "Hyderabad", status: "Upcoming", result: "Starts at 19:30 IST" },
    ];
  }

  // ── Venues ────────────────────────────────────────────────────────────────
  async getVenues() {
    return [
      { name: "MA Chidambaram Stadium", city: "Chennai", matches: 7, avgScore: 172, capacity: "50,000", image: "https://documents.iplt20.com//ipl/assets/images/stadium/Chennai-new.webp" },
      { name: "Narendra Modi Stadium", city: "Ahmedabad", matches: 9, avgScore: 185, capacity: "132,000", image: "https://documents.iplt20.com//ipl/assets/images/stadium/Narendra-new.webp" },
      { name: "Wankhede Stadium", city: "Mumbai", matches: 7, avgScore: 180, capacity: "33,000", image: "https://documents.iplt20.com//ipl/assets/images/stadium/Wankhede-Stadium-new.webp" },
      { name: "Eden Gardens", city: "Kolkata", matches: 7, avgScore: 178, capacity: "66,000", image: "https://documents.iplt20.com//ipl/assets/images/stadium/eden-garden-small-new.webp" },
      { name: "M. Chinnaswamy Stadium", city: "Bengaluru", matches: 7, avgScore: 192, capacity: "40,000", image: "https://documents.iplt20.com//ipl/assets/images/stadium/M.Chinnaswamy-Stadium.webp" },
    ];
  }

  // ── Records ───────────────────────────────────────────────────────────────
  async getTournamentRecords() {
    return {
      batting: [
        { name: "Virat Kohli", record: "Most Runs (8,000+)", details: "Across all seasons", img: this.playerAvatar("Virat Kohli") },
        { name: "Chris Gayle", record: "Highest Individual Score (175*)", details: "vs PWI, 2013", img: this.playerAvatar("Chris Gayle") },
        { name: "David Warner", record: "Most Fifties (62)", details: "Orange Cap winner 3 times", img: this.playerAvatar("David Warner") }
      ],
      bowling: [
        { name: "Yuzvendra Chahal", record: "Most Wickets (200)", details: "Leading all-time taker", img: this.playerAvatar("Yuzvendra Chahal") },
        { name: "Lasith Malinga", record: "Best Strike Rate (16.6)", details: "IPL Legend", img: this.playerAvatar("Lasith Malinga") },
        { name: "Alzarri Joseph", record: "Best Bowling Figures (6/12)", details: "vs SRH, 2019", img: this.playerAvatar("Alzarri Joseph") }
      ]
    };
  }

  // ── Recent Matches (Last 5) ────────────────────────────────────────────────
  async getRecentMatches() {
    const data = await this._fetch("series_info", { id: IPL_SERIES_ID });
    if (data && data.matchList && data.matchList.length) {
      // Filter for completed matches and take last 5
      return data.matchList
        .filter(m => m.status.includes("won") || m.status.includes("Result") || m.status.includes("tied"))
        .slice(0, 5)
        .map(m => {
          const teams = m.name.split(" vs ");
          return {
            id: m.id,
            teams: teams,
            scores: m.status.split(",").map(s => s.trim()),
            result: m.status,
            date: m.date,
            venue: m.venue
          };
        });
    }
    // Fallback
    return [
      { id: "1", teams: ["RCB", "CSK"], scores: ["218/5", "191/7"], result: "RCB won by 27 runs", date: "2024-05-18", venue: "Bengaluru" },
      { id: "2", teams: ["SRH", "GT"], scores: ["—", "—"], result: "No result (Abandoned)", date: "2024-05-16", venue: "Hyderabad" },
      { id: "3", teams: ["RR", "PBKS"], scores: ["144/9", "145/5"], result: "PBKS won by 5 wickets", date: "2024-05-15", venue: "Guwahati" },
      { id: "4", teams: ["DC", "LSG"], scores: ["208/4", "189/9"], result: "DC won by 19 runs", date: "2024-05-14", venue: "Delhi" },
      { id: "5", teams: ["KKR", "MI"], scores: ["157/7", "139/8"], result: "KKR won by 18 runs", date: "2024-05-11", venue: "Kolkata" }
    ];
  }

  // ── All Team Stats (Calculated) ────────────────────────────────────────────
  async getAllTeamStats() {
    const pointsTable = await this.getPointsTable();
    // In a real app, we'd fetch individual team stats; here we enrich the points table data
    return pointsTable.map(t => ({
      ...t,
      ...this.getTeamInfo(t.team),
      form: ["W", "W", "L", "W", "L"], // Mock form guide
      topScorer: "Player Name",
      topBowler: "Player Name"
    }));
  }

  // ── Player Info (photo + bio) ─────────────────────────────────────────────
  async getPlayerInfo(playerName) {
    const id = PLAYER_IDS[playerName];
    if (id) {
      const data = await this._fetch("players_info", { id });
      if (data) {
        return {
          id,
          name:    data.name || playerName,
          country: data.country || "India",
          role:    data.playerRole || "Batsman",
          image:   data.playerImg || this.playerAvatar(playerName),
          dob:     data.dateOfBirth || "—",
          bat:     data.batting || {},
          bowl:    data.bowling || {}
        };
      }
    }
    // Fallback: generated avatar
    return {
      name: playerName,
      role: "Batsman",
      image: this.playerAvatar(playerName),
      country: "India"
    };
  }

  // ── Series Squad (team roster) ────────────────────────────────────────────
  async getTeamSquad(seriesId = IPL_SERIES_ID, teamId = null) {
    const data = await this._fetch("series_squad", { id: seriesId });
    if (data && Array.isArray(data)) {
      const squad = teamId ? data.find(d => d.teamId === teamId) : data[0];
      return squad?.players || [];
    }
    return [];
  }

  // ── Top Run Scorers (Orange Cap Race) ─────────────────────────────────────
  async getTopRunScorers() {
    // CricAPI doesn't have a direct "batting stats" endpoint on free plan;
    // We try to get series stats and fall back gracefully.
    const data = await this._fetch("series_info", { id: IPL_SERIES_ID });
    if (data && data.pointsTable && data.pointsTable.length) {
      // Derive from the series data if available
    }
    // Rich fallback with images
    return [
      { name: "Virat Kohli",    team: "RCB",  inns: 12, runs: 634, avg: 63.4, img: this.playerAvatar("Virat Kohli", "RCB"),       teamColor: IPL_TEAMS.RCB.color },
      { name: "Ruturaj Gaikwad",team: "CSK",  inns: 12, runs: 541, avg: 54.1, img: this.playerAvatar("Ruturaj Gaikwad", "CSK"),  teamColor: IPL_TEAMS.CSK.color },
      { name: "Travis Head",    team: "SRH",  inns: 11, runs: 533, avg: 53.3, img: this.playerAvatar("Travis Head", "SRH"),      teamColor: IPL_TEAMS.SRH.color },
      { name: "Sanju Samson",   team: "RR",   inns: 11, runs: 471, avg: 47.1, img: this.playerAvatar("Sanju Samson", "RR"),      teamColor: IPL_TEAMS.RR.color },
      { name: "Phil Salt",      team: "KKR",  inns: 12, runs: 429, avg: 39.0, img: this.playerAvatar("Phil Salt", "KKR"),        teamColor: IPL_TEAMS.KKR.color },
    ];
  }

  // ── Top Wicket Takers (Purple Cap) ────────────────────────────────────────
  async getTopWicketTakers() {
    return [
      { name: "Jasprit Bumrah",      team: "MI",   matches: 12, wickets: 20, econ: 6.48, img: this.playerAvatar("Jasprit Bumrah", "MI"),          teamColor: IPL_TEAMS.MI.color  },
      { name: "Harshal Patel",       team: "PBKS", matches: 12, wickets: 20, econ: 9.20, img: this.playerAvatar("Harshal Patel", "PBKS"),         teamColor: IPL_TEAMS.PBKS.color},
      { name: "Varun Chakaravarthy", team: "KKR",  matches: 12, wickets: 18, econ: 8.12, img: this.playerAvatar("Varun Chakaravarthy", "KKR"),    teamColor: IPL_TEAMS.KKR.color },
      { name: "Sunil Narine",        team: "KKR",  matches: 12, wickets: 14, econ: 6.61, img: this.playerAvatar("Sunil Narine", "KKR"),           teamColor: IPL_TEAMS.KKR.color },
      { name: "T Natarajan",         team: "SRH",  matches: 10, wickets: 13, econ: 9.35, img: this.playerAvatar("T Natarajan", "SRH"),            teamColor: IPL_TEAMS.SRH.color },
    ];
  }

  // ── Points Table ─────────────────────────────────────────────────────────
  async getPointsTable() {
    const data = await this._fetch("series_info", { id: IPL_SERIES_ID });
    if (data && data.pointsTable && data.pointsTable.length) {
      return data.pointsTable.map((item, idx) => ({
        rank:    idx + 1,
        team:    item.teamSName || item.teamName,
        played:  item.matchesPlayed || 0,
        won:     item.matchesWon || 0,
        lost:    item.matchesLost || 0,
        points:  item.points || 0,
        nrr:     item.nrr || "+0.00",
        logo:    this.getTeamInfo(item.teamSName)?.logo
      }));
    }
    // Fallback
    return [
      { rank: 1, team: "KKR",  logo: IPL_TEAMS.KKR.logo,  played: 12, won: 9, lost: 3, points: 18, nrr: "+1.428" },
      { rank: 2, team: "RR",   logo: IPL_TEAMS.RR.logo,   played: 12, won: 8, lost: 4, points: 16, nrr: "+0.349" },
      { rank: 3, team: "CSK",  logo: IPL_TEAMS.CSK.logo,  played: 13, won: 7, lost: 6, points: 14, nrr: "+0.528" },
      { rank: 4, team: "SRH",  logo: IPL_TEAMS.SRH.logo,  played: 12, won: 7, lost: 5, points: 14, nrr: "+0.406" },
      { rank: 5, team: "DC",   logo: IPL_TEAMS.DC.logo,   played: 13, won: 6, lost: 7, points: 12, nrr: "-0.482" },
      { rank: 6, team: "LSG",  logo: IPL_TEAMS.LSG.logo,  played: 12, won: 6, lost: 6, points: 12, nrr: "-0.769" },
      { rank: 7, team: "RCB",  logo: IPL_TEAMS.RCB.logo,  played: 13, won: 6, lost: 7, points: 12, nrr: "+0.387" },
      { rank: 8, team: "GT",   logo: IPL_TEAMS.GT.logo,   played: 13, won: 5, lost: 8, points: 10, nrr: "-1.063" },
      { rank: 9, team: "PBKS", logo: IPL_TEAMS.PBKS.logo, played: 12, won: 4, lost: 8, points: 8,  nrr: "-0.423" },
      { rank:10, team: "MI",   logo: IPL_TEAMS.MI.logo,   played: 13, won: 4, lost: 9, points: 8,  nrr: "-0.271" },
    ];
  }

  // ── Season KPIs ───────────────────────────────────────────────────────────
  async getSeasonKPIs() {
    const data = await this._fetch("series_info", { id: IPL_SERIES_ID });
    return {
      teams: 10,
      matchesPlayed: data?.matchList?.length || 65,
      totalRuns: data?.totalRuns || 23412,
      sixes: data?.totalSixes || 1142
    };
  }

  // ── Chart Data Generators ─────────────────────────────────────────────────
  generateWormData(totalOvers = 20) {
    let s1 = 0, s2 = 0;
    const team1 = [], team2 = [], labels = [];
    const wickets1 = [], wickets2 = [];
    
    for (let i = 1; i <= totalOvers; i++) {
      labels.push(String(i));
      
      // Team 1
      s1 += Math.floor(Math.random() * 13 + 3);
      team1.push(s1);
      if (Math.random() < 0.15 && wickets1.length < 10) {
        wickets1.push(i - 1); // pushing index
      }

      // Team 2
      if (i <= 18) {
        s2 += Math.floor(Math.random() * 14 + 2);
        team2.push(s2);
        if (Math.random() < 0.2 && wickets2.length < 10) {
          wickets2.push(i - 1); // pushing index
        }
      }
    }
    return { labels, team1, team2, wickets1, wickets2 };
  }

  generateRunRateData() {
    const labels = Array.from({ length: 20 }, (_, i) => `${i + 1}`);
    const runs = labels.map(() => Math.floor(Math.random() * 20));
    return { labels, runs };
  }

  // Player career run data (example for Kohli - would be replaced with live stat API)
  getPlayerCareerData(playerName = "Virat Kohli") {
    const data = {
      "Virat Kohli":       { labels: ['2018','2019','2020','2021','2022','2023','2024'], values: [530, 464, 466, 405, 341, 639, 634] },
      "Rohit Sharma":      { labels: ['2018','2019','2020','2021','2022','2023','2024'], values: [286, 405, 332, 381, 268, 332, 417] },
      "Ruturaj Gaikwad":   { labels: ['2020','2021','2022','2023','2024'], values: [204, 635, 368, 590, 583] },
      "Shubman Gill":      { labels: ['2019','2020','2021','2022','2023','2024'], values: [296, 440, 478, 483, 890, 426] },
      "KL Rahul":          { labels: ['2018','2019','2020','2021','2022','2023','2024'], values: [659, 593, 670, 626, 616, 273, 520] },
      "Travis Head":       { labels: ['2016','2017','2024'], values: [54, 151, 567] },
      "Sanju Samson":      { labels: ['2018','2019','2020','2021','2022','2023','2024'], values: [441, 342, 375, 484, 458, 362, 531] },
      "Heinrich Klaasen":   { labels: ['2018','2023','2024'], values: [38, 448, 479] },
    };
    return data[playerName] || { labels: ['2020','2021','2022','2023','2024'], values: [200, 350, 400, 320, 280] };
  }

  // Past H2H Performance between two teams
  getTeamH2H(team1Short, team2Short) {
    const h2h = {
      "KKR-RR": { matches: 30, t1Wins: 15, t2Wins: 14, ties: 1 },
      "MI-CSK":  { matches: 34, t1Wins: 18, t2Wins: 16, ties: 0 },
      "RCB-MI":  { matches: 32, t1Wins: 12, t2Wins: 20, ties: 0 },
    };
    const key = `${team1Short}-${team2Short}`;
    const rev = `${team2Short}-${team1Short}`;
    return h2h[key] || h2h[rev] || { matches: 20, t1Wins: 10, t2Wins: 10, ties: 0 };
  }

  // ── Team Stat Radar Data ──────────────────────────────────────────────────
  getTeamRadarData(team1Short = "KKR", team2Short = "RR") {
    const teamStats = {
      KKR:  [85, 90, 75, 80, 95],
      RR:   [90, 85, 80, 75, 85],
      MI:   [95, 70, 90, 65, 88],
      CSK:  [80, 95, 70, 92, 78],
      RCB:  [92, 72, 68, 80, 70],
      SRH:  [88, 80, 85, 70, 82],
      DC:   [75, 78, 82, 72, 80],
      GT:   [80, 85, 78, 88, 75],
      PBKS: [82, 70, 75, 68, 72],
      LSG:  [78, 80, 72, 75, 80]
    };
    return {
      labels: ['Batting Powerplay', 'Middle Overs', 'Death Bowling', 'Spin Quality', 'Fielding'],
      series: [
        { name: team1Short, data: teamStats[team1Short] || [80,80,80,80,80] },
        { name: team2Short, data: teamStats[team2Short] || [75,75,75,75,75] }
      ]
    };
  }

  // Get the next upcoming match
  async getNextMatch() {
    return {
      teams: ["RR", "RCB"],
      date: "Tomorrow, 7:30 PM",
      venue: "Sawai Mansingh Stadium, Jaipur",
      odds: { "RR": "1.85", "RCB": "1.95" },
      promoImg: "https://documents.iplt20.com/ipl/IPLv2/logos/top-hero/RR.png"
    };
  }

  // Get high-level tournament records for "Pulse" section
  async getTournamentHighs() {
    return [
      { label: "Highest Score", value: "287/3", subtitle: "SRH vs RCB", icon: "poker_chip" },
      { label: "Best Figures", value: "5/21", subtitle: "J. Bumrah (MI)", icon: "sports_cricket" },
      { label: "Longest Six", value: "112m", subtitle: "M. Dhoni (CSK)", icon: "bolt" },
      { label: "Fastest 50", value: "14 balls", subtitle: "Y. Jaiswal (RR)", icon: "speed" }
    ];
  }
}

// ─── Global ──────────────────────────────────────────────────────────────────
window.api = new DataPlugin();
window.IPL_TEAMS = IPL_TEAMS;
window.PLAYER_IDS = PLAYER_IDS;
