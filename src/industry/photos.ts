// Wikimedia Commons の写真（public/images/works/）。ライセンス表記のため撮影者・ライセンス・出典を残す。
// 取得日：2026-10-16
export interface Photo {
  artist: string;
  license: string;
  source: string;
}

export const PHOTOS: Record<string, Photo> = {
  kasumigaseki: {
    artist: 'Rs1421',
    license: 'CC BY-SA 3.0',
    source: 'https://commons.wikimedia.org/wiki/File:Kasumigaseki-Building-01.jpg',
  },
  nact: {
    artist: 'Kakidai',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:2018_National_Art_Center,_Tokyo_2.jpg',
  },
  'saitama-stadium': {
    artist: 'SKD',
    license: 'CC BY-SA 3.0',
    source:
      'https://commons.wikimedia.org/wiki/File:%E5%9F%BC%E7%8E%89%E3%82%B9%E3%82%BF%E3%82%B8%E3%82%A2%E3%83%A02002%EF%BC%88%E6%AD%A3%E9%9D%A2%EF%BC%89.jpg',
  },
  skytree: {
    artist: 'Kakidai',
    license: 'CC BY-SA 3.0',
    source: 'https://commons.wikimedia.org/wiki/File:Tokyo_Skytree_2014_%E2%85%A2.jpg',
  },
  'umeda-sky': {
    artist: 'Kakidai',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:2018_Umeda_Sky_Building.jpg',
  },
  'kyoto-station': { artist: 'MaedaAkihiko', license: 'CC0', source: 'https://commons.wikimedia.org/wiki/File:Kyoto-STA_Central.jpg' },
  sunshine60: { artist: 'Kakidai', license: 'CC BY-SA 3.0', source: 'https://commons.wikimedia.org/wiki/File:Sunshine_60.JPG' },
  azabudai: {
    artist: 'Supanut Arunoprayote',
    license: 'CC BY 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Azabudai_Hills_Garden_Plaza_A_and_B_20241021.jpg',
  },
  'yokohama-stadium': {
    artist: 'Haruakibay',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Yokohama_stadium_2020_wing.jpg',
  },
  'national-stadium': {
    artist: 'Akonnchiroll',
    license: 'CC BY 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Japan_National_Stadium_2024_1.jpg',
  },
  'shinjuku-center': {
    artist: 'Rs1421',
    license: 'CC BY-SA 3.0',
    source: 'https://commons.wikimedia.org/wiki/File:Shinjuku-Center-Building-01.jpg',
  },
  'toyota-stadium': {
    artist: 'Umako',
    license: 'CC0',
    source: 'https://commons.wikimedia.org/wiki/File:Nagoya_Grampus_game_in_Toyota_Stadium_100814.JPG',
  },
  harukas: {
    artist: 'Oilstreet',
    license: 'CC BY 2.5',
    source: 'https://commons.wikimedia.org/wiki/File:Abeno_Harukas_Osaka_Japan01-r.jpg',
  },
  'tokyo-dome': {
    artist: 'DX Broadrec',
    license: 'CC BY-SA 3.0',
    source: 'https://commons.wikimedia.org/wiki/File:Tokyo_Dome_2007-12.jpg',
  },
  midtown: { artist: 'Kakidai', license: 'CC BY-SA 3.0', source: 'https://commons.wikimedia.org/wiki/File:Tokyo_Midtown.2.JPG' },
  landmark: {
    artist: 'Sunwater~jawiki',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Yokohama_Landmark_Tower_202207.jpg',
  },
  forum: {
    artist: 'MaedaAkihiko',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Tokyo-International-Forum_Glass-Building_Outside.jpg',
  },
  toranomon: {
    artist: '稲妻ノ歯鯨',
    license: 'CC BY-SA 4.0',
    source: 'https://commons.wikimedia.org/wiki/File:%E8%99%8E%E3%83%8E%E9%96%80%E3%83%92%E3%83%AB%E3%82%BA%E5%85%A8%E6%99%AF2022.jpg',
  },
  kinsan: { artist: '妖精書士', license: 'CC0', source: 'https://commons.wikimedia.org/wiki/File:Kinsan_building.jpg' },
  kabukiza: { artist: 'Kakidai', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:2019_Kabuki-za.jpg' },
};
