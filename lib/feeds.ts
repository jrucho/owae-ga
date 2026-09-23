import { unstable_cache } from "next/cache";

export type Book = {
  title: string;
  language: string;
  date: string;
  cover: string;
  href: string;
};

export type Release = {
  title: string;
  date: string;
  kind: string;
  cover: string;
  href: string;
};

const UNBOUND_PROFILE = "nCzhZaiY9Vg73Y63wbrXI7ORiWy2";
const UNBOUND_ORIGIN = "https://un-bound.ai.studio";
const UNBOUND_QUERY_URL =
  "https://firestore.googleapis.com/v1/projects/gen-lang-client-0492465470/databases/ai-studio-04d3ed5d-0b3a-4826-9c0e-c76943141d2e/documents:runQuery?key=AIzaSyD6Gpf5eG_pIgVvOq8lYRQEgRB6YwOw31k";
const BANDCAMP_ORIGIN = "https://owaega.bandcamp.com";

const bookDetails: Record<string, Pick<Book, "title" | "language" | "date" | "cover">> = {
  "6gqhzsm4o253xnka0jisyv": {
    title: "O ano dos cuartos prestados",
    language: "GL",
    date: "Sep 2026",
    cover: "/book-borrowed-rooms-gl.webp",
  },
  "msd2mslnczio1stlpvwzw": {
    title: "L’Année des chambres empruntées",
    language: "FR",
    date: "Sep 2026",
    cover: "/book-borrowed-rooms-fr.webp",
  },
  "i85m31uxptqsgjp26li5de": {
    title: "The Year of Borrowed Rooms",
    language: "EN",
    date: "Sep 2026",
    cover: "/book-borrowed-rooms-en.webp",
  },
  "2bxlaq1fd9vftsdx7vxjhu": {
    title: "TRES DÍAS SEN FOTOGRAFÍA",
    language: "GL",
    date: "Aug 2026",
    cover: "/book-tres-dias-gl.webp",
  },
  "kx0fce63afh767a17bwrn": {
    title: "Trois jours sans photographie",
    language: "FR",
    date: "Aug 2026",
    cover: "/book-trois-jours.webp",
  },
  "ygqqhgnwl7li0sgo850g": {
    title: "Three Days Without a Photograph",
    language: "EN",
    date: "Aug 2026",
    cover: "/book-three-days.webp",
  },
  "j7prcew74uqah7blyjipni": {
    title: "SOFIÁNIMA (GL)",
    language: "GL",
    date: "Jul 2026",
    cover: "/book-sofianima-gl.webp",
  },
  "zeii98oc4klqyb0z4fhxj9": {
    title: "SOFIÁNIMA (EN)",
    language: "EN",
    date: "Jul 2026",
    cover: "/book-sofianima-en.webp",
  },
  "uohvggpg2h06cahlhltyfv": {
    title: "SOFIÁNIMA (FR)",
    language: "FR",
    date: "Jul 2026",
    cover: "/book-sofianima-fr.webp",
  },
};

const preferredBookOrder = [
  "6gqhzsm4o253xnka0jisyv",
  "msd2mslnczio1stlpvwzw",
  "i85m31uxptqsgjp26li5de",
  "2bxlaq1fd9vftsdx7vxjhu",
  "kx0fce63afh767a17bwrn",
  "ygqqhgnwl7li0sgo850g",
  "j7prcew74uqah7blyjipni",
  "zeii98oc4klqyb0z4fhxj9",
  "uohvggpg2h06cahlhltyfv",
];

export const fallbackBooks: Book[] = preferredBookOrder.map((shareId) => ({
  ...bookDetails[shareId],
  href: `${UNBOUND_ORIGIN}/public/${UNBOUND_PROFILE}/book/${shareId}`,
}));

export const fallbackReleases: Release[] = [
  {
    title: "SOFIÁNIMA",
    date: "15 May 2026",
    kind: "Album",
    cover: "/sofianima-cover.png",
    href: "https://owaega.bandcamp.com/album/sofi-nima",
  },
  {
    title: "Vento Atlántico",
    date: "01 Jan 2026",
    kind: "Album",
    cover: "/vento-atlantico.jpg",
    href: "https://owaega.bandcamp.com/album/vento-atl-ntico",
  },
  {
    title: "Eco Atlántico",
    date: "18 Dec 2025",
    kind: "Album",
    cover: "/eco-atlantico.jpg",
    href: "https://owaega.bandcamp.com/album/eco-atl-ntico",
  },
  {
    title: "Codae Alt",
    date: "11 Dec 2025",
    kind: "Track",
    cover: "/codae-alt.jpg",
    href: "https://owaega.bandcamp.com/track/codae-alt",
  },
  {
    title: "Fenda",
    date: "04 Dec 2025",
    kind: "Track",
    cover: "/fenda.jpg",
    href: "https://owaega.bandcamp.com/track/fenda",
  },
  {
    title: "Espirais",
    date: "20 Nov 2025",
    kind: "Track",
    cover: "/espirais.jpg",
    href: "https://owaega.bandcamp.com/track/espirais",
  },
  {
    title: "Sismo",
    date: "06 Nov 2025",
    kind: "Track",
    cover: "/sismo.jpg",
    href: "https://owaega.bandcamp.com/track/sismo",
  },
  {
    title: "Fío de fume",
    date: "30 Oct 2025",
    kind: "Beat tape",
    cover: "/fio-de-fume.jpg",
    href: "https://owaega.bandcamp.com/album/f-o-de-fume",
  },
  {
    title: "Brutalismo Atlántico",
    date: "29 Sep 2025",
    kind: "Album",
    cover: "/brutalismo-atlantico.jpg",
    href: "https://owaega.bandcamp.com/album/brutalismo-atl-ntico",
  },
];

type FirestoreValue = {
  stringValue?: string;
  timestampValue?: string;
};

type FirestoreRow = {
  document?: {
    fields?: Record<string, FirestoreValue>;
  };
};

const formatMonth = (value: string) =>
  new Intl.DateTimeFormat("en", { month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(value));

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(value));

const fetchUnboundBooks = unstable_cache(
  async (): Promise<Book[]> => {
    const response = await fetch(UNBOUND_QUERY_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: "books" }],
          where: {
            compositeFilter: {
              op: "AND",
              filters: [
                {
                  fieldFilter: {
                    field: { fieldPath: "userId" },
                    op: "EQUAL",
                    value: { stringValue: UNBOUND_PROFILE },
                  },
                },
                {
                  fieldFilter: {
                    field: { fieldPath: "visibility" },
                    op: "EQUAL",
                    value: { stringValue: "public" },
                  },
                },
              ],
            },
          },
          orderBy: [{ field: { fieldPath: "createdAt" }, direction: "DESCENDING" }],
        },
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) throw new Error(`un-bound returned ${response.status}`);

    const rows = (await response.json()) as FirestoreRow[];
    const books = rows.flatMap((row) => {
      const fields = row.document?.fields;
      const shareId = fields?.shareId?.stringValue;
      const title = fields?.title?.stringValue;
      const createdAt = fields?.createdAt?.timestampValue;
      if (!shareId || !title || !createdAt) return [];

      const known = bookDetails[shareId];
      return [{
        title: known?.title ?? title,
        language: known?.language ?? fields?.language?.stringValue?.toUpperCase() ?? "—",
        date: known?.date ?? formatMonth(createdAt),
        cover: known?.cover ?? fields?.coverUrl?.stringValue ?? "",
        href: `${UNBOUND_ORIGIN}/public/${UNBOUND_PROFILE}/book/${shareId}`,
        shareId,
        createdAt,
      }];
    });

    if (books.length === 0) throw new Error("un-bound returned no public books");

    const order = new Map(preferredBookOrder.map((shareId, index) => [shareId, index]));
    return books
      .sort((a, b) => {
        const aOrder = order.get(a.shareId);
        const bOrder = order.get(b.shareId);
        if (aOrder === undefined && bOrder === undefined) return b.createdAt.localeCompare(a.createdAt);
        if (aOrder === undefined) return 1;
        if (bOrder === undefined) return -1;
        return aOrder - bOrder;
      })
      .slice(0, 12)
      .map((book) => ({
        title: book.title,
        language: book.language,
        date: book.date,
        cover: book.cover,
        href: book.href,
      }));
  },
  ["unbound-public-books-v3"],
  { revalidate: 21600, tags: ["unbound-books"] },
);

type BandcampItem = {
  item_id: number;
  item_type: "album" | "track";
  title: string;
  art_id: number;
  release_date: string;
};

const fetchBandcampReleases = unstable_cache(
  async (): Promise<Release[]> => {
    const [detailsResponse, musicResponse] = await Promise.all([
      fetch("https://bandcamp.com/api/mobile/24/band_details?band_id=2032818042", {
        signal: AbortSignal.timeout(8000),
      }),
      fetch(`${BANDCAMP_ORIGIN}/music`, {
        headers: { "user-agent": "owae.ga release feed" },
        signal: AbortSignal.timeout(8000),
      }),
    ]);

    if (!detailsResponse.ok || !musicResponse.ok) throw new Error("Bandcamp feed unavailable");

    const details = (await detailsResponse.json()) as { discography?: BandcampItem[] };
    const html = await musicResponse.text();
    const paths = new Map<number, string>();
    const linkPattern = /<li data-item-id="(?:album|track)-(\d+)"[\s\S]*?<a href="([^"]+)"/g;
    for (const match of html.matchAll(linkPattern)) paths.set(Number(match[1]), match[2]);

    const releases = (details.discography ?? []).flatMap((item) => {
      const path = paths.get(item.item_id);
      if (!path) return [];
      return [{
        title: item.title.normalize("NFC"),
        date: formatDate(item.release_date),
        kind: item.item_type === "track" ? "Track" : /\bEP\b/i.test(item.title) ? "EP" : "Album",
        cover: `https://f4.bcbits.com/img/a${item.art_id}_10.jpg`,
        href: `${BANDCAMP_ORIGIN}${path}`,
        releasedAt: item.release_date,
      }];
    });

    if (releases.length === 0) throw new Error("Bandcamp returned no releases");
    return releases
      .sort((a, b) => Date.parse(b.releasedAt) - Date.parse(a.releasedAt))
      .slice(0, 9)
      .map(({ title, date, kind, cover, href }) => ({ title, date, kind, cover, href }));
  },
  ["bandcamp-releases-v1"],
  { revalidate: 21600, tags: ["bandcamp-releases"] },
);

export async function getLatestBooks(): Promise<Book[]> {
  try {
    return await fetchUnboundBooks();
  } catch (error) {
    console.warn("Using local un-bound fallback:", error);
    return fallbackBooks;
  }
}

export async function getLatestReleases(): Promise<Release[]> {
  try {
    return await fetchBandcampReleases();
  } catch (error) {
    console.warn("Using local Bandcamp fallback:", error);
    return fallbackReleases;
  }
}
