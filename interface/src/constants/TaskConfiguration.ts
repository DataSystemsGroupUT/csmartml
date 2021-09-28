// Non-Meta Configuration Constants

const SDBW = ["sdbw", -1]
const I_INDEX = ["i_index", 1]
const BANFELD_RAFERTY = ["banfeld_raferty", -1]
const MODIFIED_HUBERT_T = ["modified_hubtert_t", 1]
const DUNNS_INDEX = ["modified_hubtert_t", 1]
const MCCLAIN_RAO = ["mcclain_rao", -1]
const SCOTT_SYMONS = ["scott_symons", -1]

// Exported Constants

export const ALGORITHMS = [
    {label: "Agglomerated Clustering", value: "ag"},
    {label: "Affinity Propagation", value: "ap"},
    {label: "Birch", value: "birch"},
    {label: "DBSCAN", value:"db"},
    {label: "KMeans", value:"kmeans"},
    {label: "MeanShift", value: "meanshift"},
    {label: "OPTICS", value: "optics"},
    {label: "Spectral Clustering", value: "spectral"}
]

export const SINGLE_METRICS = [
    {label: "Banfeld-Raferty", value: "cvi-1"},
    {label: "Davies Bouldin", value: "cvi-8"},
    {label: "Dunns Index", value: "cvi-5"},
    {label: "I-Index", value: "cvi-3"},
    {label: "McClain Rao", value: "cvi-4"},
    {label: "Modified Hubert t", value: "cvi-2"},
    {label: "PBM Index", value: "cvi-9"},
    {label: "Ratkowsky Lance", value: "cvi-10"},
    {label: "Ray Turi", value: "cvi-11"},
    {label: "Scott Symons", value: "cvi-6"},
    {label: "SDBW", value: "cvi-7"},
]

export const MULTI_OBJ_METRICS = [
    {label: "I-Index & Modified Hubert T & Banfeld-Raferty", value: "cvi-102"},
    {label: "I-Index & Scott Symons & Banfeld-Raferty", value: "cvi-104"},
    {label: "McClain Rao & Dunns Index & Banfeld-Raferty", value: "cvi-103"},
    {label: "SDBW & I-Index & Banfeld-Raferty", value: "cvi-100"},
    {label: "SDBW & Modified Hubert T & Banfeld-Raferty", value: "cvi-101"},
]

export const EVALUATION_TYPES = [
    {label: "Multi-Objective", value: "multi"},
    {label: "Single Metric", value: "single"}
]

export const RESULT_PREFERENCE = [
    {label: "All Optimal Solutions", value: "multi"},
    {label: "Single Configuration", value: "single"}
]

export const FORMATTED_CVI = {
    "cvi-100": [SDBW, I_INDEX, BANFELD_RAFERTY],
    "cvi-101": [SDBW, MODIFIED_HUBERT_T, BANFELD_RAFERTY],
    "cvi-102": [I_INDEX, MODIFIED_HUBERT_T, BANFELD_RAFERTY],
    "cvi-103": [MCCLAIN_RAO, DUNNS_INDEX, BANFELD_RAFERTY],
    "cvi-104": [I_INDEX, SCOTT_SYMONS, BANFELD_RAFERTY],
    "cvi-105": [MCCLAIN_RAO, DUNNS_INDEX, BANFELD_RAFERTY],
}


export const REFORMATTED_CVI_OBJ = {
    "i_index": ["I-Index", 1, "MAX"],
    "banfeld_raferty": ["Banfeld Raferty", -1, "MIN"],
    "modified_hubert_t": ["Modified Hubert T", 1, "MAX"],
    "baker_hubert_gamma": ["Baker Hubert Gamma", -1, "MIN"],
    "davies_bouldin": ["Davies Bouldin", -1, "MIN"],
    "dunns_index": ["Dunns Index", 1, "MAX"],
    "pbm_index": ["PBM Index", 1, "MAX"],
    "ratkowsky_lance": ["Ratkowsky Lance", 1, "MAX"],
    "point_biserial": ["Point Biserial", 1, "MAX"],
    "wemmert_gancarski": ["Wemmert Gancarski", 1, "MAX"],
    "silhouette": ["Silhouette", 1, "MAX"],
    "calinski_harabasz_score": ["Calinski Harabasz", 1, "MAX"],
    "tau_index": ["Tau Index", 1, "MAX"],
    "ray_turi": ["Ray Turi", -1, "MIN"],
    "scott_symons": ["Scott Symons", -1, "MIN"],
    "mcclain_rao": ["McClain Rao", -1, "MIN"],
    "xie_beni": ["Xie Beni", -1, "MIN"],
    "c_index": ["C-Index", -1, "MIN"],
    "g_plus_index": ["G Plus Index", -1, "MIN"],
    "s_dbw": ["SDBW", -1, "MIN"],

}