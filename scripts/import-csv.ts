import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// CSV data from January 2026
const csvData = `Datum,Kunde,Projekt,Stundensatz (€),Stunden,Summe (€),Rechnung
05.01.,Overfly,Interner Status,100,1,100,
05.01.,Overfly,Kickoff 2026,100,1,100,
06.01.,Overfly,Ferrero: Hubert Einlesen + Fragen sammeln,100,1.75,175,
07.01.,Joan,ebay Live: Einarbeitung Testing etc.,112.5,1.5,168.75,
07.01.,Overfly,Strategie / Designprozess: Meeting Olli,100,1,100,
07.01.,Overfly,Kickoff 2026 + Vorbereitung,100,1.5,150,
07.01.,Overfly,Cybus: Formulierung Angebot,100,2.75,275,
08.01.,Joan,eBay Live: Meeting Intern + Kunde + Erarbeitung R2-Input,112.5,4,450,
08.01.,Overfly,Ferrero: Hubert Onboarding + Ausarbeitung Angebot + Interview Guide,100,3,300,
09.01.,Joan,eBay Live: Meeting Intern + Working Session Creatives + R2-Präsentation,112.5,8.5,956.25,
12.01.,Joan,eBay Live: Status + Prep R2 + Testing Setup,112.5,6.5,731.25,
12.01.,Overfly,Interner Status + Ferrero Mails,100,1,100,
13.01.,Joan,Interner Status + Testing Setup Gedanken + Testing Int. Meeting,112.5,3.5,393.75,
13.01.,Overfly,365 Sherpas: Vorbereitung + Meeting Benjamin,100,1,100,
13.01.,Overfly,Ferrero: Interview-Vorbereitungen + Mails/Admin,100,0.5,50,
13.01.,Overfly,Overfly: Intern,100,1,100,
14.01.,Overfly,Ferrero: Interviews + Nachbereitung,100,4,400,
15.01.,Joan,Interner Status + Testing-Termine,100,2.5,250,
15.01.,Overfly,Ferrero: Interviews + Analyse,100,1,100,
16.01.,Joan,Jahrespräsentation Kickoff + Ausarbeitung,100,8,800,
17.01.,Joan,Jahrespräsentation Kickoff + Ausarbeitung,100,4,400,
17.01.,Overfly,Interview Analyse,100,1,100,`;

async function importData() {
  console.log('Starting import...');

  // Parse CSV
  const lines = csvData.trim().split('\n').slice(1); // Skip header

  // Collect unique clients and their rates
  const clientsMap = new Map<string, number>();
  const projectsMap = new Map<string, { client: string; rate: number }>();

  for (const line of lines) {
    const [datum, kunde, projekt, stundensatz, stunden] = line.split(',');
    if (!kunde || !projekt) continue;

    const rate = parseFloat(stundensatz) || 100;

    // Store highest rate for client
    if (!clientsMap.has(kunde) || clientsMap.get(kunde)! < rate) {
      clientsMap.set(kunde, rate);
    }

    // Store project with client and rate
    const projectKey = `${kunde}::${projekt}`;
    if (!projectsMap.has(projectKey)) {
      projectsMap.set(projectKey, { client: kunde, rate });
    }
  }

  // Create clients
  console.log('Creating clients...');
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
  console.log('Creating projects...');
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
    const [datum, kunde, projekt, stundensatz, stunden] = line.split(',');
    if (!kunde || !projekt || !datum) continue;

    const projectKey = `${kunde}::${projekt}`;
    const projectId = projectIds.get(projectKey);

    if (!projectId) {
      console.error(`  No project ID for "${projectKey}"`);
      continue;
    }

    // Parse date: "05.01." -> "2026-01-05"
    const [day, month] = datum.split('.');
    const date = `2026-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

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

  console.log(`\nImport complete! Created ${entriesCreated} time entries.`);
}

importData().catch(console.error);
