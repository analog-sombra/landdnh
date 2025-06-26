// SYSTEM
//   ADMIN
//   SUPTDCOLL
//   LDCMAMLATDAR
//   MAMLATDAR
//   TALATHI
//   CIRCLEOFFICER
//   LRO
//   LAQ
//   RAK
//   DEPUTYCOLLECTOR
//   COLLECTOR
//   PATOCOLLECTOR
//   RTSMAMLATDAR
//   SURVEYSETTLEMENT
//   DNHPDA
//   SNSSO
//   SURVEYOR

//   COLLECTOR
//   DEPUTYCOLLECTOR
//   SUPTDCOLL
//   LDCMAMLATDAR
//   MAMLATDAR
//   TALATHI
//   CIRCLEOFFICER
//   LRO
//   LAQ
//   RAK
//   PATOCOLLECTOR
//   DNHPDA

// na section start here

// export const na_collector_downmark = ["DEPUTYCOLLECTOR"];
// export const na_deputy_collector_downmark = ["MAMLATDAR"];
// export const na_mamlatdar_downmark = ["RAK"];
// export const na_rak_downmark = ["LDCMAMLATDAR"];

export const mamlatdarid = 5;

export const na_downmark = {
  COLLECTOR: "DEPUTYCOLLECTOR",
  DEPUTYCOLLECTOR: "MAMLATDAR",
  MAMLATDAR: "RAK",
  RAK: "LDCMAMLATDAR",
  SUPTDCOLL: "MAMLATDAR",
};

// export const na_ldcmamlatdar_upmark = ["RAK"];
// export const na_rak_upmark = ["MAMLATDAR"];
// export const na_mamlatdar_upmark = ["DEPUTYCOLLECTOR"];
// export const na_deputy_collector_upmark = ["COLLECTOR"];

export const na_upmark = {
  LDCMAMLATDAR: "RAK",
  RAK: "MAMLATDAR",
  MAMLATDAR: "DEPUTYCOLLECTOR",
  DEPUTYCOLLECTOR: "COLLECTOR",
};

export const na_query = ["MAMLATDAR", "RAK", "LDCMAMLATDAR"];

// export const na_seek_report_mamlatdar = ["TALATHI", "DNHPDA", "LRO", "LAQ"];
// export const na_seek_report_talathi = ["CIRCLEOFFICER"];

export const na_seek_report = {
  MAMLATDAR: ["TALATHI", "DNHPDA", "LRO", "LAQ"],
  TALATHI: ["CIRCLEOFFICER"],
};

// na section end here
