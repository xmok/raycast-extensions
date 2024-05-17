export type Person = {
    wd_id: string; //"Q2746373",
    wp_id: number; //7270356,
    slug: string;
    name: string;
    occupation: string;
    // "prob_ratio": 58.9818295408834,
    gender: "M" | "F";
    twitter: string | null;
    alive: boolean;
    // "l": 16,
    // "l_prev": 16,
    // "hpi": 52.6054854400811,
    // "hpi_prev": 50.9768524465966,
    // "bplace_name": null,
    // "bplace_lat": null,
    // "bplace_lon": null,
    // "bplace_geonameid": null,
    // "bplace_country": null,
    // "bplace_geacron_name": null,
    // "birthdate": null,
    birthyear: number;
    // "dplace_name": null,
    // "dplace_lat": null,
    // "dplace_lon": null,
    // "dplace_geonameid": null,
    // "dplace_country": null,
    // "dplace_geacron_name": null,
    // "deathdate": null,
    deathyear: number;
    // "is_group": false,
    // "l_": 3.84481160493655,
    // "age": 1197,
    // "coefficient_of_variation": 2.32245935496909,
    // "non_en_page_views": 10610,
    // "youtube": null,
    description: string | null;
    // "famous_for": null,
    id: number;
    // "hpi_raw": 21.1484443361004
}