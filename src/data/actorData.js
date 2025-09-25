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
    "primaryName": "藤井蘭々",
    "alternativeNames": ["藤井蘭々", "蜜美杏"],
    "profileImage": "https://www.news-postseven.com/uploads/2023/08/25/fujii_ranran-500x750.jpg",
    "backgroundImage": "https://pics.dmm.co.jp/digital/video/1fns00039/1fns00039pl.jpg",
    "age": "24",
    "height": "170 cm",
    "weight": "48 kg",
    "nationality": "日本",
    "other": "AV出道于2020年4月25日（原名：蜜美杏），2022年7月更名并更换经纪公司，2023年4月回归",
    "bio": "藤井蘭々（ふじい らんらん，原名：蜜美杏），2000年11月15日出生于日本，是一位备受瞩目的成人影片女演员。她于2020年4月25日在Prestige和Eightman Production旗下以蜜美杏的名义出道，凭借170厘米的身高、纤细的身材（体重48公斤）以及B86(F)-W58-H89的完美比例迅速走红。她以性感而优雅的外型和多样化的表演风格吸引了大量粉丝。2022年7月，她更换艺名并转投新经纪公司，短暂休息后于2023年4月强势回归，继续活跃于成人娱乐行业。藤井蘭々の作品以高质量和高人气著称，她的职业生涯展现了出色的适应能力和持久的吸引力，对日本AV界产生了深远影响。",
    galleryImages: [
      "https://www.news-postseven.com/uploads/2023/08/25/fujii_ranran-500x750.jpg",
      "https://cdn.faleno.net/top/wp-content/uploads/2025/06/FNS-039_2125.jpg?resize=470:*&output-quality=60",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-p4UydEWOxfook8JvLyRgfbjW-UsDHYbKgCI6Di9DuET-AqeFa0fxLTue&s=10",
      "https://jav.wine/wp-content/uploads/2025/month-02/FSDSS-975.jpg",
      "https://jav.wine/wp-content/uploads/2025/month-01/FSDSS-967.jpg",
      "https://jav.wine/wp-content/uploads/2024/month-12/FSDSS-946.jpg",
      "https://jav.wine/wp-content/uploads/2025/month-05/FNS-024.jpg",
      "https://jav.wine/wp-content/uploads/2024/month-10/FSDSS-893-jav.wine_.jpg",
      "https://jav.wine/wp-content/uploads/2024/month-09/FSDSS-872-jav.wine_.jpg",
      "https://jav.wine/wp-content/uploads/2024/month-08/FSDSS-867-jav.wine_.jpg",
      "https://jav.wine/wp-content/uploads/2024/month-07/FSDSS-826-jav.wine_.jpg",
      "https://jav.wine/wp-content/uploads/2024/05/FSDSS-786-jav.wine_.jpg",
      "https://jav.wine/wp-content/uploads/2024/month-06/FSDSS-807.jpg",
      "https://jav.wine/wp-content/uploads/2024/04/FSDSS-772-jav.wine_.jpg",
      "https://jav.wine/wp-content/uploads/2024/01/FSDSS-721.jpg",
      "https://jav.wine/wp-content/uploads/2024/02/FSDSS-735-jav.wine_.jpg",
      "https://image.av-event.jp/contents/images/32443/1126ff6d84bb70474584cb7c10bc0f40.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSQkHZbB3WCT6DzZODKMMA-gSQ4TGR1YO8CPTbz6aCRI8XQU6M958KZwps&s=10",
      "https://cdn.faleno.net/top/wp-content/uploads/2023/03/fujii.jpg?resize=520:*&output-quality=60",
      "https://artjav.com/wp-content/uploads/fns-004-d131.jpg"
    ]
  }],

  ["折原ゆかり", {
    "primaryName": "折原ゆかり",
    "alternativeNames": ["折原ゆかり"],
    "profileImage": "https://pics.javhd.today/videos/tmb/000/188/398/1.jpg",
    "backgroundImage": "https://cdn10.javtop.fun/images5/ly2ncguabe8liis/VENX-254.jpg",
    "age": "50",
    "height": "160 cm",
    "weight": "45 kg",
    "nationality": "日本",
    "other": "信息补充",
    "bio": "折原ゆかり（おりはら ゆかり），1975年2月16日出生于日本，是一位资深的成人影片女演员，隶属于Capsule Agency。她以成熟女性的魅力和多变的表演风格闻名于业界，活跃于众多以家庭伦理、熟女主题为主的作品中，例如2009年的《息子に揉まれ風情の母》（儿子揉捏的母性风情）、2011年的《騎乗位がやめられなくて…》（无法戒掉的骑乘位）以及《人妻アナル競売》（人妻肛门拍卖）等。这些作品展现了她在情感深度和身体表现力上的出色能力。此外，她还涉足时尚与社会领域，2022年9月24日在神田明神ホール举办的Asia Pacific Collection活动中，作为性工作者代表走上T台，象征性地挑战了行业刻板印象。身高约160厘米，体重约45公斤的她，拥有匀称的身材和迷人的曲线，深受粉丝喜爱。作为一位经验丰富的艺人，她的作品总数超过数百部，持续影响着日本成人娱乐圈的发展。",
    galleryImages: [
      "https://m.media-amazon.com/images/I/8101sUbc1oL._UF894,1000_QL80_.jpg",
      "https://cdn.base.geonet.jp/img/prod/600/392/82/3928245-01-01.jpg",
      "https://m.media-amazon.com/images/I/81IDdhQOhwL.jpg",
      "https://ignewsimg.s3.ap-northeast-1.wasabisys.com/B5hThHfHKl4",
      "https://picazor.com/_next/image?url=%2Fuploads%2Fd24%2Ftu24%2Fyukari-orihara%2Fonlyfans%2F19g2l%2Fyukari-orihara-onlyfans-ahqt5-3.jpg&w=400&q=80",
      "https://picazor.com/_next/image?url=%2Fuploads%2Fd24%2Ftu24%2Fyukari-orihara%2Fonlyfans%2F19g2l%2Fyukari-orihara-onlyfans-h4mjw-4.jpg&w=400&q=80",
      "https://picazor.com/_next/image?url=%2Fuploads%2Fd24%2Ftu24%2Fyukari-orihara%2Fonlyfans%2F19g2l%2Fyukari-orihara-onlyfans-ibufi-5.jpg&w=400&q=80",
      "https://picazor.com/_next/image?url=%2Fuploads%2Fd24%2Ftu24%2Fyukari-orihara%2Fonlyfans%2F19g2l%2Fyukari-orihara-onlyfans-f2nol-6.jpg&w=400&q=80",
      "https://picazor.com/_next/image?url=%2Fuploads%2Fd24%2Ftu24%2Fyukari-orihara%2Fonlyfans%2F19g2l%2Fyukari-orihara-onlyfans-s2cpt-7.jpg&w=400&q=80",
      "https://picazor.com/_next/image?url=%2Fuploads%2Fd24%2Ftu24%2Fyukari-orihara%2Fonlyfans%2F19g2l%2Fyukari-orihara-onlyfans-vxh3d-8.jpg&w=400&q=80",
      "https://pics.dmm.co.jp/digital/video/h_237nacr00107/h_237nacr00107jp-17.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjmLG_NP5iRKx_ii-i4NeqYIJ9cxoLi-uYuLzBBfATi5FEBSraO4tjWFM&s=10",
      "https://ignewsimg.s3.ap-northeast-1.wasabisys.com/Cu0Z3DbS_lw",
      "https://cdn.base.geonet.jp/img/prod/600/398/82/3988245-01-01.jpg",
      "https://cdn.base.geonet.jp/img/prod/600/350/81/3508114-01-01.jpg",
      "https://cdn.base.geonet.jp/img/prod/600/353/55/3535599-01-01.jpg",
      "https://hbox.jp/image3/content/418913/cover.jpg",
      "https://livedoor.blogimg.jp/roadman924/imgs/3/7/37bf8249.jpg",
      "https://www.mousouzoku-av.com/contents/works/avsw/avsw024/avsw024pm.jpg?1663291644",
      "https://awsimgsrc.dmm.co.jp/pics_dig/digital/video/h_086iwan00009/h_086iwan00009jp-10.jpg",
      "https://m.media-amazon.com/images/I/91zALrwzc2L._UF894,1000_QL80_.jpg",
    ]
  }],

  ["沙月恵奈", {
    "primaryName": "沙月恵奈",
    "alternativeNames": ["沙月恵奈"],
    "profileImage": "https://image.av-event.jp/contents/images/30772/522b82e1c0517f950b5e07f4904dfabb.jpg",
    "backgroundImage": "https://pics.dmm.co.jp/digital/video/mvg00134/mvg00134pl.jpg",
    "age": "26",
    "height": "158 cm",
    "weight": "42 kg",
    "nationality": "日本",
    "other": "信息补充",
    "bio": "沙月恵奈（さつき えな），1999年6月11日出生于日本，是一位崭露头角的成人影片女演员，以其清新可爱的形象和高超的表演技巧迅速在业界崭露头角。她于2020年9月正式出道，隶属于经纪公司LINX，以娇小的身材（身高158厘米，体重42公斤）和甜美的外貌吸引了大量粉丝的关注。她的作品风格多样，涵盖了从清纯到大胆的多种角色，展现了出色的表演张力。沙月恵奈以其专业态度和不断提升的表现力，成为日本AV界备受期待的新星，持续为观众带来高质量的作品。",
    galleryImages: [
      "https://analersdelight.com/wp-content/uploads/2023/12/xx93ds4.jpg",
      "https://analersdelight.com/wp-content/uploads/2023/12/ffrd2.jpg",
      "https://www.indies-av.co.jp/wp-content/uploads/2021/11/ena_satsuki_top.jpg",
      "https://pics.dmm.co.jp/digital/video/1iesm00075/1iesm00075jp-14.jpg",
      "https://avosusume.com/webroot/image/contents/dmm/ore922/ore922jp.webp?201117.01",
      "https://geinou-nude.com/wp-content/uploads/2023/10/satsuki_020-700x988.jpg",
      "https://japanesebeauties.one/japanese/keina-satsuki/8/keina-satsuki-2.jpg",
      "https://j.uuu.cam/jav/japanese/keina-satsuki/4/keina-satsuki-6.jpg",
      "https://file.spice-tv.jp/free/ppv/AB/mbr_ab034_fhd/pkg_s.jpg",
      "https://pics.dmm.co.jp/digital/video/1ienf00183/1ienf00183jp-1.jpg",
      "https://pics.dmm.co.jp/digital/video/vrkm00809/vrkm00809jp-14.jpg",
      "https://image.av-event.jp/contents/images/29835/c9a4ed0b3af54bb2d50c23c17a27d02b.jpg",
      "https://img.sokmil.com/image/product/pef_nms0549_01_T1702003550.jpg",
      "https://blog-imgs-145.fc2.com/o/p/p/oppainorakuen/20211103_02_013.jpg",
      "https://nekobox.top/wp-content/uploads/2024/02/ENATAIYO2_30.jpg",
      "https://www.indies-av.co.jp/wp-content/uploads/2021/11/ena_satsuki_top.jpg",
      "https://image.av-event.jp/contents/images/31494/56ed290759950273f1ab7e57a01f780a.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ73AFOtA2Um49am1Gy7PPJ3ZcBQq6ITYkFLMRxJzm9acekxb32y15yeuX_&s=10",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTJabK_C-biZ62i8wf70IL2wipNRQDE-79Htwg7v9_Nmy0RkR-dnmscpez&s=10",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsEXWQKc8QE_mCqDhPHzNRywprlwlQDMxWlXZ9MkfqD5xCPZHKFUixe8A&s=10"
    ]
  }],

  ["白峰ミウ", {
    "primaryName": "白峰ミウ",
    "alternativeNames": ["白峰ミウ"],
    "profileImage": "https://cdn.up-timely.com/image/8/content/80170/ZR0UsljzAmSg6d1FGp8tZD2ApucymlaqrFwrcDI5.jpg",
    "backgroundImage": "https://pics.pornfhd.com/s/digital/video/ipx00806/ipx00806pl.jpg",
    "age": "27",
    "height": "162 cm",
    "weight": "46 kg",
    "nationality": "日本",
    "other": "信息补充",
    "bio": "白峰ミウ（しらみね みう），1998年2月16日出生于日本，是一位备受欢迎的成人影片女演员，以其优雅的气质和出色的表演能力在业界崭露头角。她于2021年1月以IdeaPocket旗下演员身份正式出道，凭借162厘米的身高、46公斤的纤细体重以及B88(E)-W57-H88的迷人身材迅速吸引了大量粉丝。白峰ミウ的作品以情感细腻和多样化的角色演绎著称，涵盖了从浪漫到激烈的情节，展现了她独特的魅力和专业素养。作为一名年轻而充满潜力的演员，她持续为日本AV界带来高质量的内容，深受观众喜爱。",
    galleryImages: [
      "https://cdn.suruga-ya.jp/database/pics_webp/game/332044217.jpg.webp",
      "https://cdn.up-timely.com/image/15/content/78636/kmJDirgJQnULprKibRQZApJ4KHk8hocqrUSuZ3ZN.jpg",
      "https://m.media-amazon.com/images/I/91U++R9KPVL.jpg",
      "https://m.media-amazon.com/images/I/81UZL40bv3L._UF1000,1000_QL80_.jpg",
      "https://1.bp.blogspot.com/-qsV9bWMzE0g/YLdyD4BqfEI/AAAAAAABvDQ/4DQyfIi45IMGXf3rxhiuHXLA-PcxUd75ACLcBGAsYHQ/s0/%25E7%2599%25BD%25E5%25B3%25B0%25E3%2583%259F%25E3%2582%25A6%2B%25285%2529.jpg",
      "https://cdn.suruga-ya.jp/database/pics_light/game/731381584.jpg",
      "https://eromitai.com/wordpress/wp-content/uploads/2022/01/shiromine_miu2201006.jpg",
      "https://pics.dmm.co.jp/digital/video/ipx00589/ipx00589jp-1.jpg",
      "https://awsimgsrc.dmm.co.jp/pics_dig/digital/video/ipx00589/ipx00589jp-2.jpg",
      "https://pics.dmm.co.jp/mono/movie/adult/adn732/adn732ps.jpg",
      "https://blog-imgs-167.fc2.com/r/1/8/r18000/202401111512351df.jpg",
      "https://blog-imgs-149.fc2.com/r/1/8/r18000/20211112194626574.jpg",
      "https://blog-imgs-149.fc2.com/r/1/8/r18000/20211112194622809.jpg",
      "https://blog-imgs-167.fc2.com/r/1/8/r18000/202401111512367b2.jpg",
      "https://cdn.up-timely.com/image/8/content/78374/huXIULEZWm2xF9TPRlV0eiJ0CMxIlpNjaLekjbpL.jpg",
      "https://pics.dmm.co.jp/digital/video/yuj00008/yuj00008ps.jpg",
      "https://awsimgsrc.dmm.co.jp/pics_dig/digital/video/waaa00576/waaa00576ps.jpg",
      "https://cdn.up-timely.com/image/8/content/77388/ot4mCi9W1NECV5RhSKSNpQOvCGtjQ3ZmRM8qmSCY.jpg",
      "https://cdn.up-timely.com/image/8/content/76923/ASH34LWoVHICFrkjc0axNE7xWrl5re2ji6RspYnV.jpg",
      "https://cdn.up-timely.com/image/15/content/75292/FNuvstUUjFTeZGJrJtGtpCCiqsG2MOGqBytV1eBu.jpg",
    ]
  }],

  ["都月るいさ", {
    "primaryName": "都月るいさ",
    "alternativeNames": ["都月るいさ"],
    "profileImage": "https://cdn.suruga-ya.jp/database/pics_light/game/gl739264.jpg",
    "backgroundImage": "https://fourhoi.com/xvsr-756-uncensored-leak/cover-n.jpg",
    "age": "26",
    "height": "165 cm",
    "weight": "47 kg",
    "nationality": "日本",
    "other": "信息补充",
    "bio": "都月るいさ（みやこづき るいさ），1998年8月25日出生于日本，是一位备受喜爱的成人影片女演员，以其充满活力的表演和迷人的外貌在业界崭露头角。她于2022年8月以Madonna旗下演员身份正式出道，凭借165厘米的身高、47公斤的纤细体重以及B89(E)-W56-H88的出色身材迅速获得关注。都月るいさ以其多才多艺的演技和自然的魅力著称，作品涵盖了从浪漫剧情到高强度的角色扮演，展现了她在不同类型中的适应能力。作为一名经验丰富的演员，她的专业态度和高人气使她成为日本AV界的重要人物，持续为观众带来令人印象深刻的表现。",
    galleryImages: [
      "https://m.media-amazon.com/images/I/712TNwM9sbL._UF894,1000_QL80_.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOtcb05G0T2bkE0HJ8i0gTMIQUxoDmP9icPPk-aPVRCX2jxNIg6ALX-tH6&s=1",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSotPzpQOmvQJnSJ9HaANFbQtTzYOcmoA3ssPU-I2ONxg4x7FYSvucVmls&s=10",
      "https://blog-imgs-175.fc2.com/s/u/m/sumomochannel/totsuki_ruisa_13860-003.jpg",
      "https://blog-imgs-167.fc2.com/s/u/m/sumomochannel/totsuki_13532-003.jpg",
      "https://static.mercdn.net/item/detail/orig/photos/m87896439477_5.jpg?1715978383",
      "https://m.media-amazon.com/images/I/818CdLSL-tL._UF1000,1000_QL80_.jpg",
      "https://awsimgsrc.dmm.co.jp/pics_dig/digital/video/manx00016/manx00016jp-1.jpg",
      "https://image.mgstage.com/images/luxutv/259luxu/1707/pf_o1_259luxu-1707.jpg",
      "https://vod365.net/wp-content/uploads/2025/07/totsukiruisa.jpg",
      "https://cdn.base.geonet.jp/img/prod/600/355/79/3557901-01-01.jpg",
      "https://cdn.suruga-ya.jp/database/pics_light/game/gn104449.jpg",
      "https://cdn.suruga-ya.jp/database/pics_webp/game/gn104446.jpg.webp",
      "https://cdn.up-timely.com/image/12/content/70779/eQ0u1PspQCQ3wFgp7jHziizOy97FLvVGqDga4CVy.jpg",
      "https://livedoor.sp.blogimg.jp/avdrifters/imgs/c/3/c3a552cc.jpg",
      "https://cdn.suruga-ya.jp/database/pics_webp/game/gl739266.jpg.webp",
      "https://ignewsimg.s3.ap-northeast-1.wasabisys.com/Ch1UfxHP90v",
      "https://cdn.up-timely.com/image/8/content/70131/7nnOS7NgSSOdvkMbeDrJ2kzD2dmCPBwK8xCpFDEv.jpg",
      "https://adavi.tokyo/wp-content/uploads/2023/11/ruisa-totsuki-corporate-receptionist02.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxcv3yMIjQOqRcEdcc4PY_92NAiiButi-rdfn99dXWfOO55WsD6T-IkO0&s=10",
    ]
  }],

  // เพิ่มนักแสดงที่มีชื่อหลายแบบ - ใช้ primary name เป็นตัวหลัก
  ["めぐり", {
    "primaryName": "めぐり",
    "alternativeNames": ["藤浦めぐ", "藤浦惠"],
    "profileImage": "https://jav.wine/wp-content/uploads/2024/month-10/JUQ-893-jav.wine_.jpg",
    "backgroundImage": "https://pornjapanxx.com/wp-content/uploads/2023/08/MEYD-568-400x269.webp",
    "age": "36",
    "height": "168 cm",
    "weight": "50 kg",
    "nationality": "日本",
    "other": "专业演员",
    "bio": "めぐり（藤浦めぐ，ふじうら めぐ），1989年5月4日出生于日本，是一位在成人影片行业中享有盛誉的资深女演员。她于2006年以藤浦惠的名义出道，隶属于S1 No.1 Style，凭借168厘米的身高、50公斤的体重以及B95(G)-W60-H88的惊艳身材迅速走红。めぐり以其甜美的外貌和多才多艺的表演风格著称，作品涵盖了从清纯到成熟女性的多种角色。她在职业生涯中曾短暂引退，但于2017年以めぐり之名强势回归，加入经纪公司T-Powers，继续活跃于业界。她的作品数量庞大，风格多样，深受粉丝喜爱，确立了她在日本AV界的重要地位。",
    galleryImages: [
      "https://pbs.twimg.com/media/Ffsdj4NaUAAplUv.jpg:large",
      "https://img.pali.zone/data-optim/adult-videos/JUQ-943/thumb/JUQ-943.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT11ZC9pNh7AVbNwxeqxiAI0HqysHjb-V36IUYlEBKia124ol973yBGLFn2&s=10",
      "https://img.pali.zone/data-optim/adult-videos/JUR-354/thumb/JUR-354.jpg",
      "https://j.jjj.cam/jav/japanese/meguri/69/meguri-5.jpg",
      "https://pbs.twimg.com/profile_images/1903528611552088064/Zt86_b5l_400x400.jpg",
      "https://j.jjj.cam/jav/japanese/meguri/28/meguri-4.jpg",
      "https://j.jjj.cam/jav/japanese/meguri/28/meguri-2.jpg",
      "https://www.zenra.net/imgcache/original/blog_photos/4/meguri-jav-4_66f1eee1635ca.jpeg",
      "https://pbs.twimg.com/media/FNJ8RVJVcAIXMd7.jpg",
      "https://pbs.twimg.com/media/FzE2tnZaAAA8cAZ.jpg:large",
      "https://pbs.twimg.com/media/FuGGl9DagAAhPtQ.jpg:large",
      "https://img.pali.zone/data-optim/adult-videos/JUR-448/thumb/JUR-448.jpg",
      "https://jav-master.com/wp-content/uploads/2023/07/MEYD-575-min-237x300.jpg",
      "https://pbs.twimg.com/media/FlKjTp0aAAgGoPW.jpg:large",
      "https://pbs.twimg.com/media/FjZKiDmaAAA9nq8.jpg:large",
      "https://pbs.twimg.com/media/FL5cuBWVkAAjvsh.jpg:large",
      "https://pbs.twimg.com/media/FuEKstZaEAUnmC4.jpg:large",
      "https://pbs.twimg.com/media/FDHvai-acAAfhY_.jpg:large",
      "https://javtube.com/javpic/meguri/76/meguri-5.jpg",
      "https://j.jjj.cam/jav/japanese/meguri/47/meguri-6.jpg",
      "https://mpics-cdn-acc.mgronline.com/pics/Images/560000008402505.JPEG.webp"
    ]
  }],
  ["倉多まお", {
    "primaryName": "倉多まお",
    "alternativeNames": ["倉多まお"],
    "profileImage": "https://cdn.suruga-ya.jp/database/pics_webp/game/131905185.jpg.webp",
    "backgroundImage": "https://fourhoi.com/eyan-011/cover-t.jpg",
    "age": "31",
    "height": "154 cm",
    "weight": "50 kg",
    "nationality": "日本",
    "other": "专业演员",
    "bio": "倉多まお（くらた まお），1994年3月7日出生于日本秋田县，是一位备受推崇的成人影片女演员，以其活泼的个性和多才多艺的表演风格在业界广受欢迎。她于2012年以S1 No.1 Style旗下演员身份出道，凭借154厘米的身高、50公斤的体重以及B95(H)-W58-H87的迷人身材迅速吸引了大量粉丝。倉多まお的作品风格多样，从清新可爱到成熟性感均有涉猎，展现了她出色的表演能力和独特的魅力。她曾活跃于多个知名片商，如Moodyz和Attackers，并在职业生涯中积累了数百部作品。作为一名经验丰富的演员，她以专业态度和高人气持续为日本AV界带来高质量的内容，深受观众喜爱。",
    galleryImages: [
      "https://blog-imgs-143.fc2.com/e/r/o/erog/Kurata_Mao_20220316_002.jpg",
      "https://blog-imgs-143.fc2.com/e/r/o/erog/Kurata_Mao_20220316_018.jpg",
      "https://blog-imgs-143.fc2.com/e/r/o/erog/Kurata_Mao_20220316_004.jpg",
      "https://j.uuu.cam/jav/japanese/mao-kurata/2/mao-kurata-6.jpg",
      "https://japanesebeauties.one/japanese/mao-kurata/1/mao-kurata-4.jpg",
      "https://j.uuu.cam/jav/japanese/mao-kurata/4/mao-kurata-1.jpg",
      "https://pashalism.com/wp-content/uploads/2022/06/2423-41.jpg",
      "https://tedouraku.com/img5/891-150.jpg",
      "https://japanesebeauties.one/japanese/mao-kurata/20/mao-kurata-7.jpg",
      "https://pashalism.com/wp-content/uploads/2022/06/2423-54.jpg",
      "https://pashalism.com/wp-content/uploads/2022/06/2423-3.jpg",
      "https://japanesebeauties.one/japanese/mao-kurata/32/mao-kurata-2.jpg",
      "https://www.mousouzoku-av.com/contents/works/soav/soav021/soav021pm.jpg?1663331840",
      "https://japanesebeauties.one/thumbs/160x222/222767.jpg",
      "https://geinou-nude.com/wp-content/uploads/2023/02/m_kurata_019-666x1000.jpg",
      "https://eromitai.com/wordpress/wp-content/uploads/2016/03/kurata_mao1603015.jpg",
      "https://cdn.up-timely.com/image/20/content/52340/PPBD197_1.jpg",
      "https://cdn.up-timely.com/image/20/content/56986/PPPD974_1.jpg",
      "https://cdn.up-timely.com/image/20/content/55800/PPBD216_1.jpg",
      "https://japanesebeauties.one/media/japanese/mao-kurata/14/hd-mao-kurata-8.jpg",
    ]
  }],
  ["水卜さくら", {
    "primaryName": "水卜さくら",
    "alternativeNames": ["水卜さくら"],
    "profileImage": "https://cdn.suruga-ya.jp/database/pics_light/game/gn437022.jpg",
    "backgroundImage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOkiW6JnsChgNvZXeNq0KFPz2cOLV7uoCC4lNdXX7_q3wCKf0wjsbn0Ag&s=10",
    "age": "27",
    "height": "152 cm",
    "weight": "50 kg",
    "nationality": "日本",
    "other": "专业演员",
    "bio": "水卜さくら（みずと さくら），1997年11月30日出生于日本，是一位备受瞩目的成人影片女演员，以其清纯的外貌和出色的身材比例在业界广受欢迎。她于2017年以S1 No.1 Style旗下演员身份出道，凭借152厘米的身高、50公斤的体重以及B79(G)-W52-H78的惊艳身材迅速走红。水卜さくら以其自然的表演风格和独特的魅力著称，作品风格多变，从青春活力到温柔细腻的角色均有出色表现。她在职业生涯中持续与顶级片商合作，如Moodyz和S1，积累了大量高质量作品。作为一名专业演员，她的才华和人气使她成为日本AV界的代表性人物之一，深受粉丝喜爱。",
    galleryImages: [
      "https://j.jjj.cam/jav/japanese/sakura-miura/4/sakura-miura-10.jpg",
      "https://j.jjj.cam/jav/japanese/sakura-miura/6/sakura-miura-7.jpg",
      "https://imagex1.sx.cdn.live/images/pinporn/2022/02/17/26739442.jpg?width=620",
      "https://photos.xgroovy.com/contents/albums/sources/741000/741885/841188.jpg",
      "https://www.babepedia.com/user-uploads/Sakura%20Miura5.jpg",
      "https://j.jjj.cam/jav/japanese/sakura-miura/5/sakura-miura-10.jpg",
      "https://blog-imgs-167.fc2.com/s/u/m/sumomochannel/miura_13074-001.jpg",
      "https://blog-imgs-101.fc2.com/e/r/o/erog/miura_sakura_20181015_002s.jpg",
      "https://m.media-amazon.com/images/I/812DB+3t3ZL._UF1000,1000_QL80_.jpg",
      "https://img.pali.zone/data-optim/adult-videos/MIDV-852/thumb/MIDV-852.jpg",
      "https://img.pali.zone/data-optim/adult-videos/REBD-922/thumb/REBD-922.jpg",
      "https://m.media-amazon.com/images/I/81XABq1xs9L._UF894,1000_QL80_.jpg",
      "https://cdn.suruga-ya.jp/database/pics_webp/game/gn437001.jpg.webp",
      "https://cdn.suruga-ya.jp/database/pics_webp/game/gg530999.jpg.webp",
      "https://cdn.suruga-ya.jp/database/pics_light/game/g3889331.jpg",
      "https://cdn.suruga-ya.jp/database/pics_webp/game/gn318806.jpg.webp",
      "https://av-erogazou.com/wp-content/uploads/2021/06/mide00872jp-10.jpg",
      "https://img.pali.zone/data-optim/adult-videos/MIDA-325/thumb/MIDA-325.jpg",
      "https://m.media-amazon.com/images/I/91O3zA5qEmL._UF894,1000_QL80_.jpg",
      "https://blog-imgs-164.fc2.com/s/u/m/sumomochannel/miura_sakura_14986-001s.jpg",
    ]
  }],
  ["七沢みあ", {
    "primaryName": "七沢みあ",
    "alternativeNames": ["七沢みあ"],
    "profileImage": "https://www.tenhow.net/images/B0C2TLMYZY.jpg",
    "backgroundImage": "https://fourhoi.com/midv-938/cover-t.jpg",
    "age": "26",
    "height": "153 cm",
    "weight": "50 kg",
    "nationality": "日本",
    "other": "专业演员",
    "bio": "七沢みあ（ななさわ みあ），1998年12月13日出生于日本东京，是一位备受喜爱的成人影片女演员，以其可爱的外貌和活泼的表演风格在业界享有盛誉。她于2017年11月25日以MOODYZ旗下演员身份正式出道，凭借153厘米的身高、50公斤的体重以及B80(C)-W55-H83的娇小身材迅速走红。七沢みあ以其多才多艺的角色诠释和独特的魅力著称，作品风格多样，从校园少女到大胆的情节均有出色表现。她曾获得FANZA成人奖多项提名，并在2020年7月荣登FANZA视频月度女演员排行榜首位。作为一名专业演员，她隶属于Capsule Agency，持续活跃于日本AV界，积累了数百部高质量作品，深受粉丝喜爱。",
    galleryImages: [
      "https://www.shichuanling.com/wp-content/uploads/2024/07/030-724x1024.jpg",
      "https://cdn-1.ggjav.com/media/preview/211668_0.jpg",
      "https://cdn-1.ggjav.com/media/preview/58899_0.jpg",
      "https://blog-imgs-145.fc2.com/s/u/m/sumomochannel/nanasawa_11166-001s.jpg",
      "https://geinou-nude.com/wp-content/uploads/2023/06/n_mia_021-1-700x990.jpg",
      "https://j.jjj.cam/fanza/mia-nanasawa/mide00658/mia-nanasawa-7.jpg",
      "https://j.jjj.cam/fanza/mia-nanasawa/mide00658/mia-nanasawa-9.jpg",
      "https://blog-imgs-101.fc2.com/s/u/m/sumomochannel/nanasawa_mia_8913-002s.jpg",
      "https://fj.qixianzi.com/uploads/2023/12/09/8fe5f00a052248ffa8800463d06dd167.jpg",
      "https://www.shichuanling.com/wp-content/uploads/2024/07/091-724x1024.jpg",
      "https://livedoor.sp.blogimg.jp/imperator5714-nationals/imgs/3/8/38ad3965.jpg",
      "https://av-erogazou.com/wp-content/uploads/2021/11/mide00970jp-7.jpg",
      "https://ertk.net/imgs/2021/09/2021-09-02-5_nanasawaMiwa011.jpg",
      "https://blog-imgs-167.fc2.com/s/u/m/sumomochannel/nanasawa_13250-001s.jpg",
      "https://m.media-amazon.com/images/I/71bVBdGVpkL._UF894,1000_QL80_.jpg",
      "https://pics.dmm.co.jp/digital/video/midv00109/midv00109jp-8.jpg",
      "https://3.bp.blogspot.com/-viD6lXdgGwQ/WeBQ5VaueMI/AAAAAAAC6qs/DwiX9qbellYLEn-8QGCw7YZik9Ne64ZjQCLcBGAs/s1600/mide488jp-02.jpg",
      "https://www.i-dol.tv/contents/works/oae144/oae144-03.jpg",
      "https://geinou-nude.com/wp-content/uploads/2023/06/n_mia_024-700x990.jpg",
      "https://pbs.twimg.com/media/E0InKZUUUAI0Vje.jpg",
      "https://pbs.twimg.com/media/Ea81_kJU0AEZA_A.jpg",
      "https://blog-imgs-145.fc2.com/s/u/m/sumomochannel/nanasawa_mia_10236-001s.jpg",
    ]
  }],
  ["宮下玲奈", {
    "primaryName": "宮下玲奈",
    "alternativeNames": ["宮下玲奈"],
    "profileImage": "https://awsimgsrc.dmm.co.jp/pics_dig/digital/video/midv00461/midv00461jp-10.jpg",
    "backgroundImage": "https://fourhoi.com/midv-461/cover-n.jpg",
    "age": "24",
    "height": "152 cm",
    "weight": "50 kg",
    "nationality": "日本",
    "other": "专业演员",
    "bio": "宮下玲奈（みやした れな），2001年7月15日出生于日本大分县，是一位备受瞩目的成人影片女演员，以其清纯可爱的形象和出色的表演能力在业界迅速走红。她于2022年3月以MOODYZ旗下演员身份正式出道，凭借152厘米的身高、50公斤的体重以及B83(D)-W57-H85的娇小身材吸引了大量粉丝。宮下玲奈以其自然的演技和多样的角色诠释著称，作品涵盖从青春少女到情感丰富的剧情，展现了她独特的魅力。她隶属于T-Powers经纪公司，活跃于多个知名片商，如MOODYZ和Attackers，并在短时间内积累了大量高质量作品。作为一名年轻而充满潜力的演员，她的专业态度和高人气使她成为日本AV界的新星，深受观众喜爱。",
    galleryImages: [
      "https://j.jjj.cam/jav/japanese/lena-miyashita/4/lena-miyashita-2.jpg",
      "https://j.jjj.cam/jav/japanese/lena-miyashita/10/lena-miyashita-2.jpg",
      "https://javtube.com/javpic/lena-miyashita/6/lena-miyashita-8.jpg",
      "https://j.uuu.cam/jav/japanese/lena-miyashita/5/lena-miyashita-7.jpg",
      "https://j.uuu.cam/jav/japanese/lena-miyashita/9/lena-miyashita-5.jpg",
      "https://lovekoala.com/photo/miyashita-rena/miyashita-rena-20250222113852-10022.jpg",
      "https://awsimgsrc.dmm.co.jp/pics_dig/digital/video/mdvr00316/mdvr00316jp-1.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZTz_Ir5iIyITg-WXPTXVg3hG3hrCYOk3U8exghDqGAj5JhHsR_PwOfg-9&s=10",
      "https://img.eropasture.com/wp-content/uploads/2025/08/0821_01_040.jpg",
      "https://geinou-nude.com/wp-content/uploads/2023/12/miyashi_009-700x875.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTezIcco_L1xvyPg6n_Qi3fx1n_uR1vema8-B6lxuIJ8aiEHTseiBJqqRPP&s=10",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaD1xLprqrnq84OyrKIWZly5erB5DN7Ce0x3zEX4LIM-6yuIBghFJp8Rat&s=10",
      "https://awsimgsrc.dmm.co.jp/pics_dig/digital/video/mdvr00248/mdvr00248jp-1.jpg",
      "https://picture.yoshiclub.xyz/20230919/ea7eed29-9cb0-4bb9-84b7-a477a2aa7541.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyznONtiAqJRVobuhat5t4sByJGj1uWy36HDcYxCUtWeYqXsCVxUsX8bFA&s=10",
      "https://blog-imgs-159.fc2.com/g/m/8/gm8j46mpp36s/20230215134906ab5.jpg",
      "https://ugj.net/tokyogirl/lena-miyashita/4/lena-miyashita-5.jpg",
      "https://img.bakufu.jp/wp-content/uploads/2024/06/240613a_0002.jpg",
      "https://blog-imgs-164.fc2.com/g/m/8/gm8j46mpp36s/20250619202710d2b.jpg",
      "https://e2.eroimg.net/images/get/468/497/_67a27248a063f.jpeg",
      "https://hotgirl.asia/wp-content/uploads/2025/09/e6c37087b47442c88d16d8baafe77a62-300x450.webp",
    ]
  }],
  ["三田真鈴", {
    "primaryName": "三田真鈴",
    "alternativeNames": ["三田真鈴"],
    "profileImage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQU7hAug_nOETK6iV6n7Klv852Kzn3qvadav1qOzw8FSsBpWme9LRPRrtY_&s=10",
    "backgroundImage": "https://pics.dmm.co.jp/digital/video/sone00531/sone00531pl.jpg",
    "age": "23",
    "height": "153 cm",
    "weight": "50 kg",
    "nationality": "日本",
    "other": "专业演员",
    "bio": "三田真鈴（みた まりん），2002年6月28日出生于日本，是一位备受关注的成人影片女演员，以其甜美的笑容和自然的表演风格迅速在业界崭露头角。她于2023年11月14日以S1 NO.1 STYLE专属女优身份正式出道，凭借153厘米的身高、50公斤的体重以及B83(D)-W57-H85的匀称身材吸引了大量粉丝。三田真鈴的作品风格多样，从清纯大学生到大胆的情节均有出色表现，展现了她独特的魅力和潜力。她隶属于LIGHT经纪公司，兴趣包括魔术，自述性格为“随和且超级天然”。作为一名年轻演员，她已参与多部S1周年纪念作品，并在FANZA排行榜上屡获佳绩，持续为日本AV界注入新鲜活力，深受观众喜爱。",
    galleryImages: [
      "https://pbs.twimg.com/media/GDomXpBbwAADquU.jpg:large",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzlbw43R57LBxY5_ZY3Uw4_DAXn9hSpI2l8Ny83aSFZAJzDk6zcF6188VY&s=10",
      "https://blog-imgs-175.fc2.com/h/a/p/happysmile0418/marin-mita4_1.jpg",
      "https://pbs.twimg.com/media/GTgdkfMaEAAar0F.jpg:large",
      "https://img.bakufu.jp/wp-content/uploads/2024/01/240111a_0006.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkdDRr9wo295tL3Nh1qiPwipt3necnjooA3eUN_cviKZEoN-TlayoJp5k&s=10",
      "https://blog-imgs-175.fc2.com/h/a/p/happysmile0418/marin-mita4_2.jpg",
      "https://pbs.twimg.com/media/GMRxStaaUAAw4IV.jpg:large",
      "https://livedoor.blogimg.jp/johoten/imgs/1/4/14557d92.jpg",
      "https://blog-imgs-175.fc2.com/s/u/m/sumomochannel/mita_marin_13901-002.jpg",
      "https://gravia.site/img/img_661040.jpg",
      "https://2chav.com/wp-content/uploads/%E4%B8%89%E7%94%B0%E7%9C%9F%E9%88%B4-1.jpg",
      "https://blog-imgs-175.fc2.com/s/u/m/sumomochannel/mita_marin_14176-001.jpg",
      "https://image.av-event.jp/contents/images/35360/cae1a57be0ca5ca0e097ab79603a18a7.jpg",
      "https://pics.dmm.co.jp/digital/video/5050mbrba00123/5050mbrba00123jp-7.jpg",
      "https://awsimgsrc.dmm.co.jp/pics_dig/digital/video/sivr00314/sivr00314jp-6.jpg",
      "https://blog-imgs-175.fc2.com/s/u/m/sumomochannel/mita_marin_14008-001s.jpg",
      "https://livedoor.sp.blogimg.jp/sougomatomechannel/imgs/3/f/3f1e5ee2.jpg",
      "https://fuzokuavlab.com/wp-content/uploads/2024/04/sone00191jp-1.jpg",
      "https://img.bakufu.jp/wp-content/uploads/2024/01/240111a_0003.jpg",
      "https://pbs.twimg.com/media/GBi6gJeasAAbUh0.jpg:large",
    ]
  }],
  ["梓ヒカリ", {
    "primaryName": "梓ヒカリ",
    "alternativeNames": ["梓ヒカリ"],
    "profileImage": "https://m.media-amazon.com/images/I/81mUzOL2-rL._UF894,1000_QL80_.jpg",
    "backgroundImage": "https://pics.dmm.co.jp/digital/video/ipzz00087/ipzz00087pl.jpg",
    "age": "27",
    "height": "155 cm",
    "weight": "50 kg",
    "nationality": "日本",
    "other": "专业演员",
    "bio": "梓ヒカリ（あずさ ひかり），1998年2月7日出生于日本，是一位备受瞩目的成人影片女演员，以其甜美外貌和F杯丰满身材在业界迅速走红。她于2020年3月13日以IdeaPocket专属女优身份正式出道，凭借155厘米的身高、50公斤的体重以及B89(F)-W54-H86的完美比例吸引了大量粉丝。梓ヒカリ的作品风格多样，涵盖从清纯少女到大胆痴女的多种角色，展现了她出色的表演张力和独特的魅力。她隶属于Body Corporation经纪公司，活跃于多个知名片商，并在FANZA排行榜上屡获佳绩，如2024年3月的《生ハメ！膣内射精！！ 中出し解禁 梓ヒカリ》登顶第6位。作为一名年轻而充满活力的演员，她持续为日本AV界带来高质量的内容，深受观众喜爱。",
    galleryImages: [
      "https://stat.ameba.jp/user_images/20221029/12/shiruba-in-the-world/fb/3a/j/o0864108015195070533.jpg",
      "https://ignewsimg.s3.ap-northeast-1.wasabisys.com/CKSzVR0hzKb",
      "https://ignewsimg.s3.ap-northeast-1.wasabisys.com/CMT2JBqhfLF",
      "https://ignewsimg.s3.ap-northeast-1.wasabisys.com/CVR61vPPMIr",
      "https://eromitai.com/wordpress/wp-content/uploads/2024/04/azusa_hikari2404020.jpg",
      "https://eromitai.com/wordpress/wp-content/uploads/2023/04/azusa_hikari2304020.jpg",
      "https://erotok.com/wp-content/uploads/20241226_1/image3.webp",
      "https://shiofukikantei.com/wp-content/uploads/2021/05/ipx00523jp-8.jpg",
      "https://geinou-nude.com/wp-content/uploads/2024/04/hikari_004-1-700x979.jpg",
      "https://livedoor.blogimg.jp/suntou1976-yik0nma6/imgs/6/f/6f1e7e73.jpg",
      "https://eromitai.com/wordpress/wp-content/uploads/2024/04/azusa_hikari2404018.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGAt2InSXlsr2ku4uRzph8NXScNs3VcuoBYLifzm-lGkMMIQ9dSWSE2F0&s=10",
      "https://cdn.up-timely.com/image/4/content/60735/AhTF6pJluqntMsEIhwn6FVZc166TB6tXSLKMz2B6.jpg",
      "https://pbs.twimg.com/media/Fx7KqmMaYAA6F83?format=jpg&name=large",
      "https://awsimgsrc.dmm.co.jp/pics_dig/digital/video/ipvr00148/ipvr00148jp-4.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTN6FshdZmtqvSXj5XmbWqOrE-0OVCF4gJflIbqBdHB5nkx-XoK6ku0fKw&s=10",
      "https://cdn.suruga-ya.jp/database/pics_webp/game/gg468222.jpg.webp",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIM0tmJMxamuhtFVoxTrZEeDvhTHYaCtSyxJME6idC0wXjr5GUp84hi3I&s=10",
      "https://image-optimizer.osusume.dmm.co.jp/event/1059342/33554/file_path=390568eddfcd528343a652ac40b1676c.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIM0tmJMxamuhtFVoxTrZEeDvhTHYaCtSyxJME6idC0wXjr5GUp84hi3I&s=10",
    ]
  }],
  ["凪ひかる", {
    "primaryName": "凪ひかる",
    "alternativeNames": ["凪ひかる", "汐世", "有栖花あか"],
    "profileImage": "https://melonbooks.akamaized.net/user_data/packages/resize_image.php?image=216001080555.jpg",
    "backgroundImage": "https://pics.dmm.co.jp/digital/video/ofje00558/ofje00558pl.jpg",
    "age": "28",
    "height": "162 cm",
    "weight": "50 kg",
    "nationality": "日本",
    "other": "专业演员",
    "bio": "凪ひかる（なぎ ひかる），1997年4月6日出生于日本，是一位备受瞩目的成人影片女演员，以其J杯（105cm）的丰满胸部和清纯美貌在业界迅速走红。她于2020年10月7日以有栖花あか之名在S1 NO.1 STYLE旗下出道，凭借162厘米的身高、50公斤的体重以及B105(J)-W59-H88的惊艳身材吸引了大量粉丝。2021年12月改名为汐世，2022年11月再次改名为凪ひかる并转投Eightman Production，继续活跃于S1专属女优行列。凪ひかる的作品风格多样，从清纯少女到大胆痴女角色均有出色表现，多次登上FANZA排行榜首位，如她的首部作品获得800多条好评，被誉为“安齋らら再来”。作为一名专业演员，她以自然魅力和高超演技持续为日本AV界注入活力，深受观众喜爱。",
    galleryImages: [
      "https://photos.xgroovy.com/contents/albums/sources/630000/630086/684652.jpg",
      "https://photos.xgroovy.com/contents/albums/sources/853000/853686/1019329.jpg",
      "https://melonbooks.akamaized.net/user_data/packages/resize_image.php?image=216001062101.jpg",
      "https://cdn.suruga-ya.jp/database/pics_light/game/gn488994.jpg",
      "https://cdn.suruga-ya.jp/database/pics_webp/game/gn635045.jpg.webp",
      "https://auctions.c.yimg.jp/images.auctions.yahoo.co.jp/image/dr000/auc0106/user/8ccfaf4ba962d6812b8157e877cad1529ab624971fcd4e00daf5513c4af23778/i-img819x1200-17511859225615r3qwtw35.jpg",
      "https://blog-imgs-167.fc2.com/e/r/o/erog/Nagi_hikaru_20230712_004.jpg",
      "https://ivworld.xyz/wp-content/gallery/2022/8887-1.jpg",
      "https://livedoor.blogimg.jp/ippondemoninjin-ketpxywo/imgs/f/2/f226a7e4-s.jpg",
      "https://reprint-kh.com/wp-content/gallery/nagihikaru1/cache/nagihikaru1071.png-nggid06470276-ngg0dyn-800x600-00f0w010c010r110f110r010t010.png",
      "https://fj.qixianzi.com/uploads/2023/04/02/daebb4b3760e4829bba397cd3da9fb46.jpg",
      "https://cdn.suruga-ya.jp/database/pics_light/game/gn398842.jpg",
      "https://blog-imgs-164.fc2.com/e/r/o/erog/Nagi_Hikaru_20230223_009.jpg",
      "https://blog-imgs-164.fc2.com/e/r/o/erog/Nagi_Hikaru_20230223_002.jpg",
      "https://www.xasiat.com/get_image/2/095440e0fc59dee464cfc142cbc3a575/sources/8000/8292/600628.jpg/",
      "https://geinou-nude.com/wp-content/uploads/2024/01/shio_020-666x1000.jpg",
      "https://awsimgsrc.dmm.co.jp/pics_dig/digital/video/ssis00668/ssis00668jp-5.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLt036s2n3_Bgq3alKJZcdpDM1oHYaYDSnzh9TrycMtzqfR3Vw-ECthDlc&s=10",
      "https://awsimgsrc.dmm.co.jp/pics_dig/digital/video/sivr00386/sivr00386jp-12.jpg",
      "https://m.media-amazon.com/images/I/811dSXK+kIL._UF1000,1000_QL80_.jpg",
    ]
  }],
  ["響蓮", {
    "primaryName": "響蓮",
    "alternativeNames": ["響蓮"],
    "profileImage": "https://img.pali.zone/data-optim/adult-videos/EBWH-118/thumb/EBWH-118.jpg",
    "backgroundImage": "https://fourhoi.com/ebwh-058/cover-t.jpg",
    "age": "22",
    "height": "160 cm",
    "weight": "45 kg",
    "nationality": "日本",
    "other": "专业演员",
    "bio": "響蓮（ひびき れん），2002年12月4日出生于日本，是一位备受关注的成人影片女演员，以其“令和最強のえろ娘”和“超新人級 史上最年少のセックス3冠王”的惊人出道在业界迅速走红。她于2023年4月4日以kawaii*专属女优身份正式出道，凭借160厘米的身高、45公斤的纤细体重以及B85(F)-W50-H88的完美身材吸引了大量粉丝。響蓮以其异常性癖、潮吹和极致痉挛的表演风格著称，作品涵盖从激烈高潮到情感丰富的剧情，展现了她出色的身体反应和魅力。她的作品多次登上FANZA排行榜，如2024年7月的《見た目で選んだ俺の愛人はエグいほどドスケベ絶倫 ～チ●ポ欲しがり美女たちの奪い合い中出し性交～ 響蓮 設楽ゆうひ》位列第三。她隶属于Bstar经纪公司，兴趣包括激安居酒屋一人饮酒，自述性格亲切却拥有超高超的性欲。作为一名年轻而充满潜力的演员，她持续为日本AV界带来震撼的内容，深受观众喜爱。",
    galleryImages: [
      "https://pbs.twimg.com/media/GD9BBxHaAAAPkFS.jpg:large",
      "https://picture.yoshiclub.xyz/20231016/0823d777-69f3-49e9-b831-ffb55e30bd68.jpg",
      "https://picture.yoshiclub.xyz/20231016/44441844-254d-4de1-a162-979e556d6685.jpg",
      "https://cdn.suruga-ya.jp/database/pics_webp/game/gn361203.jpg.webp",
      "https://awsimgsrc.dmm.co.jp/pics_dig/digital/video/ebvr00092/ebvr00092jp-8.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8Cyfy3uCiAlGEnneYBfl5mEnwttnmDMwytBRFDB2Jpl1bWeaSc84hNw&s=10",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQHL-sYYSOjrJ8BPi_OGwAyE5hZri2Y2Ja-hMzv51nYkKCj9q1YX3Tzy0&s=10",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYCsQaJY6Ep_9ziSYim5ZqHoTiIS59R-K4uIT-O4lpEZUCqfi-D9MzbB0&s=10",
      "https://img.pali.zone/data-optim/adult-videos/OAE-243/thumb/OAE-243.jpg",
      "https://picture.yoshiclub.xyz/20231016/4aab7cc9-de04-467f-81eb-4c03a092c337.jpg",
      "https://cdn.suruga-ya.jp/database/pics_webp/game/gn274916.jpg.webp",
      "https://img.pali.zone/data-optim/adult-videos/EBWH-137/thumb/EBWH-137.jpg",
      "https://www.zenra.net/imgcache/original/blog_photos/4/ren-hibiki-jav-intro-1.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShsH2rNOJjnxp6or7gaFuAZZ45W9T2Zyvc0Aw-DRIjchtSPnYF2IvU2lU&s=10",
      "https://cdn.suruga-ya.jp/database/pics_webp/game/gn520606.jpg.webp",
      "https://img.buomtv.live/data-optim/adult-videos/TPPN-254/thumb/TPPN-254.webp",
      "https://uuribao.uxscdn.com/wp-content/uploads/2023/03/8715b115dc63a0f.jpg",
      "https://www.zenra.net/imgcache/original/blog_photos/4/ren-hibiki-jav-profile-1.jpg",
      "https://preview.redd.it/ren-hibiki-%E9%9F%BF%E8%93%AE-v0-qhhynouw6hee1.jpeg?width=640&crop=smart&auto=webp&s=057e2c9e74f46309793e1f77c0de6c331c359167",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE1jQpzJWnO8g7aO838JxMvxRG2B3PnjTP_1gLLrE5wBqBeW2_UmVGLVA&s=10",
      "https://pbs.twimg.com/media/F3xAlMsaMAA46LA.jpg:large",
      "https://livedoor.blogimg.jp/johoten/imgs/d/3/d38f3e21.jpg",
    ]
  }],
  ["野々花あかり", {
    "primaryName": "野々花あかり",
    "alternativeNames": ["野々花あかり"],
    "profileImage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwgS3I_gbvOk1At5RwlsfK3wQoV1WHe5L2HCLsMpvY7Zn9vkem3_Tc-H9B&s=10",
    "backgroundImage": "https://2nine.net/preview/80/b/XLxyBjbG8q-800.jpg?v=1757658924",
    "age": "22",
    "height": "155 cm",
    "weight": "45 kg",
    "nationality": "日本籍",
    "other": "专业演员",
    "bio": "野々花あかり (Akari Nonoka) 出生于2003年的日本，是一位迅速走红的成人影片演员。她身高155厘米，体重45公斤，以其自然魅力和多才多艺的表演风格受到关注。2022年，她通过Moodyz和DANDY出道，作品涵盖浪漫剧情和高强度角色扮演等多样化风格，在日本AV界展现出专业态度和高质量内容，深受粉丝喜爱。",
    galleryImages: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSke14lu_qinzxzymLMI2gUsVYvCvGV-lLdiec7EqPMKHgStd0M3cxg4xt1&s=10",
      "https://pics.dmm.co.jp/digital/video/1dandy00912/1dandy00912jp-13.jpg",
      "https://pics.dmm.co.jp/digital/video/1dandy00912/1dandy00912jp-6.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjTiIHH5LJkJLPbK-p-19jUHFCxwhADWtE0a-Hgk0TETRfriYqUKiUh9I&s=10",
      "https://pics.dmm.co.jp/digital/video/1dandy00912/1dandy00912jp-17.jpg",
      "https://pics.dmm.co.jp/digital/video/1dandy912/1dandy912jp-8.jpg",
      "https://cdn-1.ggjav.com/media/preview/252053_17.jpg",
      "https://pics.dmm.co.jp/digital/video/1dandy00912/1dandy00912jp-5.jpg",
      "https://pics.dmm.co.jp/digital/video/1dandy00912/1dandy00912jp-3.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZeiLhxThPvp22mQaCqM-GuWPJctjdCsM5mp9P1QcpiJ1mVHxpLShOc5g&s=10",
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

