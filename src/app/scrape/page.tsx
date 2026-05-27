interface PhotoResult {
  id: string;
  urls: {
    regular: string;
    small: string;
  };
}

const productsToScrape = [
  // Notebooks (10)
  { id: 'nb-1', name: 'Small Copy', query: 'small pocket notebook' },
  { id: 'nb-2', name: 'Classmate Notebook', query: 'ruled exercise book school' },
  { id: 'nb-3', name: 'Long Notebook', query: 'long spiral notebook desk' },
  { id: 'nb-4', name: 'Practical Copy', query: 'science laboratory notebook' },
  { id: 'nb-5', name: 'Drawing Copy', query: 'blank sketchbook drawing' },
  { id: 'nb-6', name: 'A4 Notebook', query: 'a4 notebook paper' },
  { id: 'nb-7', name: 'College Notebook', query: 'college students notebook study' },
  { id: 'nb-8', name: 'Spiral Notebook', query: 'spiral notebook wire' },
  { id: 'nb-9', name: 'Register Book', query: 'ledger log book hardcover' },
  { id: 'nb-10', name: 'Premium Hard Cover Notebook', query: 'leather hardcover journal' },

  // Pen & Pencil (10)
  { id: 'pp-1', name: 'Ball Pen', query: 'ballpoint pen office' },
  { id: 'pp-2', name: 'Cello Pen', query: 'writing ball pen' },
  { id: 'pp-3', name: 'Gel Pen', query: 'gel pen writing paper' },
  { id: 'pp-4', name: 'Reynolds Pen', query: 'classic office pen' },
  { id: 'pp-5', name: 'Trimax Pen', query: 'rollerball pen' },
  { id: 'pp-6', name: 'Marker Pen', query: 'whiteboard marker pen' },
  { id: 'pp-7', name: 'Highlighter', query: 'neon highlighter marker' },
  { id: 'pp-8', name: 'Pencil Pack', query: 'graphite pencils stack' },
  { id: 'pp-9', name: 'Color Pencil Set', query: 'colored pencils colouring' },
  { id: 'pp-10', name: 'Sketch Pen Set', query: 'felt tip sketch pens marker' },

  // Eraser (3)
  { id: 'er-1', name: 'Small Eraser', query: 'pencil eraser rubber' },
  { id: 'er-2', name: 'Dust Free Eraser', query: 'clean white eraser' },
  { id: 'er-3', name: 'Fancy Cartoon Eraser', query: 'cute cartoon shape eraser' },

  // Sharpener (3)
  { id: 'sh-1', name: 'Small Sharpener', query: 'pencil sharpener plastic' },
  { id: 'sh-2', name: 'Double Sharpener', query: 'dual hole pencil sharpener' },
  { id: 'sh-3', name: 'Fancy Sharpener', query: 'cartoon pencil sharpener' },

  // Geometry Box (3)
  { id: 'gb-1', name: 'Basic Geometry Box', query: 'math geometry set metal' },
  { id: 'gb-2', name: 'Camlin Geometry Box', query: 'school geometry compass ruler' },
  { id: 'gb-3', name: 'Premium Box', query: 'professional math drawing set' },

  // School Bags (4)
  { id: 'sb-1', name: 'Kids School Bag', query: 'toddler school backpack' },
  { id: 'sb-2', name: 'Cartoon Bag', query: 'cute cartoon backpack kids' },
  { id: 'sb-3', name: 'Waterproof Bag', query: 'waterproof backpack outdoor' },
  { id: 'sb-4', name: 'College Backpack', query: 'college laptop backpack student' },

  // Files & Folders (3)
  { id: 'ff-1', name: 'Plastic File', query: 'plastic clear document folder' },
  { id: 'ff-2', name: 'Office Folder', query: 'clip binder file folder' },
  { id: 'ff-3', name: 'Document File', query: 'expanding file folder document' },

  // Art & Craft (4)
  { id: 'ac-1', name: 'Crayons', query: 'crayons pastel colors kids' },
  { id: 'ac-2', name: 'Water Color', query: 'watercolor paint palette tray' },
  { id: 'ac-3', name: 'Craft Paper Set', query: 'origami colored craft paper sheets' },
  { id: 'ac-4', name: 'Glitter Pack', query: 'glitter glue bottles' },

  // Office Stationery (4)
  { id: 'os-1', name: 'Stapler', query: 'office desk stapler' },
  { id: 'os-2', name: 'Punch Machine', query: 'paper hole puncher' },
  { id: 'os-3', name: 'Calculator', query: 'desktop math calculator' },
  { id: 'os-4', name: 'Office Register', query: 'hardcover account register book' },

  // School Books (4)
  { id: 'sbk-1', name: 'NCERT Books', query: 'school textbooks stack' },
  { id: 'sbk-2', name: 'CBSE Books', query: 'education books studying school' },
  { id: 'sbk-3', name: 'State Board Books', query: 'learning textbooks' },
  { id: 'sbk-4', name: 'English Grammar Books', query: 'english grammar book dictionary' },

  // Competitive Books (5)
  { id: 'cb-1', name: 'SSC Book', query: 'study books exam prep math' },
  { id: 'cb-2', name: 'Railway Book', query: 'competitive exam paper study' },
  { id: 'cb-3', name: 'Banking Book', query: 'studying textbook open desk' },
  { id: 'cb-4', name: 'UPSC Notes', query: 'comprehensive study notebook notes' },
  { id: 'cb-5', name: 'Bihar Police Book', query: 'police exam study guide book' }
];

export const dynamic = 'force-dynamic';

export default async function ScrapePage() {
  const results: Record<string, string> = {};
  const previews: Array<{ id: string; name: string; url: string }> = [];
  const usedIds = new Set<string>();

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    'Accept': 'application/json'
  };

  for (let i = 0; i < productsToScrape.length; i++) {
    const item = productsToScrape[i];
    try {
      const url = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(item.query)}&per_page=15`;
      const res = await fetch(url, { headers, next: { revalidate: 0 } });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      
      const data = await res.json();
      const photos: PhotoResult[] = data.results || [];
      
      // Find a photo ID that hasn't been used yet in this run to ensure absolute uniqueness
      let selectedPhoto: PhotoResult | null = null;
      for (const photo of photos) {
        if (!usedIds.has(photo.id)) {
          selectedPhoto = photo;
          break;
        }
      }

      // Fallback to first photo if all are somehow used
      if (!selectedPhoto && photos.length > 0) {
        selectedPhoto = photos[0];
      }

      if (selectedPhoto) {
        usedIds.add(selectedPhoto.id);
        // Clean CDN URL format
        const cleanUrl = selectedPhoto.urls.regular.split('?')[0] + '?w=500&auto=format&fit=crop&q=60';
        results[item.id] = cleanUrl;
        previews.push({ id: item.id, name: item.name, url: cleanUrl });
      } else {
        // Fallback placeholder
        results[item.id] = `https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=500&auto=format&fit=crop&q=60`;
        previews.push({ id: item.id, name: item.name, url: results[item.id] });
      }
    } catch (err) {
      console.error(`Failed to scrape ${item.name}:`, err);
      // Fallback placeholder
      results[item.id] = `https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=500&auto=format&fit=crop&q=60`;
      previews.push({ id: item.id, name: item.name, url: results[item.id] });
    }
  }

  return (
    <div className="p-8 bg-slate-900 text-white min-h-screen">
      <h1 className="text-3xl font-extrabold mb-4 text-sky-400">Stationery Image Scraper (Server-Side)</h1>
      <p className="text-sm text-slate-300 mb-6 font-bold text-yellow-400">Status: Completed!</p>

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-bold mb-2 text-emerald-400">Extracted JSON Mapping</h2>
          <textarea
            id="json-output"
            readOnly
            className="w-full h-80 bg-slate-950 p-4 rounded-xl font-mono text-xs border border-slate-800 text-emerald-400"
            defaultValue={JSON.stringify(results, null, 2)}
          />
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4 text-sky-400">Image Preview List ({previews.length} items)</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {previews.map((img) => (
              <div key={img.id} className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-slate-900">
                  <img src={img.url} alt={img.name} className="object-cover w-full h-full" />
                </div>
                <p className="text-2xs font-bold text-center mt-2 truncate text-slate-300">{img.name}</p>
                <p className="text-3xs text-center text-sky-500 mt-0.5">{img.id}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
