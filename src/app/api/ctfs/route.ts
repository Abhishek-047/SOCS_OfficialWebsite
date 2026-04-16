import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    // Fetch CTFs for the next 30 days
    const finish = timestamp + (30 * 24 * 60 * 60); 
    
    const res = await fetch(`https://ctftime.org/api/v1/events/?limit=5&start=${timestamp}&finish=${finish}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 CTF_SOCS_Bot/1.0'
      },
      next: { revalidate: 3600 } // Cache exactly 1 hour to prevent IP bans
    });
    
    if (!res.ok) {
      throw new Error(`CTFtime API responded with status: ${res.status}`);
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("CTFtime Fetch Error:", error);
    return NextResponse.json({ error: 'Failed to fetch CTF data' }, { status: 500 });
  }
}
