// actorData.js - ไฟล์จัดการข้อมูลนักแสดงแยกต่างหาก

// ========== ข้อมูลนักแสดงพร้อมรูปภาพ ==========
const actorsDatabase = [
  {
    vod_id: "84664 , 68250, 63247, 59132",
    actors: ["藤井蘭々"],
    title: "藤井兰兰完全无视..."
  },
  {
    vod_id: "84663, 65896",
    actors: ["折原ゆかり"],
    title: "喝下春藥感度100倍..."
  },
  {
    vod_id: "84662, 73036, 73019, 72355, 66138, 66134, 56431",
    actors: ["沙月恵奈"],
    title: "可爱美丽的沙月惠奈..."
  },
  {
    vod_id: "84661, 59738, 59737",
    actors: ["白峰ミウ"],
    title: "當我查看妻子的智慧型手機..."
  },
  {
    vod_id: "84659, 74599, 60439, 57116, 42512",
    actors: ["都月るいさ"],
    title: "每深入一公分就更接近高潮..."
  },
  {
    vod_id: "84658, 82414, 78898, 75074, 58014, 58016, 58020, 34009",
    actors: ["めぐり"],
    title: "裸體模特NTR令人震驚的妻子..."
  },
  {
    vod_id: "84656, 78737, 78569, 78548, 78547, 77573, 58857, 58218, 57463, 38280, 38262, 38260, 38255, 38221, 38217, 38214, 32054",
    actors: ["倉多まお"],
    title: "母子偷偷躲在桌子底下的亂倫遊戲"
  },
  {
    vod_id: "83651, 82433, 79541, 79152, 77141, 77135, 77127, 32181, 32058",
    actors: ["水卜さくら"],
    title: "無限抽插潮吹絶叫高潮 水卜櫻"
  },
  {
    vod_id: "83245, 84124, 84117, 82406, 82147, 83214, 84125, 82135, 79177, 77133, 77131, 61024, 59475, 59364, 46258, 32141, 32095",
    actors: ["七沢みあ"],
    title: "「老闆，吃完晚飯，晚上十一點..."
  },
  {
    vod_id: "83244, 82505, 84764, 81478, 71463, 60197",
    actors: ["宮下玲奈"],
    title: "清纯美少女子宫下媚药..."
  },
  {
    vod_id: "83243, 52433",
    actors: ["三田真鈴"],
    title: "超情人男士美容院..."
  },
  {
    vod_id: "83242, 82438, 59168",
    actors: ["梓ヒカリ"],
    title: "萬聖節之夜 梓光繼續被..."
  },
  {
    vod_id: "83240, 81868, 84944, 64827, 57783",
    actors: ["凪ひかる"],
    title: "K罩杯秘書被鼻涕蟲總裁..."
  },
  {
    vod_id: "83239, 83966, 67467",
    actors: ["響蓮"],
    title: "錯過末班車到後輩家住..."
  },
  {
    vod_id: "83238",
    actors: ["野々花あかり"],
    title: "一個烤媽媽的朋友，他照顧我..."
  }
];

// ========== ข้อมูลโปรไฟล์นักแสดง (รูปภาพ และรายละเอียด) ==========
// ใช้ Map เพื่อจัดเก็บข้อมูล profile แบบไม่ซ้ำ โดยใช้ primary name เป็น key
const actorProfiles = new Map([
  ["藤井蘭々", {
    primaryName: "藤井蘭々",
    alternativeNames: ["藤井蘭々"], // เก็บชื่อทางเลือกเป็น array
    profileImage: "https://img.hmv.co.jp/image/jacket/800/0000142/8/5/019.jpg",
    backgroundImage: "https://pics.dmm.co.jp/digital/video/1fns00039/1fns00039pl.jpg",
    age: "22",
    height: "165 cm",
    weight: "48 kg",
    nationality: "ญี่ปุ่น",
    other: "โปรไฟล์พิเศษ",
    bio: "นักแสดงสาวจากญี่ปุ่นที่มีความสามารถและเป็นที่รู้จักในวงการ",
    galleryImages: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW_hk9zvOZ2Y0hTzcyzf6i8QU47Ab4wcu8sG0cBTvUGdnyRv234A&s&ec=73053463",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyk8ca-HzfCdekdJWBrCi5toqmn8z-AWk9EYe5xtJlc7deS7eO4Q&s&ec=73053463",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfpHQmQFaD3fjsecJ27bWN5nUT5Ehmf_PAz3iJ4xLDrrYbN6fHrg&s&ec=73053463",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCSBSF16w6ypxjyZYajDDbcfRkKRmYGv_6zLFkFHHTr3QBZQ1a8w&s&ec=73053463",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSApIN1788XhNdxhDgSIoWbM4MzZwWEISPtjyEgB2TFkjgVzCSlrg&s&ec=73053463",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3jI9TsJ7gmbgjPYLpD5iLwMFxXZ-IfTWYjcZtFGoqjizJ7xLhzQ&s&ec=73053463",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdD61uzw5taAXGJkar8SFT8Ass4YGTgQwr2vgVbuM20MKKEXo0ww&s&ec=73053463",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQARz_UiZJQWECeom0mIYnuU5_VUR4EOF23ihJOU5Hjjdo4FamJA&s&ec=73053463",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrETyR6V-2zJbuJi1xghBN8Y4Pj3uZCpytHmavHxsJVm96QYhDfQ&s&ec=73053463",
    ]
  }],
  
  ["折原ゆかり", {
    primaryName: "折原ゆかり",
    alternativeNames: ["折原ゆかり"],
    profileImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAALrhYiysWXX2Kc_GWjOELdzYCDn0_zGpzpoDkOsUUUIJic_udQ&s&ec=73053463",
    backgroundImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8LAPlJmjgKAJEi1RcP7KosHv-LcGsX4T7An8rxZPPhQhqDZ6cPA&s&ec=73053463",
    age: "28",
    height: "160 cm",
    weight: "45 kg",
    nationality: "ญี่ปุ่น",
    other: "ข้อมูลเพิ่มเติม",
    bio: "นักแสดงมากความสามารถ เป็นที่รู้จักในหลายผลงาน",
    galleryImages: [
      "https://pbs.twimg.com/media/FCyfyj9VkAQTC_P?format=jpg&name=large",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeuS0700ibM75IYYIrZKd2Hc1ubVjvSdvEG4dAfm2FQv8H-uL0eA&s&ec=73053463",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEhapQ2hhLcW2A4wJPvPe2iEYGdz6w6OCeW4FGQ-UroFfBIFeiqg&s&ec=73053463",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMh1KegSUSYkAeCWYwvcvBZQ96fh48OXhNcX-5C9jyDZF34c_rKQ&s&ec=73053463",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTKmJUPv7NR4yiSVDcOHTivYNCdZ2DwbbpnH0iLn276pjdU8qKqA&s&ec=73053463",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG9Ejde47yaehwfP39984DednHZ-MhSyRq6XILXrcl23pf1yvuvQ&s&ec=73053463",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRduE6Qhg54dqxXo3ovRsQb8fJN30X9pTrg9oBSu22JiV3LETftDA&s&ec=73053463",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYd5xbMBj-2Oiewl22Jd0SFDpIDV95cBPE0vhMu7YSKC6EAaLvWw&s&ec=73053463",
      "",
    ]
  }],

  ["沙月恵奈", {
    primaryName: "沙月恵奈",
    alternativeNames: ["沙月恵奈"],
    profileImage: "https://prd.resource-api.lit.link/images/creators/07472ad7-935c-40bc-8099-d8e58cd6d685/f0936451-49be-4c99-a82f-e4250d3985b5.jpg",
    backgroundImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyMZk50k1HPXMynzLQ09WZMEOIEylnEyYHj5N7y7LrpHhVkKVclw&s&ec=73053463",
    age: "22",
    height: "158 cm",
    weight: "42 kg",
    nationality: "ญี่ปุ่น",
    other: "ข้อมูลเพิ่มเติม",
    bio: "นักแสดงหน้าใหม่ที่มีความสามารถสูง",
    galleryImages: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxG86nxa5e2uxQYmshMOo0tpcTTCdVpVGF3lrMm9z-gw4hyMKGjA&s&ec=73053463",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToTqWL0pNMIClec83h_JckwU0S_9oZPfMDMkEO2I65pOHkKKDM7w&s&ec=73053463",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTleKR8oqCNty-S7eQratbNCAUppT_KUtvgNvius8aLyJvhuOnhRA&s&ec=73053463",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZuuYDOkTSmpkk2VGU84tZ3esvwdmkz2HIflN0_0_NjCO74wlTbg&s&ec=73053463",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReFp7AQicKTKMk18WuHYjfvFOuG9yrICcYL1kWHEEAKNBe_qcq4w&s&ec=73053463",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyleU1jN69kgJTowp428H-5TYQaArw7kvyk0pyI75m8sIqP4_FGw&s&ec=73053463",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1efwiNeRgMAXRlxyoQsStM8sg5UivvxEBF-oVgq0zwfp8CNGOFg&s&ec=73053463",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhm5q09srkrxR6KyBW1a5HddZSD2wbsvqZFrOIceav7OP6cF63MA&s&ec=73053463",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNZiHXOHMpX4oBWGM5tJH3GHbne9PLkJ43nxMLmxPFI6JLeH5IlQ&s&ec=73053463",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKN0rUtb-uaPCfyvdGSrJWLFNSjz1alEYe8sPzyM092TemM8AYPw&s&ec=73053463",
    ]
  }],

  ["白峰ミウ", {
    primaryName: "白峰ミウ", 
    alternativeNames: ["白峰ミウ"],
    profileImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSGwSVjDOR9dQ9qVL3HtEVa5yaDT2-FJOqcEpD2Yt3bxOBHToowg&s&ec=73053463",
    backgroundImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3n0I7EjEiGx7-joYzjFtb2_SXGNFJsT3uUAXGapPwrjBey3LJtQ&s&ec=73053463",
    age: "24",
    height: "162 cm", 
    weight: "46 kg",
    nationality: "ญี่ปุ่น",
    other: "ข้อมูลเพิ่มเติม",
    bio: "นักแสดงที่มีเสน่ห์และความสามารถพิเศษ",
    galleryImages: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc_gNbgWhMp7JdjQApxzWIGknKvb0fgejzKBtxhc6-XxCH_NMUAQ&s&ec=73053463",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn-dFmpfJtq6dXE78HowZBMOBlA702UV7v1I07oYCHVFqobgyQ9A&s&ec=73053463",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYkXPExgjVhGSMakb1yOEFKESakVUBdwsKFL5YnsmE3SLk9x8umA&s&ec=73053463",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkVMQjjlzVyokePihhRQBPvBXC8i_lwUpVUWC5q06ecJMlzKBO_g&s&ec=73053463",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSGwSVjDOR9dQ9qVL3HtEVa5yaDT2-FJOqcEpD2Yt3bxOBHToowg&s&ec=73053463",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCAMTxAd0nt5qOZ_w-dRTsmNnkM__cmUzNGOwLHeS5shoyNZNZFQ&s&ec=73053463",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDrAzreh8pGy8XCYZD9qyvb22_8BrFlEWjYZ9buZZnI3dg-aqzEQ&s&ec=73053463",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnDYTBewyNPloaCqxfsq9mVo-fBhfxkGMLlb3sig7bBxJKOfld7w&s&ec=73053463",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6k-KxVxCJWssDfHx_7P3rrJBPiyc8cf05QwURGe6nmwYCOKhV-g&s&ec=73053463",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIuDRwF6sfZV47n_Qx9Ydy91chd3iROtcxXcz0Ye3vzroZpfJisg&s&ec=73053463",
    ]
  }],

  ["都月るいさ", {
    primaryName: "都月るいさ",
    alternativeNames: ["都月るいさ"], 
    profileImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWjG72Mv4t0FbXhAwdFejQZDt0UBqt3ShCuDXxeNLNFkMTkPrjOQ&s&ec=73053463",
    backgroundImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop",
    age: "26",
    height: "164 cm",
    weight: "47 kg", 
    nationality: "ญี่ปุ่น",
    other: "ข้อมูลเพิ่มเติม",
    bio: "นักแสดงที่มีประสบการณ์และเป็นที่ชื่นชอบ",
    galleryImages: [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ]
  }],

  // เพิ่มนักแสดงที่มีชื่อหลายแบบ - ใช้ primary name เป็นตัวหลัก
      ["めぐり", {
    primaryName: "めぐり",
    alternativeNames: ["藤浦めぐ"], // เก็บชื่ออื่นๆ ทั้งหมดไว้ใน array
    profileImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXZ3gar9_K2g2Nlj8_BODQszyjEZsVj8O2B4d2AFrCijnz5qhycg&s&ec=73053463",
    backgroundImage: "https://images.unsplash.com/photo-1506629905687-671b23ce4b7a?w=1200&h=800&fit=crop",
    age: "30",
    height: "168 cm",
    weight: "50 kg",
    nationality: "ญี่ปุ่น",
    other: "นักแสดงมืออาชีพ",
    bio: "นักแสดงที่มีชื่อเสียงและประสบการณ์มากมาย",
    galleryImages: [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ]
  }],
  ["倉多まお", {
    primaryName: "倉多まお",
    alternativeNames: ["藤浦めぐ"], // เก็บชื่ออื่นๆ ทั้งหมดไว้ใน array
    profileImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrVW9C3XJ6DcgvgvBJ4ix_7hPcAt5RtYNH8BLNk7My-qhC8BmY7A&s&ec=73053463",
    backgroundImage: "https://images.unsplash.com/photo-1506629905687-671b23ce4b7a?w=1200&h=800&fit=crop",
    age: "30",
    height: "168 cm",
    weight: "50 kg",
    nationality: "ญี่ปุ่น",
    other: "นักแสดงมืออาชีพ",
    bio: "นักแสดงที่มีชื่อเสียงและประสบการณ์มากมาย",
    galleryImages: [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ]
  }],
    ["水卜さくら", {
    primaryName: "水卜さくら",
    alternativeNames: ["藤浦めぐ"], // เก็บชื่ออื่นๆ ทั้งหมดไว้ใน array
    profileImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9PriZbSi4GPl6AxkLpCOwrx97CkDCjH3PJ7Ouzcp7IrwWq2lBJQ&s&ec=73053463",
    backgroundImage: "https://images.unsplash.com/photo-1506629905687-671b23ce4b7a?w=1200&h=800&fit=crop",
    age: "30",
    height: "168 cm",
    weight: "50 kg",
    nationality: "ญี่ปุ่น",
    other: "นักแสดงมืออาชีพ",
    bio: "นักแสดงที่มีชื่อเสียงและประสบการณ์มากมาย",
    galleryImages: [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ]
  }],
    ["七沢みあ", {
    primaryName: "七沢みあ",
    alternativeNames: ["藤浦めぐ"], // เก็บชื่ออื่นๆ ทั้งหมดไว้ใน array
    profileImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiKyTRo-mbfb4LznawRDUPTYxT4THtlh8txsLRmY4GcBNWFfN0fg&s&ec=73053463",
    backgroundImage: "https://images.unsplash.com/photo-1506629905687-671b23ce4b7a?w=1200&h=800&fit=crop",
    age: "30",
    height: "168 cm",
    weight: "50 kg",
    nationality: "ญี่ปุ่น",
    other: "นักแสดงมืออาชีพ",
    bio: "นักแสดงที่มีชื่อเสียงและประสบการณ์มากมาย",
    galleryImages: [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ]
  }],
    ["宮下玲奈", {
    primaryName: "宮下玲奈",
    alternativeNames: ["藤浦めぐ"], // เก็บชื่ออื่นๆ ทั้งหมดไว้ใน array
    profileImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1SIoHZFbBdFoffFIQMoy2PWHFhtt4o1yeqXaj4nojJCv02bveaw&s&ec=73053463",
    backgroundImage: "https://images.unsplash.com/photo-1506629905687-671b23ce4b7a?w=1200&h=800&fit=crop",
    age: "30",
    height: "168 cm",
    weight: "50 kg",
    nationality: "ญี่ปุ่น",
    other: "นักแสดงมืออาชีพ",
    bio: "นักแสดงที่มีชื่อเสียงและประสบการณ์มากมาย",
    galleryImages: [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ]
  }],
    ["三田真鈴", {
    primaryName: "三田真鈴",
    alternativeNames: ["藤浦めぐ"], // เก็บชื่ออื่นๆ ทั้งหมดไว้ใน array
    profileImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiElsMceP4FasalzmUEhVxbvlHFWLw9PUDQL3IzRobC8Uvz3jS8w&s&ec=73053463",
    backgroundImage: "https://images.unsplash.com/photo-1506629905687-671b23ce4b7a?w=1200&h=800&fit=crop",
    age: "30",
    height: "168 cm",
    weight: "50 kg",
    nationality: "ญี่ปุ่น",
    other: "นักแสดงมืออาชีพ",
    bio: "นักแสดงที่มีชื่อเสียงและประสบการณ์มากมาย",
    galleryImages: [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ]
  }],
    ["梓ヒカリ", {
    primaryName: "梓ヒカリ",
    alternativeNames: ["藤浦めぐ"], // เก็บชื่ออื่นๆ ทั้งหมดไว้ใน array
    profileImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNrQufxAVWBRmmOrt263vCXxAnNZ4YRb7jZosEBmgg3Zkhx8aKJA&s&ec=73053463",
    backgroundImage: "https://images.unsplash.com/photo-1506629905687-671b23ce4b7a?w=1200&h=800&fit=crop",
    age: "30",
    height: "168 cm",
    weight: "50 kg",
    nationality: "ญี่ปุ่น",
    other: "นักแสดงมืออาชีพ",
    bio: "นักแสดงที่มีชื่อเสียงและประสบการณ์มากมาย",
    galleryImages: [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ]
  }],
    ["凪ひかる", {
    primaryName: "凪ひかる",
    alternativeNames: ["藤浦めぐ"], // เก็บชื่ออื่นๆ ทั้งหมดไว้ใน array
    profileImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6fghUUnCpiIdyEh0q_CKn8lyz3LmaUXmhj2hOM8wtJUPr9rOTtw&s&ec=73053463",
    backgroundImage: "https://images.unsplash.com/photo-1506629905687-671b23ce4b7a?w=1200&h=800&fit=crop",
    age: "30",
    height: "168 cm",
    weight: "50 kg",
    nationality: "ญี่ปุ่น",
    other: "นักแสดงมืออาชีพ",
    bio: "นักแสดงที่มีชื่อเสียงและประสบการณ์มากมาย",
    galleryImages: [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ]
  }],
    ["響蓮", {
    primaryName: "響蓮",
    alternativeNames: ["藤浦めぐ"], // เก็บชื่ออื่นๆ ทั้งหมดไว้ใน array
    profileImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg5OxIknFGBHrhIUBnMxzJ0jFgpOd1s_kGb5n8DJyFKjfyCNTsuA&s&ec=73053463",
    backgroundImage: "https://images.unsplash.com/photo-1506629905687-671b23ce4b7a?w=1200&h=800&fit=crop",
    age: "30",
    height: "168 cm",
    weight: "50 kg",
    nationality: "ญี่ปุ่น",
    other: "นักแสดงมืออาชีพ",
    bio: "นักแสดงที่มีชื่อเสียงและประสบการณ์มากมาย",
    galleryImages: [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ]
  }],
    ["野々花あかり", {
    primaryName: "野々花あかり",
    alternativeNames: ["藤浦めぐ"], // เก็บชื่ออื่นๆ ทั้งหมดไว้ใน array
    profileImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwgS3I_gbvOk1At5RwlsfK3wQoV1WHe5L2HCLsMpvY7Zn9vkem3_Tc-H9B&s=10",
    backgroundImage: "https://images.unsplash.com/photo-1506629905687-671b23ce4b7a?w=1200&h=800&fit=crop",
    age: "30",
    height: "168 cm",
    weight: "50 kg",
    nationality: "ญี่ปุ่น",
    other: "นักแสดงมืออาชีพ",
    bio: "นักแสดงที่มีชื่อเสียงและประสบการณ์มากมาย",
    galleryImages: [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ]
  }],
]);

// ========== สร้าง Name Mapping สำหรับการค้นหา ==========
// สร้างแผนที่ที่เชื่อมต่อชื่อทั้งหมด (primary + alternative) เข้ากับ primary name
const createNameMapping = () => {
  const nameMapping = new Map();
  
  actorProfiles.forEach((profile, primaryName) => {
    // เพิ่ม primary name
    nameMapping.set(primaryName, primaryName);
    
    // เพิ่ม alternative names
    profile.alternativeNames?.forEach(altName => {
      nameMapping.set(altName, primaryName);
    });
  });
  
  return nameMapping;
};

// สร้าง name mapping ครั้งเดียวตอนโหลด
const nameMapping = createNameMapping();

// ========== ฟังก์ชันจัดการข้อมูล ==========

// ฟังก์ชันแปลงชื่อใดๆ ให้เป็น primary name
const getPrimaryName = (actorName) => {
  return nameMapping.get(actorName) || actorName;
};

// ฟังก์ชันตรวจสอบว่าชื่อนี้มี profile หรือไม่
const hasActorProfile = (actorName) => {
  const primaryName = getPrimaryName(actorName);
  return actorProfiles.has(primaryName);
};

// สร้างดัชนีสำหรับการค้นหานักแสดงไวขึ้น
const createActorIndex = () => {
  const actorIndex = new Map();
  
  actorsDatabase.forEach(item => {
    item.actors.forEach(actor => {
      // ใช้ primary name เป็น key
      const primaryName = getPrimaryName(actor);
      
      if (!actorIndex.has(primaryName)) {
        actorIndex.set(primaryName, []);
      }
      actorIndex.get(primaryName).push({
        vod_id: item.vod_id,
        title: item.title
      });
    });
  });
  
  return actorIndex;
};

// ดึงข้อมูลนักแสดงทั้งหมด (ปรับปรุงให้ไม่ซ้ำ)
export const getActorsData = (limit = 50) => {
  const actorIndex = createActorIndex();
  const actorStats = new Map();

  // นับจำนวนวิดีโอของแต่ละนักแสดง โดยใช้ primary name
  actorsDatabase.forEach(item => {
    item.actors.forEach(actor => {
      const primaryName = getPrimaryName(actor);
      
      if (!actorStats.has(primaryName)) {
        const profile = actorProfiles.get(primaryName);
        actorStats.set(primaryName, {
          id: primaryName,
          name: primaryName,
          alternativeNames: profile?.alternativeNames || [],
          videoCount: 0,
          videos: [],
          image: profile?.profileImage || `https://picsum.photos/400/400?random=${primaryName.charCodeAt(0)}`,
          hasProfile: !!profile
        });
      }
      
      const actorData = actorStats.get(primaryName);
      // ตรวจสอบไม่ให้นับซ้ำ
      const isDuplicate = actorData.videos.some(v => v.vod_id === item.vod_id);
      if (!isDuplicate) {
        actorData.videoCount++;
        actorData.videos.push({
          vod_id: item.vod_id,
          title: item.title
        });
      }
    });
  });

  // แปลงเป็น array และเรียงลำดับ
  const actors = Array.from(actorStats.values())
    .sort((a, b) => b.videoCount - a.videoCount)
    .slice(0, limit);

  return actors;
};

// ดึงข้อมูลโปรไฟล์นักแสดง (ปรับปรุงให้ดึงแค่ 1 profile)
export const getActorProfile = (actorName) => {
  const primaryName = getPrimaryName(actorName);
  const actorIndex = createActorIndex();
  const actorVideos = actorIndex.get(primaryName) || [];
  const profile = actorProfiles.get(primaryName);
  
  if (profile) {
    return {
      ...profile,
      name: profile.primaryName, // ใช้ primary name เป็นชื่อหลัก
      videoCount: actorVideos.length,
      allNames: [profile.primaryName, ...profile.alternativeNames] // รายการชื่อทั้งหมด
    };
  }
  
  return;
};

// ดึงรูปแกลเลอรี่ของนักแสดง
export const getActorGalleryImages = (actorName) => {
  const primaryName = getPrimaryName(actorName);
  const profile = actorProfiles.get(primaryName);
  
  if (profile && profile.galleryImages) {
    return profile.galleryImages;
  }  
  return images;
};

// ดึงวิดีโอของนักแสดง
export const getActorVideos = (actorName) => {
  const primaryName = getPrimaryName(actorName);
  const actorIndex = createActorIndex();
  const actorVideos = actorIndex.get(primaryName) || [];
  return actorVideos;
};

// ดึงนักแสดงที่เกี่ยวข้อง
export const getRelatedActorsData = (actorName, limit = 5) => {
  const primaryName = getPrimaryName(actorName);
  const actorIndex = createActorIndex();
  const currentActorVideos = actorIndex.get(primaryName) || [];
  
  if (currentActorVideos.length === 0) return [];
  
  // หานักแสดงอื่นๆ ที่อยู่ในวิดีโอเดียวกัน
  const relatedActors = new Set();
  
  currentActorVideos.forEach(video => {
    const videoInfo = actorsDatabase.find(item => item.vod_id === video.vod_id);
    if (videoInfo) {
      videoInfo.actors.forEach(actor => {
        const relatedPrimaryName = getPrimaryName(actor);
        if (relatedPrimaryName !== primaryName && relatedPrimaryName.trim()) {
          relatedActors.add(relatedPrimaryName);
        }
      });
    }
  });
  
  // แปลงเป็น array และดึงข้อมูลรายละเอียด
  const relatedActorNames = Array.from(relatedActors).slice(0, limit);
  const relatedActorDetails = [];
  
  for (const name of relatedActorNames) {
    const actorVideos = actorIndex.get(name) || [];
    const profile = actorProfiles.get(name);
    relatedActorDetails.push({
      id: name,
      name: name,
      alternativeNames: profile?.alternativeNames || [],
      image: profile?.profileImage || `https://picsum.photos/400/400?random=${name.charCodeAt(0)}`,
      videoCount: actorVideos.length
    });
  }
  
  return relatedActorDetails.sort((a, b) => b.videoCount - a.videoCount);
};

// ส่งออกข้อมูลสำหรับใช้งาน
export { actorsDatabase, actorProfiles, getPrimaryName, hasActorProfile };

