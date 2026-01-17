import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// CSV data from August-November 2025
const csvData = `Datum,Kunde,Projekt,Stundensatz,Stunden,Jahr
01.08.,Goodwins,BIO_25-003_DennsBioMarkt_Segmentierungsstudie,106.25,8,2025
04.08.,Goodwins,BIO_25-003_DennsBioMarkt_Segmentierungsstudie,106.25,8,2025
05.08.,Goodwins,BIO_25-003_DennsBioMarkt_Segmentierungsstudie,106.25,8,2025
07.08.,Goodwins,BIO_25-004_DennsBioMarkt_Markenstrategie,106.25,8,2025
19.08.,Goodwins,SMA Technology Messaging Boards,106.25,8,2025
20.08.,Overfly,365Sherpas Kickoff,112.5,2,2025
21.08.,Goodwins,SMA Technology Messaging Boards,106.25,4,2025
28.08.,C&C,Workshop,1800,1,2025
30.08.,Goodwins,BIO_25-004_DennsBioMarkt_Markenstrategie,106.25,6,2025
01.09.,Overfly,365Sherpas Kickoff,112.5,3.5,2025
02.09.,Overfly,365Sherpas Kickoff,112.5,3,2025
03.09.,Overfly,365Sherpas Kickoff,112.5,3.5,2025
04.09.,Overfly,365Sherpas Kickoff,112.5,3,2025
05.09.,Overfly,365Sherpas Kickoff,112.5,3.5,2025
08.09.,Overfly,365Sherpas Kickoff,112.5,7,2025
09.09.,Overfly,365Sherpas Kickoff,112.5,5.5,2025
10.09.,Overfly,365Sherpas Kickoff,112.5,4,2025
11.09.,Overfly,365Sherpas Kickoff,112.5,1,2025
11.09.,Overfly,RDE: Einlesen + Weekly,112.5,3.5,2025
12.09.,Overfly,365Sherpas Recap Workshop,112.5,1,2025
12.09.,Overfly,RDE: Abstimmung Use Cases Pink Sunrise + Nachbereitung,112.5,2,2025
15.09.,Overfly,RDE: Abstimmung Pink Sunrise + Vorbereitung Meeting,112.5,3,2025
16.09.,Overfly,RDE: Workshop,112.5,8,2025
24.09.,Overfly,365Sherpas Recap Workshop,112.5,3,2025
25.09.,Overfly,365Sherpas Recap Workshop,112.5,3,2025
26.09.,Overfly,Cybus: Einlesen + Termin,112.5,1.5,2025
26.09.,Goodwins,Heitmann: Projekt,106.25,0.75,2025
26.09.,Overfly,365Sherpas Recap Workshop,112.5,1,2025
29.09.,Overfly,365Sherpas Recap Workshop,112.5,2,2025
29.09.,Goodwins,Heitmann: Projekt,106.25,1,2025
30.09.,Overfly,365Sherpas Recap Workshop,112.5,3,2025
30.09.,Goodwins,Heitmann: Projekt,106.25,1,2025
01.10.,Overfly,Cybus: Meeting und Absprache,100,1.5,2025
01.10.,Overfly,Start: Interne Themen etc.,100,6,2025
02.10.,Overfly,Plan Interne Roadmap,100,3,2025
02.10.,Goodwins,Heitmann: Personas,106.25,1.5,2025
06.10.,Goodwins,Heitmann: Personas,106.25,4,2025
06.10.,Overfly,Status + Talk Christian,100,2.25,2025
07.10.,Goodwins,Heitmann: Personas,106.25,2.5,2025
07.10.,Overfly,365 Sherpas: Talk Benjamin + Nachbereitung,100,2,2025
07.10.,Overfly,Intern: Montags-Meeting Status,100,1.5,2025
07.10.,Overfly,Intern: Roadmap + Gedanken,100,1,2025
08.10.,Goodwins,Heitmann: Personas,106.25,0.5,2025
08.10.,Overfly,Intern: Research Knowledge,100,3,2025
08.10.,Overfly,365 Sherpas: Vorgehen + Meeting,100,2,2025
08.10.,Overfly,365 Sherpas: Absprache Strategie-WS,100,2,2025
09.10.,Goodwins,Heitmann: Personas,106.25,6,2025
09.10.,Overfly,365 Sherpas: Call Imagine-Intro,100,1,2025
09.10.,Overfly,Intern: Meeting Christian etc.,100,1,2025
10.10.,Goodwins,Heitmann: Personas,106.25,4,2025
10.10.,Overfly,Cybus: Call,100,1,2025
10.10.,Overfly,365 Sherpas: Call Benjamin,100,1.5,2025
13.10.,Goodwins,Heitmann: Personas,106.25,4.5,2025
13.10.,Overfly,Status & Orga,100,1.5,2025
13.10.,Overfly,Sherpas: Follow Up 2.0 Vorbereitung,100,3,2025
14.10.,Overfly,Sherpas: Follow Up 2.0 Vorbereitung,100,5,2025
14.10.,Overfly,Interner Strategie-Workshop,100,3.5,2025
14.10.,Goodwins,Heitmann: Personas,106.25,2,2025
15.10.,Overfly,Sherpas: Follow Meeting + Überarbeitung Präse,100,3,2025
15.10.,Overfly,Interner Strategie-Workshop,100,4,2025
20.10.,Overfly,Interner Strategie-Workshop,100,2.75,2025
20.10.,Overfly,Weekly,100,0.5,2025
21.10.,Overfly,Sherpas: Follow Meeting + Überarbeitung Präse,100,4.5,2025
21.10.,Overfly,Interner Strategie-Workshop,100,4,2025
22.10.,Overfly,Meeting Förder Seedwise,100,0.5,2025
22.10.,Overfly,Interner Strategie-Workshop,100,2,2025
22.10.,Overfly,Sherpas: Follow Meeting + Überarbeitung Präse,100,3,2025
23.10.,Overfly,Sherpas: Follow Meeting + Überarbeitung Präse,100,2.5,2025
23.10.,Overfly,Interner Strategie-Workshop,100,2,2025
23.10.,Overfly,Interner Kram,100,2,2025
24.10.,Overfly,Sherpas: Überarbeitung Angebot 2,100,3,2025
24.10.,Overfly,Interner Strategie-Workshop,100,1.5,2025
27.10.,Overfly,Sherpas: Überabreitung + Präsentation,100,6,2025
27.10.,Overfly,Montagsrunde,100,0.75,2025
27.10.,Overfly,Interner Strategie-Workshop: Interview etc.,100,1.5,2025
28.10.,Overfly,Sherpas: Nachklapper,100,2,2025
28.10.,Overfly,Interner Strategie-Workshop: Interview etc.,100,6.5,2025
29.10.,Overfly,Ferrero: Absprache,100,0.5,2025
29.10.,Overfly,Interner Strategie-Workshop: Interview etc.,100,1,2025
29.10.,Overfly,Sejer Pedersen: Präsentation bauen,100,6.5,2025
30.10.,Overfly,Sejer Pedersen: Präsentation bauen,100,1,2025
30.10.,Overfly,Ferrero: Absprache,100,1.5,2025
30.10.,Overfly,Interner Strategie-Workshop: Interview etc.,100,5,2025
03.11.,Overfly,Ferrero: Vorbereitungen,100,5,2025
04.11.,Overfly,Ferrero: Vorbereitungen,100,2,2025
05.11.,Overfly,Sherpas: Überarbeitung,100,2,2025
06.11.,Overfly,Sherpas: Überarbeitung,100,2,2025
06.11.,Overfly,Interne Absprachen,100,1,2025
06.11.,Overfly,Intern: KI-Strategie at Overfly,100,2,2025
07.11.,Overfly,Ferrero: Absprache + Recap Wochentermin,100,2,2025
07.11.,Overfly,Intern: Strategie-Workshop Vorbereitungen,100,5,2025
10.11.,Overfly,Ferrero Abstimmung,100,1,2025
10.11.,Overfly,Interner Status & Call,100,1,2025
10.11.,Overfly,Strategie-Workshop: Vorbereitung,100,1,2025
11.11.,Overfly,Strategie-Workshop: Part 2,100,6,2025
11.11.,Overfly,KI-Strategie Produktisierung,100,2,2025
12.11.,Overfly,Ferrero Support Scoping etc.,100,1.5,2025
12.11.,Overfly,KI-Strategie Produktisierung,100,2.5,2025
12.11.,Overfly,Website-Konzept,100,2,2025
13.11.,Overfly,Sherpas: Kommunikation,100,0.5,2025
13.11.,Overfly,Ferrero Meeting + Support Scoping etc.,100,2,2025
13.11.,Overfly,KI-Strategie Produktisierung + Website-Konzept,100,4,2025
14.11.,Overfly,KI-Strategie Produktisierung + Website-Konzept,100,5,2025
14.11.,Joan,Briefing ebay Live,112.5,1,2025
16.11.,Joan,ebay Einlesen,112.5,3,2025
16.11.,Overfly,KI-Strategie Produktisierung,100,1,2025
17.11.,Joan,eBay: Meeting + Fragen,112.5,3,2025
17.11.,Overfly,KI-Strategie Produktisierung,100,3.5,2025
17.11.,Overfly,Team-Meeting & Intern,100,1.5,2025
18.11.,Joan,eBay: Meeting + Research,112.5,7.5,2025
18.11.,Overfly,KI-Strategie Produktisierung Meeting,100,1,2025
18.11.,Overfly,Sherpas: Call + Nachbereitung,100,0.75,2025
19.11.,Joan,Strategie Story + Meeting US + Meeting Thijs,112.5,5,2025
19.11.,Overfly,Sejer Pedersen Nachklapper,100,1,2025
19.11.,Overfly,Ferrero: Gespräch + Nachklapper,100,0.75,2025
19.11.,Overfly,Interner Stuff,100,2,2025
20.11.,Joan,Tag im Office: Meetings + Austausch UK/US,112.5,8,2025
21.11.,Joan,Vorbereitung Call Global + Herleitung 3-2-1 meins,112.5,8,2025
21.11.,Overfly,Abstimmung Ferrero,100,0.5,2025
24.11.,Joan,Ausarbeitung Präsentation 3-2-1 Meins,112.5,9,2025
24.11.,Overfly,Weekly + Ad Hoc Nachrichten,100,1,2025
25.11.,Joan,Ausarbeitung Creative Brief + Strategie-Präsentation,112.5,8.5,2025
25.11.,Goodwins,Einlesen Heitmann,106.25,1,2025
26.11.,Joan,Ausarbeitung Creative Brief + Strategie-Präsentation,112.5,4,2025`;

async function importData() {
  console.log('Starting import of 2025 data...');

  // Parse CSV
  const lines = csvData.trim().split('\n').slice(1); // Skip header

  // Collect unique clients and their rates
  const clientsMap = new Map<string, number>();
  const projectsMap = new Map<string, { client: string; rate: number }>();

  for (const line of lines) {
    const [datum, kunde, projekt, stundensatz, stunden, jahr] = line.split(',');
    if (!kunde || !projekt) continue;

    const rate = parseFloat(stundensatz) || 100;
    const clientName = kunde === 'JOAN' ? 'Joan' : kunde; // Normalize

    // Store highest rate for client
    if (!clientsMap.has(clientName) || clientsMap.get(clientName)! < rate) {
      clientsMap.set(clientName, rate);
    }

    // Store project with client and rate
    const projectKey = `${clientName}::${projekt}`;
    if (!projectsMap.has(projectKey)) {
      projectsMap.set(projectKey, { client: clientName, rate });
    }
  }

  // Create clients
  console.log('Creating/checking clients...');
  const clientIds = new Map<string, string>();

  for (const [name, rate] of clientsMap) {
    // Check if client exists
    const { data: existing } = await supabase
      .from('clients')
      .select('id')
      .eq('name', name)
      .single();

    if (existing) {
      clientIds.set(name, existing.id);
      console.log(`  Client "${name}" already exists`);
    } else {
      const { data, error } = await supabase
        .from('clients')
        .insert({ name, hourly_rate: rate })
        .select('id')
        .single();

      if (error) {
        console.error(`  Error creating client "${name}":`, error);
      } else {
        clientIds.set(name, data.id);
        console.log(`  Created client "${name}" with rate ${rate}€`);
      }
    }
  }

  // Create projects
  console.log('Creating/checking projects...');
  const projectIds = new Map<string, string>();

  for (const [key, { client, rate }] of projectsMap) {
    const [, projektName] = key.split('::');
    const clientId = clientIds.get(client);

    if (!clientId) {
      console.error(`  No client ID for "${client}"`);
      continue;
    }

    // Check if project exists
    const { data: existing } = await supabase
      .from('projects')
      .select('id')
      .eq('name', projektName)
      .eq('client_id', clientId)
      .single();

    if (existing) {
      projectIds.set(key, existing.id);
      console.log(`  Project "${projektName}" already exists`);
    } else {
      // Only set hourly_rate if different from client rate
      const clientRate = clientsMap.get(client);
      const projectRate = rate !== clientRate ? rate : null;

      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: projektName,
          client_id: clientId,
          hourly_rate: projectRate
        })
        .select('id')
        .single();

      if (error) {
        console.error(`  Error creating project "${projektName}":`, error);
      } else {
        projectIds.set(key, data.id);
        console.log(`  Created project "${projektName}"`);
      }
    }
  }

  // Create time entries
  console.log('Creating time entries...');
  let entriesCreated = 0;

  for (const line of lines) {
    const [datum, kunde, projekt, stundensatz, stunden, jahr] = line.split(',');
    if (!kunde || !projekt || !datum) continue;

    const clientName = kunde === 'JOAN' ? 'Joan' : kunde;
    const projectKey = `${clientName}::${projekt}`;
    const projectId = projectIds.get(projectKey);

    if (!projectId) {
      console.error(`  No project ID for "${projectKey}"`);
      continue;
    }

    // Parse date: "05.08." -> "2025-08-05"
    const [day, month] = datum.split('.');
    const date = `${jahr}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

    // Parse hours
    const hours = parseFloat(stunden) || 0;

    const { error } = await supabase
      .from('time_entries')
      .insert({
        project_id: projectId,
        date,
        hours,
        description: projekt
      });

    if (error) {
      console.error(`  Error creating entry:`, error);
    } else {
      entriesCreated++;
    }
  }

  console.log(`\nImport complete! Created ${entriesCreated} time entries from Aug-Nov 2025.`);
}

importData().catch(console.error);
