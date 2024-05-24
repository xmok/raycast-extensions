enum Periodicity {
    "30s" = "30s",
    "1m" = "1m",
    "5m" = "5m",
    "10m" = "10m",
    "30m" = "30m",
    "1h" = "1h",
    "other" = "other"
}
enum Region {
    ams = "ams",
    iad = "iad",
    hkg = "hkg",
    jnb = "jnb",
    syd = "syd",
    gru = "gru"
}
enum Method {
    GET = "GET",
    POST = "POST",
    HEAD = "HEAD"
}
export type Monitor = {
    id: number;
    periodicity: Periodicity;
    url: string;
    regions: Region[];
    name: string | null;
    description: string | null;
    method: Method,
    body: string | null;
    headers: {key: string; value: string}[] | null;
    active: boolean;
    public: boolean;
}

export type Incident = {
    id: number;
    startedAt: string | null;
    monitorId: number | null;
    acknowledgedAt: string | null;
    acknowledgedBy: number | null;
    resolvedBy: number | null;
    resolvedAt: string | null;
}

export type StatusPage = {
    id: number;
    title: string;
    description: string;
    slug: string;
    passwordProtected: boolean;
    password: string;
    customDomain?: string | null;
    icon?: string | null;
    monitors?: number[];
}

export type StatusReport = {
    title: string;
    status: "investigating" | "identified" | "monitoring" | "resolved";
    id: number;
    status_report_updates: number[];
}

export type CheckerResponse = {
    status: number;
    latency: number;
    headers: Record<string, string>;
    time: number;
    timing: {
      dnsStart: number;
      dnsDone: number;
      connectStart: number;
      connectDone: number;
      tlsHandshakeStart: number;
      tlsHandshakeDone: number;
      firstByteStart: number;
      firstByteDone: number;
      transferStart: number;
      transferDone: number;
    };
};   